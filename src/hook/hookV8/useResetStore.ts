import { useCallback } from 'react'
import { useRootStore } from '../../store/root'
import { PoolParams } from '../../store/FactorySlice'
import { Tuple, TupleLimitOrder } from '../../components/Trades/type'
import { UserData } from './useUserPosition'
import { UseAllLimitOrders } from './useGetUserAllLimitOrders'
import { UseAllOpenTrades } from './useGetUserAllOpenTrades'

export const useResetStore = () => {
  const setAllPoolParams = useRootStore((store) => store.setAllPoolParams)
  const setTradePairIndex = useRootStore((store) => store.setTradePairIndex)
  const setTradePool = useRootStore((store) => store.setTradePool)
  const setIsLoadingFactory = useRootStore((store) => store.setIsLoadingFactory)
  const setUserOpenLimitList = useRootStore((store) => store.setUserOpenLimitList)
  const setUserOpenTradeList = useRootStore((store) => store.setUserOpenTradeList)
  const setUserAllOpenTradeList = useRootStore((store) => store.setUserAllOpenTradeList)
  const setUserAllOpenLimitList = useRootStore((store) => store.setUserAllOpenLimitList)
  const setUserPositionDatas = useRootStore((store) => store.setUserPositionDatas)
  return useCallback(() => {
    setUserOpenLimitList([] as TupleLimitOrder[])
    setUserOpenTradeList([] as Tuple[])
    setAllPoolParams([] as PoolParams[])
    setTradePairIndex(0)
    setTradePool({} as PoolParams)
    setUserPositionDatas([] as UserData[])
    setUserAllOpenLimitList([] as UseAllLimitOrders[])
    setUserAllOpenTradeList([] as UseAllOpenTrades[])
    setIsLoadingFactory(true)
  }, [])
}
