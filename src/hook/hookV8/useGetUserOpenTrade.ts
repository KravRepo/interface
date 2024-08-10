import { useRootStore } from '../../store/root'
import { useCallback, useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { forMatterOpenTrades, isBeingMarketClosed } from './utils/utils'
import { TradingStorageABI } from '../../abi/deployed/TradingStorageABI'
import { Tuple } from '../../components/Trades/type'
import { useContract } from './useContract'
import { useSingleCallResult, useSingleContractMultipleData } from '../multicall'
import useBlockNumber from '../useBlockNumber'

const ARB_TIME_OUT = 100
const DEFAULT_TIME_OUT = 30
const TIME_OUT_CONFIG = [421613]

export const useGetUserOpenTrade = (count?: number) => {
  const { chainId, account } = useWeb3React()
  const [userOpenTrades, setUserOpenTrades] = useState([] as Tuple[])
  const setUserOpenTradeList = useRootStore((store) => store.setUserOpenTradeList)
  const tradePairIndex = useRootStore((state) => state.tradePairIndex)
  const tradePool = useRootStore((state) => state.tradePool)
  const storageAddress = useMemo(() => tradePool.storageT, [tradePool.storageT])
  const StorageContract = useContract(storageAddress, TradingStorageABI)
  const blockNumber = useBlockNumber()

  const args = useMemo(() => {
    const tasksArgs = []
    for (let i = 0; i < 3; i++) {
      tasksArgs.push([account, tradePairIndex, i])
    }
    return tasksArgs
  }, [account, tradePairIndex])

  // const args2 = useMemo(() => {
  //   const tasksArgs = []
  //   for (let i = 0; i < 3; i++) {
  //     tasksArgs.push([account, tradePairIndex])
  //   }
  //   return tasksArgs
  // }, [account, tradePairIndex])

  const data = useSingleContractMultipleData(StorageContract, 'openTrades', args)

  // const data2 = useSingleContractMultipleData(StorageContract, 'pendingMarketOpenCount', args2)
  // console.log({ data, data2 })

  const pendingOerderIdArg = useMemo(() => [account], [account])

  const userPendingOrderIds = useSingleCallResult(StorageContract, 'getPendingOrderIds', pendingOerderIdArg)

  const pendingOrderIds = useMemo(() => {
    if (!userPendingOrderIds.result) return []
    else {
      const ids: any[] = []
      userPendingOrderIds.result[0].forEach((orderId: any) => {
        ids.push([orderId.toString()])
      })
      return ids
    }
  }, [userPendingOrderIds.result])

  const userPendingOrderDetailsRaw = useSingleContractMultipleData(
    StorageContract,
    'reqID_pendingMarketOrder',
    pendingOrderIds
  )

  const openTrades = useMemo(() => {
    if (!account) return []
    const trades = data
      .map((r) => {
        return r.result
          ? forMatterOpenTrades([r.result] as any[], 1, account, false, undefined, undefined, tradePool.decimals)
          : undefined
      })
      .reduce((acc, i) => {
        if (!!i && i.length > 0) {
          acc?.push(i[0])
        }
        return acc
      }, [])

    return trades
  }, [account, data, tradePool.decimals])

  const userPendingMarketOrder = useMemo(() => {
    const Order = [] as any[]
    userPendingOrderDetailsRaw.forEach((call, index) => {
      if (!call.result || !blockNumber || !chainId || !account) return
      const detailRaw = call.result as any
      if (new BigNumber(detailRaw.trade.pairIndex._hex).toNumber() === tradePairIndex) {
        const details: any = {}
        details.index = detailRaw.trade.index
        details.buy = detailRaw.trade.buy
        details.initialPosToken = detailRaw.trade.initialPosToken
        details.leverage = detailRaw.trade.leverage
        details.openPrice = detailRaw.trade.openPrice
        details.pairIndex = detailRaw.trade.pairIndex
        details.positionSizeDai = detailRaw.trade.positionSizeDai
        details.sl = detailRaw.trade.sl
        details.tp = detailRaw.trade.tp
        details.trader = detailRaw.trade.trader
        details.block = detailRaw.block

        const inPending = new BigNumber(blockNumber).isGreaterThan(
          new BigNumber(details.block._hex).plus(TIME_OUT_CONFIG.includes(chainId) ? ARB_TIME_OUT : DEFAULT_TIME_OUT)
        )
        const res = forMatterOpenTrades(
          [details],
          1,
          account,
          true,
          new BigNumber(pendingOrderIds[index]._hex),
          !inPending,
          tradePool.decimals
        )
        Order.push(res[0])
      }
    })

    return Order
  }, [account, blockNumber, chainId, pendingOrderIds, tradePairIndex, tradePool.decimals, userPendingOrderDetailsRaw])

  useEffect(() => {
    isBeingMarketClosed(openTrades ?? [], userPendingMarketOrder)
    setUserOpenTradeList((openTrades ?? []).concat(...userPendingMarketOrder))
    setUserOpenTrades(openTrades ?? [])
  }, [openTrades, setUserOpenTradeList, userPendingMarketOrder])

  const getUserOpenTrade = useCallback(async (storageAddress: string, setStore: boolean) => {
    // try {
    //   if (provider && account && StorageContract && blockNumber && chainId !== undefined) {
    //     const contract = StorageContract
    //     const userTotalTrade = await contract.openTradesCount(account, tradePairIndex)
    //     const trades = new BigNumber(userTotalTrade._hex).toNumber()
    //     const task = []
    //     if (trades > 0) {
    //       for (let i = 0; i < 3; i++) {
    //         task.push(contract.openTrades(account, tradePairIndex, i))
    //       }
    //     }
    //     const res = await Promise.all(task)
    //     const openTrades = forMatterOpenTrades(res, trades, account, false)
    //     let userPendingMarketOrder: Tuple[] = []
    //     const blockNumber = await provider.getBlockNumber()
    //     const userPendingOrder = await contract.getPendingOrderIds(account)
    //     const userPendingOrderTask: any[] = []
    //     userPendingOrder.forEach((orderId: BigNumber) => {
    //       userPendingOrderTask.push(contract.reqID_pendingMarketOrder(orderId.toString()))
    //     })
    //     const userPendingOrderDetails = await Promise.all(userPendingOrderTask)
    //     userPendingOrderDetails.forEach((details, index) => {
    //       if (new BigNumber(details.trade.pairIndex._hex).toNumber() === tradePairIndex) {
    //         const inPending = new BigNumber(blockNumber).isGreaterThan(
    //           new BigNumber(details.block._hex).plus(
    //             TIME_OUT_CONFIG.includes(chainId) ? ARB_TIME_OUT : DEFAULT_TIME_OUT
    //           )
    //         )
    //         const res = forMatterOpenTrades(
    //           details,
    //           1,
    //           account,
    //           true,
    //           new BigNumber(userPendingOrder[index]._hex),
    //           !inPending
    //         )
    //         userPendingMarketOrder.push(res[0])
    //       }
    //     })
    //     isBeingMarketClosed(openTrades, userPendingMarketOrder)
    //     userPendingMarketOrder = userPendingMarketOrder.filter((order) => order.leverage > 0)
    //     if (setStore) setUserOpenTradeList(openTrades.concat(userPendingMarketOrder))
    //     else setUserOpenTrades(openTrades)
    //   }
    // } catch (e) {
    //   console.error('get user open trades failed!', e)
    // }
  }, [])

  return { userOpenTrades, getUserOpenTrade }
}
