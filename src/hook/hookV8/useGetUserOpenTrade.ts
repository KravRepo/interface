import { useRootStore } from '../../store/root'
import { useTradingStoreContract } from './useContract'
import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { forMatterOpenTrades } from './utils/utils'

export const useGetUserOpenTrade = (storageAddress: string) => {
  const { account } = useWeb3React()
  const setUserOpenTradeList = useRootStore((store) => store.setUserOpenTradeList)
  const contract = useTradingStoreContract(storageAddress)
  return useCallback(async () => {
    try {
      if (contract && account) {
        //TODO current pairIndex only one , change in next update
        const userTotalTrade = await contract.openTradesCount(account, 0)
        const trades = new BigNumber(userTotalTrade._hex).toNumber()
        const task = []
        if (trades > 0) {
          for (let i = 0; i < 3; i++) {
            task.push(contract.openTrades(account, 0, i))
          }
        }
        const res = await Promise.all(task)
        const userOpenTrades = forMatterOpenTrades(res, trades, account)
        console.log('userOpenTrades', userOpenTrades)
        setUserOpenTradeList(userOpenTrades)
      }
    } catch (e) {
      console.log('get user open trades failed!', e)
    }
  }, [contract, account, storageAddress])
}
