import { useRootStore } from '../../store/root'
import { useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { forMatterOpenTrades } from './utils/utils'
import { Contract } from 'ethers'
import trading_storage from 'abi/trading_storage_v5.json'
import { Tuple } from '../../components/Trades/type'

export const useGetUserOpenTrade = () => {
  const { account, provider } = useWeb3React()
  const [userOpenTrades, setUserOpenTrades] = useState([] as Tuple[])
  const setUserOpenTradeList = useRootStore((store) => store.setUserOpenTradeList)
  const getUserOpenTrade = useCallback(
    async (storageAddress: string, setStore: boolean) => {
      try {
        if (account && provider) {
          //TODO current pairIndex only one , change in next update
          const contract = new Contract(storageAddress, trading_storage.abi, provider)
          const userTotalTrade = await contract.openTradesCount(account, 0)
          const trades = new BigNumber(userTotalTrade._hex).toNumber()
          const task = []
          if (trades > 0) {
            for (let i = 0; i < 3; i++) {
              task.push(contract.openTrades(account, 0, i))
            }
          }
          const res = await Promise.all(task)
          const openTrades = forMatterOpenTrades(res, trades, account)
          console.log('userOpenTrades', openTrades)
          if (setStore) setUserOpenTradeList(openTrades)
          else setUserOpenTrades(openTrades)
        }
      } catch (e) {
        console.log('get user open trades failed!', e)
      }
    },
    [account, provider]
  )

  return { userOpenTrades: userOpenTrades, getUserOpenTrade: getUserOpenTrade }
}
