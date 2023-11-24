import { AddEthereumChainParameter } from '@web3-react/types'

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
}

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18,
}

const BSC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'BNB',
  symbol: 'BNB',
  decimals: 18,
}

const CELO: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Celo',
  symbol: 'CELO',
  decimals: 18,
}

interface BasicChainInformation {
  urls: string[]
  name: string
  blockExplorerUrls?: string[]
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency']
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}

type ChainConfig = { [chainId: number]: BasicChainInformation | ExtendedChainInformation }

export const MAINNET_CHAINS: ChainConfig = {
  1: {
    urls: [''],
    name: 'Mainnet',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
  },
  10: {
    urls: ['https://optimism.publicnode.com'],
    name: 'Optimism',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
  },
  56: {
    urls: ['https://bsc.publicnode.com'],
    name: 'Binance',
    nativeCurrency: BSC,
    blockExplorerUrls: ['https://bscscan.com'],
  },
  137: {
    urls: ['https://polygon-mainnet.public.blastapi.io'],
    name: 'Polygon Mainnet',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  1101: {
    urls: ['https://zkevm-rpc.com'],
    name: 'Polygon zkEVM',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://zkevm.polygonscan.com'],
  },
  8453: {
    urls: ['https://developer-access-mainnet.base.org'],
    name: 'Base',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://basescan.org'],
  },
  42161: {
    urls: ['https://arbitrum-one.publicnode.com'],
    name: 'Arbitrum One',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  42220: {
    urls: ['https://forno.celo.org'],
    name: 'Celo',
    nativeCurrency: CELO,
    blockExplorerUrls: ['https://explorer.celo.org'],
  },
}

export const TESTNET_CHAINS: ChainConfig = {
  5: {
    urls: [''],
    name: 'Görli',
  },
  97: {
    urls: ['https://endpoints.omniatech.io/v1/bsc/testnet/public'],
    name: 'Binance Smart Chain Testnet ',
    nativeCurrency: BSC,
    blockExplorerUrls: ['https://testnet.bscscan.com'],
  },
  420: {
    urls: ['https://optimism-goerli.publicnode.com'],
    name: 'Optimism Goerli',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://goerli-explorer.optimism.io'],
  },
  1442: {
    urls: ['https://rpc.public.zkevm-test.net'],
    name: 'Polygon zkEVM Testnet',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://testnet-zkevm.polygonscan.com/'],
  },
  421613: {
    urls: ['https://arbitrum-goerli.publicnode.com'],
    name: 'Arbitrum Goerli',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://testnet.arbiscan.io'],
  },
  80001: {
    urls: ['https://polygon-testnet.public.blastapi.io'],
    name: 'Polygon Mumbai',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  },
  84531: {
    urls: ['https://goerli.base.org'],
    name: 'Base Goerli Testnet',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://goerli.basescan.org'],
  },
  44787: {
    urls: ['https://alfajores-forno.celo-testnet.org'],
    name: 'Celo Alfajores',
    nativeCurrency: CELO,
    blockExplorerUrls: ['https://alfajores-blockscout.celo-testnet.org'],
  },
  11155111: {
    urls: ['https://eth-sepolia.g.alchemy.com/v2/demo'],
    name: 'Sepolia',
    nativeCurrency: ETH,
    blockExplorerUrls: [' https://sepolia.etherscan.io'],
  },
}

export const CHAINS: ChainConfig = {
  ...MAINNET_CHAINS,
  ...TESTNET_CHAINS,
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency
}

export function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId]
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    }
  } else {
    return chainId
  }
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

//
