import { useWeb3React } from '@web3-react/core'
import { Contract } from 'ethers'
import { useMemo } from 'react'
import { getContract } from '../../utils'
import trading_v6 from '../../abi/trading_v6_1.json'
import trading_v6_eth from '../../abi/trading_v6_eth.json'
import trading_storage from '../../abi/trading_storage_v5.json'
import test_erc20 from '../../abi/test_erc20.json'
import btc_price from '../../abi/bsc_price.json'
import trading_vault from '../../abi/trading_vault_v5.json'
import pair_storage from '../../abi/pair_storage_v6.json'
import krav_factory from '../../abi/krav_factory.json'
import token_swap from '../../abi/TokenSwap.json'
import type { JsonRpcProvider } from '@ethersproject/providers'
import { Interface } from 'ethers/lib/utils'
import { ChainId, CONTRACT_CONFIG, DEFAULT_CHAIN, SUPPORT_CHAIN } from '../../constant/chain'
import { useRootStore } from '../../store/root'

export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { provider, account, chainId } = useWeb3React()
  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider || !chainId) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract(address, ABI, provider, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, provider, chainId, withSignerIfPossible, account]) as T
}

export const useTradingV6Contract = (tradingAddress: string) => {
  const { chainId } = useWeb3React()
  return useContract(
    tradingAddress,
    chainId === ChainId.BASE || chainId === ChainId.BASE_TEST ? trading_v6.abi : trading_v6_eth.abi,
    true
  )
}

export const useTradingStoreContract = (storageAddress: string) => {
  return useContract(storageAddress, trading_storage.abi)
}

// TODO: it just a test, update over finish factory contract
export const useTokenContract = (tokenAddress?: string) => {
  return useContract(tokenAddress ? tokenAddress : test_erc20.address, test_erc20.abi)
}

export const useBTCPriceContract = () => {
  return useContract('0x5741306c21795FdCBb9b265Ea0255F499DFe515C', btc_price)
}

export const useTradingVaultContract = (address: string) => {
  return useContract(address, trading_vault.abi)
}

export const usePairStorageContract = (address: string) => {
  return useContract(address, pair_storage.abi)
}

export const useTokenSwap = (chainId: number) => {
  return useContract(CONTRACT_CONFIG[chainId]?.tokenSwap || CONTRACT_CONFIG[ChainId.BASE].tokenSwap, token_swap.abi)
}

export const useFactoryContract = (provider: JsonRpcProvider) => {
  const expectChainId = useRootStore((store) => store.expectChainId)
  return useMemo(() => {
    return new Contract(
      CONTRACT_CONFIG[expectChainId && SUPPORT_CHAIN.includes(expectChainId) ? expectChainId : DEFAULT_CHAIN].factory,
      krav_factory.abi,
      provider
    )
  }, [expectChainId])
}

export const useFactoryWithProvider = (provider: any) => {
  const expectChainId = useRootStore((store) => store.expectChainId)
  const address = useMemo(() => {
    return CONTRACT_CONFIG[expectChainId && SUPPORT_CHAIN.includes(expectChainId) ? expectChainId : DEFAULT_CHAIN]
      .factory
  }, [expectChainId])
  return useContract(address, krav_factory.abi)
}

export type CreatCall = {
  target: string
  callData: string
}

export const creatCall = (
  contractAddress: string,
  contractInterface: Interface,
  func: string,
  params: any[]
): CreatCall => {
  return {
    target: contractAddress,
    callData: contractInterface.encodeFunctionData(func, params),
  }
}

export const decodeCallResult = (contractInterface: Interface, func: string, returnData: string) => {
  const result = contractInterface.decodeFunctionResult(func, returnData)
  if (result.length === 1) return result[0]
  else return result
}
