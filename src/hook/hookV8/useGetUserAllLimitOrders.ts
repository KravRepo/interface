import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import { useRootStore } from '../../store/root'
import { PoolParams } from '../../store/FactorySlice'
import { TupleLimitOrder } from '../../components/Trades/type'
import { useGetUserOpenLimitOrders } from './useGetUserOpenLimitOrders'

export type UseAllLimitOrders = {
  pool: PoolParams
  tuple: TupleLimitOrder[]
}

export const useGetUserAllLimitOrders = () => {
  const { account, provider } = useWeb3React()
  const { getUserOpenLimitOrders, userLimitOrders } = useGetUserOpenLimitOrders()
  const [useAllLimitOrders, setUserAllLimitOrders] = useState([] as UseAllLimitOrders[])
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const getUserAllLimitOrders = useCallback(async () => {
    if (allPoolParams.length > 0 && account && provider) {
      const storageList: string[] = []
      allPoolParams.forEach((pool) => {
        // const storageContract = new Contract(pool.storageT, trading_storage.abi, provider)
        storageList.push(pool.storageT)
      })
      const res: UseAllLimitOrders[] = []
      storageList.map(async (address, index) => {
        await getUserOpenLimitOrders(address, false)
        res.push({
          pool: allPoolParams[index],
          tuple: userLimitOrders,
        })
        console.log('all limit orders', res)
      })
      setUserAllLimitOrders(res)
    }
  }, [allPoolParams, account, provider])

  useEffect(() => {
    getUserAllLimitOrders().then()
    const interval = setInterval(async () => {
      await getUserAllLimitOrders()
    }, 15000)

    return () => clearInterval(interval)
  }, [allPoolParams, account, provider])

  return { useAllLimitOrders: useAllLimitOrders }
}
