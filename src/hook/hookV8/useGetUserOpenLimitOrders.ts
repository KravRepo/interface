import { useRootStore } from '../../store/root'
import { useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import { TupleLimitOrder } from '../../components/Trades/type'
import { eXDecimals } from '../../utils/math'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'ethers'
import trading_storage from '../../abi/trading_storage_v5.json'

export const useGetUserOpenLimitOrders = () => {
  const { account, provider } = useWeb3React()
  const [userLimitOrders, setUserLimitOrders] = useState([] as TupleLimitOrder[])
  const setUserOpenLimitList = useRootStore((store) => store.setUserOpenLimitList)
  const tradePairIndex = useRootStore((state) => state.tradePairIndex)

  const getUserOpenLimitOrders = useCallback(
    async (storageAddress: string, setStore: boolean) => {
      try {
        if (provider && account && storageAddress) {
          //TODO current pairIndex only one , change in next update
          const contract = new Contract(storageAddress, trading_storage.abi, provider)
          const userTotalTrade = await contract.openLimitOrdersCount(account, tradePairIndex)
          const trades = new BigNumber(userTotalTrade._hex).toNumber()
          const task = []
          const hasOpenLimitOrderArray = []
          if (trades > 0) {
            for (let i = 0; i < 3; i++) {
              const has = await contract.hasOpenLimitOrder(account, tradePairIndex, i)
              if (has) {
                hasOpenLimitOrderArray.push(i)
              }
            }
          }

          for (let i = 0; i < hasOpenLimitOrderArray.length; i++) {
            task.push(contract.getOpenLimitOrder(account, tradePairIndex, hasOpenLimitOrderArray[i]))
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
          if (setStore) setUserOpenLimitList(userOpenLimit)
          else setUserLimitOrders(userOpenLimit)
        }
      } catch (e) {
        console.log('get user open Limit orders failed! failed!', e)
      }
    },
    [provider, account, tradePairIndex]
  )

  return { getUserOpenLimitOrders: getUserOpenLimitOrders, userLimitOrders: userLimitOrders }
}
