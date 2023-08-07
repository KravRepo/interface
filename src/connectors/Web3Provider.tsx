import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect'
import { coinbaseWallet, hooks as coinbaseWalletHooks } from './coinbaseWallet'
import { hooks as metaMaskHooks, metaMask } from './metaMask'
import { hooks as walletConnectHooks, walletConnect } from './walletConnect'
import React from 'react'
import useEagerlyConnect from '../hook/hookV8/useEagerlyConnect'

const connectors: [MetaMask | WalletConnect | CoinbaseWallet, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [coinbaseWallet, coinbaseWalletHooks],
]

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  useEagerlyConnect()
  return <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
}
