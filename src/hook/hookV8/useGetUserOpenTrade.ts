import { useRootStore } from '../../store/root'
import { useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { forMatterOpenTrades, isBeingMarketClosed } from './utils/utils'
import { Contract } from 'ethers'
import trading_storage from '../../abi/trading_storage_v5.json'
import { Tuple } from '../../components/Trades/type'
import { ChainId } from '../../constant/chain'

const ARB_TIME_OUT = 100
const DEFAULT_TIME_OUT = 30
const TIME_OUT_CONFIG = [ChainId.ARB_TEST]

export const useGetUserOpenTrade = () => {
  const { account, provider, chainId } = useWeb3React()
  const [userOpenTrades, setUserOpenTrades] = useState([] as Tuple[])
  const setUserOpenTradeList = useRootStore((store) => store.setUserOpenTradeList)
  const tradePairIndex = useRootStore((state) => state.tradePairIndex)

  const getUserOpenTrade = useCallback(
    async (storageAddress: string, setStore: boolean) => {
      try {
        if (account && provider && storageAddress && chainId) {
          // console.log('start useGetUserOpenTrade')
          //TODO current pairIndex only one , change in next update
          const contract = new Contract(storageAddress, trading_storage.abi, provider)
          const userTotalTrade = await contract.openTradesCount(account, tradePairIndex)
          const trades = new BigNumber(userTotalTrade._hex).toNumber()
          const task = []
          if (trades > 0) {
            for (let i = 0; i < 3; i++) {
              task.push(contract.openTrades(account, tradePairIndex, i))
            }
          }
          const res = await Promise.all(task)
          const openTrades = forMatterOpenTrades(res, trades, account, false)
          let userPendingMarketOrder: Tuple[] = []
          const blockNumber = await provider.getBlockNumber()
          const userPendingOrder = await contract.getPendingOrderIds(account)
          const userPendingOrderTask: any[] = []
          userPendingOrder.forEach((orderId: BigNumber) => {
            userPendingOrderTask.push(contract.reqID_pendingMarketOrder(orderId.toString()))
          })
          const userPendingOrderDetails = await Promise.all(userPendingOrderTask)
          userPendingOrderDetails.forEach((details, index) => {
            if (new BigNumber(details.trade.pairIndex._hex).toNumber() === tradePairIndex) {
              const inPending = new BigNumber(blockNumber).isGreaterThan(
                new BigNumber(details.block._hex).plus(
                  TIME_OUT_CONFIG.includes(chainId) ? ARB_TIME_OUT : DEFAULT_TIME_OUT
                )
              )
              const res = forMatterOpenTrades(
                details,
                1,
                account,
                true,
                new BigNumber(userPendingOrder[index]._hex),
                !inPending
              )
              userPendingMarketOrder.push(res[0])
            }
          })
          isBeingMarketClosed(openTrades, userPendingMarketOrder)
          userPendingMarketOrder = userPendingMarketOrder.filter((order) => order.leverage > 0)
          if (setStore) setUserOpenTradeList(openTrades.concat(userPendingMarketOrder))
          else setUserOpenTrades(openTrades)
        }
      } catch (e) {
        console.log('get user open trades failed!', e)
      }
    },
    [account, provider, tradePairIndex, chainId]
  )

  return { userOpenTrades: userOpenTrades, getUserOpenTrade: getUserOpenTrade }
}
