import { useCallback } from 'react'
import { useRootStore } from '../../store/root'
import { useWeb3React } from '@web3-react/core'
// import { Contract } from 'ethers'
// import trading_storage from 'abi/trading_storage_v5.json'
// import BigNumber from 'bignumber.js'
import { Tuple } from '../../components/Trades/type'
import { PoolParams } from '../../store/FactorySlice'
import { Contract } from 'ethers'
import trading_storage from '../../abi/trading_storage_v5.json'
import BigNumber from 'bignumber.js'
import { forMatterOpenTrades } from './utils/utils'

export type UseAllOpenTrades = {
  pool: PoolParams
  tuple: Tuple[]
}

export const useGetUserAllOpenTrades = () => {
  const { account, provider } = useWeb3React()
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const setUserAllOpenTradeList = useRootStore((store) => store.setUserAllOpenTradeList)
  const getUserAllOpenTrades = useCallback(async () => {
    try {
      if (allPoolParams.length > 0 && account && provider) {
        const storageList: string[] = []
        allPoolParams.forEach((pool) => {
          storageList.push(pool.storageT)
        })
        const allOpenTrades: UseAllOpenTrades[] = []
        const getAndForMatter = async () => {
          return await Promise.all(
            storageList.map(async (address, index) => {
              const asyncWorker = async () => {
                //TODO current pairIndex only one , change in next update
                const contract = new Contract(address, trading_storage.abi, provider)
                const userTotalTrade = await contract.openTradesCount(account, 0)
                const trades = new BigNumber(userTotalTrade._hex).toNumber()
                const task = []
                if (trades > 0) {
                  for (let i = 0; i < 3; i++) {
                    task.push(contract.openTrades(account, 0, i))
                  }
                }
                const res = await Promise.all(task)
                const openTrades = forMatterOpenTrades(res, trades, account, false)
                if (openTrades.length > 0) {
                  allOpenTrades.push({
                    pool: allPoolParams[index],
                    tuple: openTrades,
                  })
                }
              }
              return await asyncWorker()
            })
          )
        }
        await getAndForMatter()
        setUserAllOpenTradeList(allOpenTrades)
      }
    } catch (e) {}
  }, [allPoolParams, account, provider])

  return { getUserAllOpenTrades: getUserAllOpenTrades }
}
