import { useWeb3React } from '@web3-react/core'
import { Contract } from 'ethers'
import { useMemo } from 'react'
import { getContract } from '../../utils'
import { TradingABI } from '../../abi/deployed/TradingABI'
import { TradingStorageABI } from '../../abi/deployed/TradingStorageABI'
import test_erc20 from '../../abi/test_erc20.json'
import btc_price from '../../abi/bsc_price.json'
import trading_vault from '../../abi/trading_vault_v5.json'
import { PairsStorageABI } from '../../abi/deployed/PairsStorageABI'
import { KravFactoryABI } from '../../abi/deployed/KravFactoryABI'
import token_swap from '../../abi/TokenSwap.json'
import multicall2 from '../../abi/uni_multicall.json'
import type { JsonRpcProvider } from '@ethersproject/providers'
import { Interface } from 'ethers/lib/utils'
import { ChainId, CONTRACT_CONFIG, DEFAULT_CHAIN, MULTICALL_ADDRESS, SUPPORT_CHAIN } from '../../constant/chain'
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
  return useContract(tradingAddress, TradingABI, true)
}

export const useTradingStoreContract = (storageAddress: string) => {
  return useContract(storageAddress, TradingStorageABI)
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
  return useContract(address, PairsStorageABI)
}

export const useTokenSwap = (chainId: number) => {
  return useContract(CONTRACT_CONFIG[chainId]?.tokenSwap || CONTRACT_CONFIG[ChainId.BASE].tokenSwap, token_swap.abi)
}

export const useFactoryContract = (provider: JsonRpcProvider) => {
  const expectChainId = useRootStore((store) => store.expectChainId)
  console.log(expectChainId)
  return useMemo(() => {
    return new Contract(
      CONTRACT_CONFIG[expectChainId && SUPPORT_CHAIN.includes(expectChainId) ? expectChainId : DEFAULT_CHAIN].factory,
      KravFactoryABI,
      provider as any
    )
  }, [expectChainId, provider])
}

export const useFactoryWithProvider = (provider: any) => {
  const expectChainId = useRootStore((store) => store.expectChainId)
  const address = useMemo(() => {
    return CONTRACT_CONFIG[expectChainId && SUPPORT_CHAIN.includes(expectChainId) ? expectChainId : DEFAULT_CHAIN]
      .factory
  }, [expectChainId])
  return useContract(address, KravFactoryABI)
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

export function useInterfaceMulticall() {
  // const { chainId, provider } = useWeb3React()
  // return useMemo(() => {
  //   const address =
  //     chainId && SUPPORT_CHAIN.includes(chainId)
  //       ? CONTRACT_CONFIG[chainId].multicall2
  //       : CONTRACT_CONFIG[DEFAULT_CHAIN].multicall2
  //   if (!address) return null
  //   const multicall = new Contract(address, multicall2.abi, provider)
  //   return multicall
  // }, [])
  return useContract(MULTICALL_ADDRESS, multicall2.abi)
}
