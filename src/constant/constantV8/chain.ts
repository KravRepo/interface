export const ETH_MAINNET = 1
export const AVALANCHE = 43114
export const AVALANCHE_FUJI = 43113
export const ARBITRUM = 42161
export const ARBITRUM_TESTNET = 421611

import type { AddEthereumChainParameter } from '@web3-react/types'

interface BasicChainInformation {
  urls: string[]
  name: string
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency']
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}

export const CHAINS: {
  [chainId: number]: BasicChainInformation | ExtendedChainInformation
} = {
  1: {
    urls: [
      'https://ethereum.et.market/v1/mainnet',
      process.env.infuraKey ? `https://mainnet.infura.io/v3/${process.env.infuraKey}` : '',
      process.env.alchemyKey ? `https://eth-mainnet.alchemyapi.io/v2/${process.env.alchemyKey}` : '',
    ].filter((url) => url !== ''),
    name: 'Mainnet',
  },
}

export const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce<{ [chainId: number]: string[] }>(
  (accumulator, chainId) => {
    const validURLs: string[] = CHAINS[Number(chainId)].urls

    if (validURLs.length) {
      accumulator[Number(chainId)] = validURLs
    }

    return accumulator
  },
  {}
)
