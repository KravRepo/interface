import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Connection, ConnectionType } from './type'
import { URLS } from './chain'
import { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect-v2'

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`)
}

const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions, onError }))

export const injectedConnection: Connection = {
  getName: () => 'metaMask',
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: ConnectionType.INJECTED,
  // If on non-injected, non-mobile browser, prompt user to install Metamask
}

const [web3CoinbaseWallet, web3CoinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        url: URLS[1][0],
        appName: 'web3-react',
      },
      onError,
    })
)

const coinbaseWalletConnection: Connection = {
  getName: () => 'Coinbase Wallet',
  connector: web3CoinbaseWallet,
  hooks: web3CoinbaseWalletHooks,
  type: ConnectionType.COINBASE_WALLET,
  // If on a mobile browser that isn't the coinbase wallet browser, deeplink to the coinbase wallet app
}

const [web3WalletConnect, web3WalletConnectHooks] = initializeConnector<WalletConnect>((actions) => {
  return new WalletConnect({
    actions,
    options: {
      rpc: URLS,
      chains: [8453],
      projectId: 'ceb65bbcfecec61b5932c3256bf1665a',
      showQrModal: true,
    },

    defaultChainId: 8453,
    onError: () => {
      console.error('wallet connect')
    },
  })
})

export const walletConnectConnection: Connection = {
  getName: () => 'WalletConnect',
  connector: web3WalletConnect,
  hooks: web3WalletConnectHooks,
  type: ConnectionType.WALLET_CONNECT,
}

export function getConnections() {
  return [injectedConnection, walletConnectConnection, coinbaseWalletConnection]
}
// @ts-ignore
export function getConnection(c: Connector | ConnectionType) {
  if (c instanceof Connector) {
    const connection = getConnections().find((connection) => connection.connector === c)
    if (!connection) {
      throw Error('unsupported connector')
    }
    return connection
  } else {
    switch (c) {
      case ConnectionType.INJECTED:
        return injectedConnection
      case ConnectionType.COINBASE_WALLET:
        return coinbaseWalletConnection
      case ConnectionType.WALLET_CONNECT:
        return walletConnectConnection
    }
  }
}
