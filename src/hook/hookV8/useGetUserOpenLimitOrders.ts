import { useRootStore } from '../../store/root'
import { useTradingStoreContract } from './useContract'
import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { TupleLimitOrder } from '../../components/Trades/type'
import { eXDecimals } from '../../utils/math'
import { useWeb3React } from '@web3-react/core'

export const useGetUserOpenLimitOrders = (storageAddress: string) => {
  const { account } = useWeb3React()
  const setUserOpenLimitList = useRootStore((store) => store.setUserOpenLimitList)

  const contract = useTradingStoreContract(storageAddress)
  return useCallback(async () => {
    try {
      if (contract && account) {
        //TODO current pairIndex only one , change in next update
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
        console.log('userOpenLimit', userOpenLimit)
        setUserOpenLimitList(userOpenLimit)
      }
    } catch (e) {
      console.log('get user open Limit orders failed! failed!', e)
    }
  }, [contract, account, storageAddress])
}
