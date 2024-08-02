import { JsonRpcProvider, StaticJsonRpcProvider } from '@ethersproject/providers'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { ChainId } from '../../constant/chain'

const JSON_RPC_FALLBACK_ENDPOINTS = {
  [ChainId.BASE]: [
    // "Safe" URLs
    'https://mainnet.base.org',
    'https://base.gateway.tenderly.co',
    'https://base.publicnode.com',
    // "Fallback" URLs
    'https://1rpc.io/base',
    'https://base.meowrpc.com',
  ],
  [ChainId.MAINNET]: [
    // "Safe" URLs
    'https://cloudflare-eth.com',
    // "Fallback" URLs
    'https://rpc.ankr.com/eth',
    'https://eth-mainnet.public.blastapi.io',
  ],
  // [ChainId.SEPOLIA]: [],
  [ChainId.BASE_TEST]: ['https://base-goerli.public.blastapi.io'],
  // [ChainId.ARB]: ['https://arb1.arbitrum.io/rpc', 'https://arbitrum.public-rpc.com'],
  // [ChainId.ARB_TEST]: [],
  // [ChainId.MUMBAI_TEST]: [],
  // [ChainId.OP_GOERLI]: [],
  // [ChainId.POLYGON_ZKEVM_TEST]: [],
}

export type JsonRpcConnectionMap = { [chainId: number]: string | string[] | JsonRpcProvider | JsonRpcProvider[] }

const JsonRpcUrlMapContext = createContext<JsonRpcConnectionMap | undefined>(undefined)

export function Provider({ jsonRpcMap, children }: PropsWithChildren<{ jsonRpcMap?: JsonRpcConnectionMap }>) {
  return <JsonRpcUrlMapContext.Provider value={jsonRpcMap}>{children}</JsonRpcUrlMapContext.Provider>
}

export default function useJsonRpcUrlsMap(): Record<ChainId, string[]> {
  const jsonRpcMap = useContext(JsonRpcUrlMapContext)
  return useMemo(() => toJsonRpcUrlsMap(jsonRpcMap), [jsonRpcMap])
}

function toJsonRpcMap<T>(getChainConnections: (chainId: ChainId) => T): Record<ChainId, T> {
  return {
    [ChainId.MAINNET]: getChainConnections(ChainId.MAINNET),
    [ChainId.BASE]: getChainConnections(ChainId.BASE),
    // [ChainId.SEPOLIA]: getChainConnections(ChainId.SEPOLIA),
    [ChainId.BASE_TEST]: getChainConnections(ChainId.BASE_TEST),
    // [ChainId.ARB]: getChainConnections(ChainId.ARB),
    // [ChainId.ARB_TEST]: getChainConnections(ChainId.ARB_TEST),
    // [ChainId.MUMBAI_TEST]: getChainConnections(ChainId.MUMBAI_TEST),
    // [ChainId.OP_GOERLI]: getChainConnections(ChainId.OP_GOERLI),
    // [ChainId.POLYGON_ZKEVM_TEST]: getChainConnections(ChainId.POLYGON_ZKEVM_TEST),
    // [ChainId.POLYGON_ZK_EVM]: getChainConnections(ChainId.POLYGON_ZK_EVM),
    // [ChainId.OP]: getChainConnections(ChainId.OP),
    // [ChainId.BSC]: getChainConnections(ChainId.BSC),
    // [ChainId.BSC_TEST]: getChainConnections(ChainId.BSC_TEST),
    // [ChainId.POLYGON]: getChainConnections(ChainId.POLYGON),
  }
}

function getChainConnections(
  connectionMap: JsonRpcConnectionMap | undefined,
  chainId: ChainId
): (string | JsonRpcProvider)[] {
  const value = connectionMap?.[chainId]
  const fallback = JSON_RPC_FALLBACK_ENDPOINTS[chainId as keyof typeof JSON_RPC_FALLBACK_ENDPOINTS] ?? []
  return (Array.isArray(value) ? value : [value])
    .filter((value): value is string | JsonRpcProvider => Boolean(value))
    .concat(fallback)
}

export function toJsonRpcConnectionMap(connectionMap?: JsonRpcConnectionMap): Record<ChainId, JsonRpcProvider> {
  function getJsonRpcProvider(chainId: ChainId): JsonRpcProvider {
    const [connection] = getChainConnections(connectionMap, chainId)
    return JsonRpcProvider.isProvider(connection) ? connection : new StaticJsonRpcProvider(connection, Number(chainId))
  }
  return toJsonRpcMap(getJsonRpcProvider)
}

export function toJsonRpcUrlMap(connectionMap?: JsonRpcConnectionMap): Record<ChainId, string> {
  function getJsonRpcUrl(chainId: ChainId): string {
    const [connection] = getChainConnections(connectionMap, chainId)
    return JsonRpcProvider.isProvider(connection) ? connection.connection.url : connection
  }
  return toJsonRpcMap(getJsonRpcUrl)
}

export function toJsonRpcUrlsMap(connectionMap?: JsonRpcConnectionMap): Record<ChainId, string[]> {
  function getJsonRpcUrls(chainId: ChainId): string[] {
    const connections = getChainConnections(connectionMap, chainId)
    return connections.map((connection) =>
      JsonRpcProvider.isProvider(connection) ? connection.connection.url : connection
    )
  }
  return toJsonRpcMap(getJsonRpcUrls)
}
