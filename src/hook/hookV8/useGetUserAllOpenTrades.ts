import { useCallback, useEffect, useState } from 'react'
import { useRootStore } from '../../store/root'
import { useWeb3React } from '@web3-react/core'
import { useGetUserOpenTrade } from './useGetUserOpenTrade'
import { Tuple } from '../../components/Trades/type'
import { PoolParams } from '../../store/FactorySlice'

export type UseAllOpenTrades = {
  pool: PoolParams
  tuple: Tuple[]
}

export const useGetUserAllOpenTrades = () => {
  const { account, provider } = useWeb3React()
  const { userOpenTrades, getUserOpenTrade } = useGetUserOpenTrade()
  const [useAllOpenTrades, setUserAllOpenTrades] = useState([] as UseAllOpenTrades[])
  const allPoolParams = useRootStore((store) => store.allPoolParams)

  const getUserAllOpenTrades = useCallback(async () => {
    if (allPoolParams.length > 0 && account && provider) {
      const storageList: string[] = []
      allPoolParams.forEach((pool) => {
        storageList.push(pool.storageT)
      })
      const res: UseAllOpenTrades[] = []
      storageList.map(async (address, index) => {
        await getUserOpenTrade(address, false)
        res.push({
          pool: allPoolParams[index],
          tuple: userOpenTrades,
        })
        setUserAllOpenTrades(res)
      })
    }
  }, [allPoolParams, account, provider])

  useEffect(() => {
    getUserAllOpenTrades().then()
    const interval = setInterval(async () => {
      await getUserAllOpenTrades()
    }, 15000)

    return () => clearInterval(interval)
  }, [allPoolParams, account, provider])

  return { useAllOpenTrades: useAllOpenTrades }
}
