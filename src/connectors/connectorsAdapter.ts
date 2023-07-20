import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector, Web3ReactHooks } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect'
import { URLS } from './chain'

type ConnectorsAdapterProps = {
  walletName: string
  chainId: string | number
}

export const MetaMaskConnectors = () => {
  const [metaMask, hooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions }))
  return {
    connectors: metaMask,
    hooks: hooks,
  }
}

export const CoinbaseWalletConnectors = () => {
  const [coinbaseWallet, hooks] = initializeConnector<CoinbaseWallet>(
    (actions) =>
      new CoinbaseWallet({
        actions,
        options: {
          url: URLS[1][0],
          appName: 'web3-react',
        },
      })
  )
  return {
    connectors: coinbaseWallet,
    hooks: hooks,
  }
}

export const WalletConnectConnectors = () => {
  const [walletConnect, hooks] = initializeConnector<WalletConnect>(
    (actions) =>
      new WalletConnect({
        actions,
        options: {
          rpc: URLS,
        },
      })
  )
  return {
    connectors: walletConnect,
    hooks: hooks,
  }
}

type ConnectorsAdapter = {
  connectors: MetaMask | WalletConnect | CoinbaseWallet
  hooks: Web3ReactHooks
}

export const getConnectorsAdapter = ({ walletName }: ConnectorsAdapterProps): ConnectorsAdapter => {
  switch (walletName) {
    case 'metamask': {
      return MetaMaskConnectors()
    }
    case 'coinbase': {
      return CoinbaseWalletConnectors()
    }
    case 'walletConnect': {
      return WalletConnectConnectors()
    }
    default: {
      throw new Error('Please choose a wallet')
    }
  }
}
