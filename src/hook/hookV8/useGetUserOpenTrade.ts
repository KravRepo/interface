import { useRootStore } from '../../store/root'
import { useTradingStoreContract } from './useContract'
import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { Tuple } from 'components/Trades/type'
import { eXDecimals } from '../../utils/math'
import { useWeb3React } from '@web3-react/core'

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
        let res = await Promise.all(task)
        res = res.filter((item) => new BigNumber(item.leverage._hex).isGreaterThan(0))
        const userOpenTrades: Tuple[] = []
        for (let i = 0; i < trades; i++) {
          userOpenTrades.push({
            buy: res[i].buy,
            index: new BigNumber(res[i].index._hex).toNumber(),
            initialPosToken: eXDecimals(res[i].initialPosToken._hex, 18),
            trader: account,
            sl: eXDecimals(res[i].sl._hex, 10),
            tp: eXDecimals(res[i].tp._hex, 10),
            pairIndex: new BigNumber(res[i].pairIndex._hex).toNumber(),
            //TODO open price decimals is 10?
            openPrice: eXDecimals(res[i].openPrice._hex, 10),
            leverage: new BigNumber(res[i].leverage._hex).toNumber(),
            positionSizeDai: eXDecimals(res[i].positionSizeDai._hex, 18),
          })
        }
        console.log('userOpenTrades', userOpenTrades)
        setUserOpenTradeList(userOpenTrades)
      }
    } catch (e) {
      console.log('get user open trades failed!', e)
    }
  }, [contract, account, storageAddress])
}
