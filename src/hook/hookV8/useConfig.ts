import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { CONTRACT_CONFIG, DEFAULT_CHAIN, SUPPORT_CHAIN } from '../../constant/chain'

export const useConfig = () => {
  const { chainId } = useWeb3React()
  return useMemo(() => {
    if (chainId)
      return chainId && SUPPORT_CHAIN.includes(chainId) ? CONTRACT_CONFIG[chainId] : CONTRACT_CONFIG[DEFAULT_CHAIN]
    else return
  }, [chainId])
}
