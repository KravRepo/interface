import { useWeb3React } from '@web3-react/core'
import { useRootStore } from '../../store/root'
import { useEffect } from 'react'
import { useResetStore } from './useResetStore'
import { ChainId, SUPPORT_CHAIN } from '../../constant/chain'
import { BASE_PAIR_CONFIG, COIN_BASE_TEST_CONFIG, EXCHANGE_CONFIG } from '../../constant/exchange'

export const useChainIdListener = () => {
  const { account, chainId } = useWeb3React()
  const reset = useResetStore()
  const setExpectChainId = useRootStore((state) => state.setExpectChainId)
  const setPairConfig = useRootStore((state) => state.setPairConfig)
  const allPoolParams = useRootStore((state) => state.allPoolParams)

  useEffect(() => {
    if (account && chainId) {
      setExpectChainId(chainId)
      if (chainId === ChainId.BSC_TEST) {
        setPairConfig(COIN_BASE_TEST_CONFIG)
      } else {
        const isBase = chainId === ChainId.BASE_TEST || chainId === ChainId.BASE
        setPairConfig(isBase ? EXCHANGE_CONFIG : BASE_PAIR_CONFIG)
      }
      if (SUPPORT_CHAIN.includes(chainId)) localStorage.setItem('krav-chain-id', chainId.toString())
      if (allPoolParams.length !== 0) reset()
    }
  }, [chainId, account])
}
