import './polyfills' // must be imported first

import { JsonRpcProvider } from '@ethersproject/providers'
import { initializeConnector, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { EIP1193 } from '@web3-react/eip1193'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { Connector, Provider as Eip1193Provider } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect-v2'
import { PropsWithChildren, useEffect, useMemo, useRef } from 'react'
import JsonRpcConnector from './utils/JsonRpcConnector'

import { Provider as ConnectorsProvider } from './useConnectors'
import {
  JsonRpcConnectionMap,
  Provider as JsonRpcUrlMapProvider,
  toJsonRpcConnectionMap,
  toJsonRpcUrlMap,
} from './useJsonRpcUrlsMap'
import { ChainId } from '../../constant/chain'
import { MetaMaskConnectionError, useAsyncError } from '../useAsyncError'
import { WalletConnectQR } from './WalletConnect'

const DEFAULT_CHAIN_ID = ChainId.MAINNET

type Web3ReactConnector<T extends Connector = Connector> = [T, Web3ReactHooks]

interface Web3ReactConnectors {
  user: Web3ReactConnector<EIP1193 | JsonRpcConnector> | undefined
  metaMask: Web3ReactConnector<MetaMask>
  walletConnect: Web3ReactConnector<WalletConnect>
  walletConnectQR: Web3ReactConnector<WalletConnectQR>
  network: Web3ReactConnector<Network>
}

export interface ProviderProps {
  defaultChainId?: ChainId
  jsonRpcUrlMap?: JsonRpcConnectionMap
  /**
   * If null, no auto-connection (MetaMask or WalletConnect) will be attempted.
   * This is appropriate for integrations which wish to control the connected provider.
   */
  provider?: Eip1193Provider | JsonRpcProvider | null
}

export function Provider({
  defaultChainId: chainId = ChainId.MAINNET,
  jsonRpcUrlMap,
  provider,
  children,
}: PropsWithChildren<ProviderProps>) {
  const defaultChainId = useMemo(() => {
    if (!ChainId[chainId]) {
      console.warn(
        `Unsupported chainId: ${chainId}. Falling back to ${DEFAULT_CHAIN_ID} (${ChainId[DEFAULT_CHAIN_ID]}).`
      )
      return DEFAULT_CHAIN_ID
    }
    return chainId
  }, [chainId])

  const web3ReactConnectors = useWeb3ReactConnectors({ provider, jsonRpcUrlMap, defaultChainId })

  const key = useRef(0)
  const prioritizedConnectors = useMemo(() => {
    // Re-key Web3ReactProvider before rendering new connectors, as it expects connectors to be
    // referentially static.
    key.current += 1

    const prioritizedConnectors: (Web3ReactConnector | null | undefined)[] = [
      web3ReactConnectors.user,
      web3ReactConnectors.metaMask,
      web3ReactConnectors.walletConnect,
      web3ReactConnectors.walletConnectQR,
      web3ReactConnectors.network,
    ]
    return prioritizedConnectors.filter((connector): connector is Web3ReactConnector => Boolean(connector))
  }, [web3ReactConnectors])

  const connectors = useMemo(
    () => ({
      user: web3ReactConnectors.user?.[0],
      metaMask: web3ReactConnectors.metaMask[0],
      walletConnect: web3ReactConnectors.walletConnect[0],
      walletConnectQR: web3ReactConnectors.walletConnectQR[0],
      network: web3ReactConnectors.network[0],
    }),
    [web3ReactConnectors]
  )

  const shouldEagerlyConnect = provider === undefined // !== null
  useEffect(() => {
    // Ignore any errors during connection so they do not propagate to the widget.
    if (connectors.user) {
      connectors.user.activate().catch(() => undefined)
      return
    } else if (shouldEagerlyConnect) {
      const eagerConnectors = [connectors.metaMask, connectors.walletConnect]
      eagerConnectors.forEach((connector) => connector.connectEagerly().catch(() => undefined))
    }
    connectors.network.activate().catch(() => undefined)
  }, [connectors.metaMask, connectors.network, connectors.user, connectors.walletConnect, shouldEagerlyConnect])

  return (
    <Web3ReactProvider connectors={prioritizedConnectors} key={key.current}>
      <JsonRpcUrlMapProvider jsonRpcMap={jsonRpcUrlMap}>
        <ConnectorsProvider connectors={connectors}>{children}</ConnectorsProvider>
      </JsonRpcUrlMapProvider>
    </Web3ReactProvider>
  )
}

function initializeWeb3ReactConnector<T extends Connector, P extends object>(
  Constructor: { new (options: P): T },
  options: Omit<P, 'actions'>
): Web3ReactConnector<T> {
  const [connector, hooks] = initializeConnector((actions) => new Constructor({ actions, ...options } as P))
  if (options && 'provider' in options) {
    // Short-circuit provider selection to improve performance and testability.
    // Without doing so, provider will be unavailable for a frame.
    hooks.useProvider = (() => (options as Record<'provider', unknown>).provider) as typeof hooks.useProvider
  }
  return [connector, hooks]
}

function useWeb3ReactConnectors({ defaultChainId, provider, jsonRpcUrlMap }: ProviderProps) {
  const [urlMap, connectionMap] = useMemo(
    () => [toJsonRpcUrlMap(jsonRpcUrlMap), toJsonRpcConnectionMap(jsonRpcUrlMap)],
    [jsonRpcUrlMap]
  )

  const throwAsync = useAsyncError()

  const user = useMemo(() => {
    if (!provider) return
    if (JsonRpcProvider.isProvider(provider)) {
      return initializeWeb3ReactConnector(JsonRpcConnector, { provider, onError: console.error })
    } else if (JsonRpcProvider.isProvider((provider as any).provider)) {
      throw new Error('Eip1193Bridge is experimental: pass your ethers Provider directly')
    } else {
      return initializeWeb3ReactConnector(EIP1193, { provider, onError: console.error })
    }
  }, [provider])
  const metaMask = useMemo(
    () =>
      initializeWeb3ReactConnector(MetaMask, {
        onError: () => {
          throwAsync(new MetaMaskConnectionError())
        },
      }),
    [throwAsync]
  )

  const walletConnectDefaultOptions = useMemo(
    () => ({
      rpcMap: urlMap,
      projectId: 'ceb65bbcfecec61b5932c3256bf1665a',
      // this requires the connecting wallet to support eth mainnet
      chains: [ChainId.BASE],
      optionalChains: [ChainId.BASE],
      optionalMethods: ['eth_signTypedData', 'eth_signTypedData_v4', 'eth_sign'],
      qrModalOptions: {
        themeVariables: {
          '--wcm-z-index': '1301',
        },
      },
    }),
    [urlMap]
  )

  const walletConnect = useMemo(
    () =>
      initializeWeb3ReactConnector(WalletConnect, {
        options: {
          ...walletConnectDefaultOptions,
          showQrModal: true,
        },
        defaultChainId,
        onError: console.error,
      }),
    [defaultChainId, walletConnectDefaultOptions]
  )
  const walletConnectQR = useMemo(
    () =>
      initializeWeb3ReactConnector(WalletConnectQR, {
        options: {
          ...walletConnectDefaultOptions,
          showQrModal: false,
        },
        defaultChainId,
        onError: console.error,
      }),
    [defaultChainId, walletConnectDefaultOptions]
  )
  const network = useMemo(
    () => initializeWeb3ReactConnector(Network, { urlMap: connectionMap, defaultChainId }),
    [connectionMap, defaultChainId]
  )

  return useMemo<Web3ReactConnectors>(
    () => ({
      user,
      metaMask,
      walletConnect,
      walletConnectQR,
      network,
    }),
    [metaMask, network, user, walletConnect, walletConnectQR]
  )
}
