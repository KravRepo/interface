import { useWeb3React } from '@web3-react/core'
import { useRootStore } from '../../store/root'
import { useEffect } from 'react'
import { useResetStore } from './useResetStore'

export const useChainIdListener = () => {
  const { account, chainId } = useWeb3React()
  const reset = useResetStore()
  const setExpectChainId = useRootStore((state) => state.setExpectChainId)
  const allPoolParams = useRootStore((state) => state.allPoolParams)

  useEffect(() => {
    if (account && chainId) {
      setExpectChainId(chainId)
      if (allPoolParams.length !== 0) reset()
    }
  }, [chainId, account])
}
