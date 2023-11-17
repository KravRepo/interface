import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'
import { getAddChainParameters } from '../../connectors/chain'
import { TransactionAction } from '../../store/TransactionSlice'
import { useUpdateError } from './useUpdateError'
import { useRootStore } from '../../store/root'
import { PoolParams } from '../../store/FactorySlice'

export const useConnect = () => {
  const { connector } = useWeb3React()
  const updateError = useUpdateError()
  const setExpectChainId = useRootStore((store) => store.setExpectChainId)
  const setAllPoolParams = useRootStore((store) => store.setAllPoolParams)
  const setIsLoadingFactory = useRootStore((store) => store.setIsLoadingFactory)
  const setTradePairIndex = useRootStore((store) => store.setTradePairIndex)
  const setTradePool = useRootStore((store) => store.setTradePool)
  // const expectChainId = useRootStore((store) => store.expectChainId)

  // useEffect(() => {
  //   if (typeof expectChainId === 'undefined' && chainId && !isLoadingFactory) return
  //   console.log('reset stores', expectChainId)
  //   resetAllStores()
  //   setIsLoadingFactory(true)
  // }, [chainId])

  return useCallback(
    async (chainId: number) => {
      try {
        await connector.activate(chainId)
        setExpectChainId(chainId)
        setIsLoadingFactory(true)
        setAllPoolParams([] as PoolParams[])
        setTradePairIndex(0)
        setTradePool({} as PoolParams)
        // resetAllStores()
      } catch (e: any) {
        try {
          if (e.code === 4001) return
          await connector.activate(getAddChainParameters(chainId))
          setExpectChainId(chainId)
          setIsLoadingFactory(true)
          setAllPoolParams([] as PoolParams[])
          setTradePairIndex(0)
          setTradePool({} as PoolParams)
        } catch (e) {
          updateError(TransactionAction.WALLET)
        }
      }
    },
    [connector]
  )
}
