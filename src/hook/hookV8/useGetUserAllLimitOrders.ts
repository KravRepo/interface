import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'
import { useRootStore } from '../../store/root'
import { PoolParams } from '../../store/FactorySlice'
import { TupleLimitOrder } from '../../components/Trades/type'
import { Contract } from 'ethers'
import trading_storage from '../../abi/trading_storage_v5.json'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'
import { BASE_PAIR_CONFIG, EXCHANGE_STORAGE_T } from '../../constant/exchange'
import multicall2 from '../../abi/multicall2.json'
import { creatCall, CreatCall, decodeCallResult } from './useContract'
import { useConfig } from './useConfig'

export type UseAllLimitOrders = {
  pool: PoolParams
  tuple: TupleLimitOrder[]
}
// TODO match pair index
export const useGetUserAllLimitOrders = () => {
  const { account, provider } = useWeb3React()
  const config = useConfig()
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const pairConfig = useRootStore((store) => store.pairConfig)

  const setUserAllOpenLimitList = useRootStore((store) => store.setUserAllOpenLimitList)
  return useCallback(async () => {
    try {
      if (allPoolParams.length > 0 && account && provider && config) {
        const storageList: string[] = []
        allPoolParams.forEach((pool) => {
          storageList.push(pool.storageT)
        })
        const useAllLimits: UseAllLimitOrders[] = []
        const multicall = new Contract(config.multicall, multicall2.abi, provider)
        const getAndForMatter = async () => {
          return await Promise.all(
            storageList.map(async (address, index) => {
              const asyncWorker = async () => {
                const contract = new Contract(address, trading_storage.abi, provider)
                if (EXCHANGE_STORAGE_T.includes(address) || pairConfig === BASE_PAIR_CONFIG) {
                  const userTotalLimitTask: CreatCall[] = []
                  const config = Object.keys(pairConfig).map((key) => {
                    return pairConfig[Number(key)]
                  })
                  for (let i = 0; i < config.length; i++) {
                    userTotalLimitTask.push(
                      creatCall(contract.address, contract.interface, 'openLimitOrdersCount', [
                        account,
                        config[i].pairIndex,
                      ])
                    )
                  }
                  const req = await multicall.callStatic.aggregate(userTotalLimitTask)
                  let userTotalLimits = req.returnData
                  userTotalLimits = userTotalLimits.map((pair: string, index: number) => {
                    return {
                      trades: new BigNumber(
                        decodeCallResult(contract.interface, 'openLimitOrdersCount', pair)._hex
                      ).toNumber(),
                      pairIndex: config[index].pairIndex,
                    }
                  })
                  const hasOpenLimitOrderTask: CreatCall[] = []
                  userTotalLimits.forEach((trades: { trades: number; pairIndex: number }) => {
                    if (trades.trades > 0) {
                      for (let i = 0; i < 3; i++) {
                        hasOpenLimitOrderTask.push(
                          creatCall(contract.address, contract.interface, 'hasOpenLimitOrder', [
                            account,
                            trades.pairIndex,
                            i,
                          ])
                        )
                      }
                    }
                  })
                  const hasOpenLimitOrderReq = await multicall.callStatic.aggregate(hasOpenLimitOrderTask)
                  let hasOpenLimitOrderReturnData = hasOpenLimitOrderReq.returnData
                  hasOpenLimitOrderReturnData = hasOpenLimitOrderReturnData.map((has: string) => {
                    return decodeCallResult(contract.interface, 'hasOpenLimitOrder', has)
                  })
                  const hasOpenLimitOrderPair = userTotalLimits.filter(
                    (trades: { trades: number; pairIndex: number }) => trades.trades > 0
                  )
                  const hasOpenLimitOrderArray: { index: number; pairIndex: number }[] = []
                  hasOpenLimitOrderPair.forEach((trades: { trades: number; pairIndex: number }, index: number) => {
                    for (let i = index * 3; i < index * 3 + 3; i++) {
                      if (hasOpenLimitOrderReturnData[i]) {
                        hasOpenLimitOrderArray.push({
                          index: i % 3,
                          pairIndex: trades.pairIndex,
                        })
                      }
                    }
                  })
                  const positionTask: CreatCall[] = []
                  // let totalCount = 0
                  hasOpenLimitOrderArray.forEach((item: { index: number; pairIndex: number }) => {
                    positionTask.push(
                      creatCall(contract.address, contract.interface, 'getOpenLimitOrder', [
                        account,
                        item.pairIndex,
                        item.index,
                      ])
                    )
                  })
                  const limitOrderReq = await multicall.callStatic.aggregate(positionTask)
                  let limitOrderWithPair = limitOrderReq.returnData
                  limitOrderWithPair = limitOrderWithPair.map((res: string) => {
                    return decodeCallResult(contract.interface, 'getOpenLimitOrder', res)
                  })
                  const userOpenLimitWithPair: TupleLimitOrder[] = []
                  limitOrderWithPair.forEach((item: any) => {
                    userOpenLimitWithPair.push({
                      block: new BigNumber(item.block._hex).toNumber(),
                      buy: item.buy,
                      index: new BigNumber(item.index._hex).toNumber(),
                      leverage: new BigNumber(item.leverage._hex).toNumber(),
                      maxPrice: eXDecimals(item.maxPrice._hex, 10),
                      minPrice: eXDecimals(item.minPrice._hex, 10),
                      pairIndex: new BigNumber(item.pairIndex._hex).toNumber(),
                      positionSize: eXDecimals(item.positionSize._hex, 18),
                      sl: eXDecimals(item.sl._hex, 18),
                      spreadReductionP: eXDecimals(item.spreadReductionP._hex, 10),
                      tokenId: new BigNumber(item.tokenId._hex).toNumber(),
                      trader: account,
                      tp: eXDecimals(item.tp._hex, 18),
                    })
                  })
                  if (userOpenLimitWithPair.length > 0) {
                    useAllLimits.push({
                      pool: allPoolParams[index],
                      tuple: userOpenLimitWithPair,
                    })
                  }
                } else {
                  const userTotalTrade = await contract.openLimitOrdersCount(account, 0)
                  const trades = new BigNumber(userTotalTrade._hex).toNumber()
                  const task = []
                  const hasOpenLimitOrderArray = []
                  if (trades > 0) {
                    for (let i = 0; i < 3; i++) {
                      const has = await contract.hasOpenLimitOrder(account, 0, i)
                      if (has) {
                        hasOpenLimitOrderArray.push(i)
                      }
                    }
                  }

                  for (let i = 0; i < hasOpenLimitOrderArray.length; i++) {
                    task.push(contract.getOpenLimitOrder(account, 0, hasOpenLimitOrderArray[i]))
                  }
                  const res = await Promise.all(task)
                  const userOpenLimit: TupleLimitOrder[] = []
                  for (let i = 0; i < trades; i++) {
                    userOpenLimit.push({
                      block: new BigNumber(res[i].block._hex).toNumber(),
                      buy: res[i].buy,
                      index: new BigNumber(res[i].index._hex).toNumber(),
                      leverage: new BigNumber(res[i].leverage._hex).toNumber(),
                      maxPrice: eXDecimals(res[i].maxPrice._hex, 10),
                      minPrice: eXDecimals(res[i].minPrice._hex, 10),
                      pairIndex: new BigNumber(res[i].pairIndex._hex).toNumber(),
                      positionSize: eXDecimals(res[i].positionSize._hex, 18),
                      sl: eXDecimals(res[i].sl._hex, 18),
                      spreadReductionP: eXDecimals(res[i].spreadReductionP._hex, 10),
                      tokenId: new BigNumber(res[i].tokenId._hex).toNumber(),
                      trader: account,
                      tp: eXDecimals(res[i].tp._hex, 18),
                    })
                  }
                  if (userOpenLimit.length > 0) {
                    useAllLimits.push({
                      pool: allPoolParams[index],
                      tuple: userOpenLimit,
                    })
                  }
                }
              }
              return await asyncWorker()
            })
          )
        }
        await getAndForMatter()
        setUserAllOpenLimitList(useAllLimits)
      }
    } catch (e) {}
  }, [allPoolParams, account, provider, config])
}
