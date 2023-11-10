import { useCallback } from 'react'
import { useRootStore } from '../../store/root'
import { PoolParams } from '../../store/FactorySlice'
import { Tuple, TupleLimitOrder } from '../../components/Trades/type'

export const useResetStore = () => {
  const setAllPoolParams = useRootStore((store) => store.setAllPoolParams)
  const setIsLoadingFactory = useRootStore((store) => store.setIsLoadingFactory)
  const setTradePairIndex = useRootStore((store) => store.setTradePairIndex)
  const setTradePool = useRootStore((store) => store.setTradePool)
  const setUserOpenLimitList = useRootStore((store) => store.setUserOpenLimitList)
  const setUserOpenTradeList = useRootStore((store) => store.setUserOpenTradeList)
  return useCallback(() => {
    setUserOpenLimitList([] as TupleLimitOrder[])
    setUserOpenTradeList([] as Tuple[])
    setIsLoadingFactory(true)
    setAllPoolParams([] as PoolParams[])
    setTradePairIndex(0)
    setTradePool({} as PoolParams)
  }, [])
}
