export enum ChainId {
  MAINNET = 1,
  BSC_TEST = 97,
  SEPOLIA = 11155111,
  BASE = 8453,
  BASE_TEST = 84531,
}

export type ContractInfo = {
  factory: string
  linkAddress: string
  nodeAddress: string[]
  kravStake: string
  kravAddress: string
  kravTrading: string
  veKrav: string
  feeDistrbutor: string
  lpReward: string
  tradeReward: string
  multicall: string
}

type apiInfo = {
  rpcNode: string
}

export const SUPPORT_CHAIN = [ChainId.MAINNET, ChainId.BASE, ChainId.BASE_TEST]

export const DEFAULT_CHAIN = ChainId.BASE

export const API_CONFIG: { [chainId: number]: apiInfo } = {
  [ChainId.MAINNET]: {
    rpcNode: 'https://ethereum.publicnode.com',
  },
  [ChainId.BASE]: {
    rpcNode: 'https://mainnet.base.org',
  },
  [ChainId.BASE_TEST]: {
    rpcNode: 'https://base-goerli.g.alchemy.com/v2/pjZ1AFp1o4cKAxlaTFre52frhKOxy-nH',
  },
}

export const CONTRACT_CONFIG: { [chainId: number]: ContractInfo } = {
  [ChainId.MAINNET]: {
    factory: '0xB86eE91672f9bC416De975a6DE06dCFF6bcE9677',
    linkAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    nodeAddress: ['0xcf9c4337dcBFd7cBB71c2c5fb1b9e86edEcfb7C8'],
    // krav stake address conflict
    kravStake: '',
    kravAddress: '',
    kravTrading: '',
    veKrav: '',
    feeDistrbutor: '',
    lpReward: '',
    tradeReward: '',
    multicall: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  },
  [ChainId.BASE]: {
    factory: '0xFfD88F38025e02f9d2eB7F0875060F6B4a20980a',
    linkAddress: '0xC9EbC2469E403DD89eAcA78C6B0b216fc7501011',
    nodeAddress: ['0x2B0DaBAC8437672F2f8c3b4981F17F7F88173e56'],
    // krav stake address conflict
    kravStake: '0xe480d334e6BF7693b12982e9Bf116F3BEeD386a0',
    kravAddress: '0xbE3111856e4acA828593274eA6872f27968C8DD6',
    kravTrading: '0x8975Fdbad4884998AC36669d126471cE239D94b1',
    veKrav: '0xDeE06ff0dBE3eBFD05b9E54B4ea228eC0FbD7f71',
    feeDistrbutor: '0x37170e7f0045C3DDe99F8884d9B6E2322697CC74',
    lpReward: '0x2e2dAb2d3f4dFb9F39ec6A11A0abb34fa7D27A19',
    tradeReward: '0x291182b2F0108E666e79b8fBC7c7b67C502564d7',
    multicall: '0x01096E802a1f6798173f2b876fbc6A8D423D8bdD',
  },
  [ChainId.BASE_TEST]: {
    factory: '0xF9d56982944b344FF3632B4eE6105C2Ea6E5e931',
    linkAddress: '0x6D0F8D488B669aa9BA2D0f0b7B75a88bf5051CD3',
    nodeAddress: ['0x8F882250C6b7a5Cd21A7192BD99A9E1C1A88275A'],
    kravStake: '0xe480d334e6BF7693b12982e9Bf116F3BEeD386a0',
    kravAddress: '0x593C951BFF6519E56435367eD302688728963523',
    kravTrading: '0x8975Fdbad4884998AC36669d126471cE239D94b1',
    veKrav: '0x8b81153Ad24869F54B32bf60B4303142E38A10b5',
    feeDistrbutor: '0x345bCD94ac3aBe5C7d9a5Cbe4647dF6cF449d01d',
    lpReward: '0x2e2dAb2d3f4dFb9F39ec6A11A0abb34fa7D27A19',
    tradeReward: '0x291182b2F0108E666e79b8fBC7c7b67C502564d7',
    multicall: '0x771D8465C2Bb5FFe6fC3Bc5F5Dc50d73bD846E1f',
  },
}

// export const TEST_RPC_NODE = 'https://developer-access-mainnet.base.org'

export const TEST_RPC_NODE = 'https://base-goerli.g.alchemy.com/v2/pjZ1AFp1o4cKAxlaTFre52frhKOxy-nH'

export const LINK_ADDRESS = '0x6D0F8D488B669aa9BA2D0f0b7B75a88bf5051CD3'
// export const LINK_ADDRESS = '0xC9EbC2469E403DD89eAcA78C6B0b216fc7501011'
export const NODE_ADDRESS = ['0x8F882250C6b7a5Cd21A7192BD99A9E1C1A88275A']
// export const NODE_ADDRESS = ['0x2B0DaBAC8437672F2f8c3b4981F17F7F88173e56']

export const K_LINE_API = 'https://base-api.krav.trade/krav/v1/klines?symbol=BTCUSDT&interval=1d'

export const QUANTO_API = 'https://test-api.krav.trade/krav/v1/list/quanto'

export const TRADE_HISTORY_API = 'https://test-api.krav.trade/krav/v1/list/market'

export const DASHBOARD_OVERVIEW_API = 'https://test-api.krav.trade/krav/v1/overview'
// export const DASHBOARD_OVERVIEW_API = 'https://base-api.krav.trade/krav/v1/overview'

export const TEST_CHAIN_ID = ChainId.BASE_TEST

export const BTC_PRICE_API = 'https://test-api.krav.trade/krav/v1/ticker?symbol='

export const KRAV_STAKE = '0xe480d334e6BF7693b12982e9Bf116F3BEeD386a0'

export const KRAV_ADDRESS = '0x593C951BFF6519E56435367eD302688728963523'

export const VE_KRAV = '0x8b81153Ad24869F54B32bf60B4303142E38A10b5'

export const DashBoard_USER_OVERVIEW_API = 'https://base-api.krav.trade/krav/v1/user/asset/amount?account='

export const BASE_KRAV_TRADING_ADDRESS = '0x8975Fdbad4884998AC36669d126471cE239D94b1'

export const FEE_DISTRBUTOR = '0x345bCD94ac3aBe5C7d9a5Cbe4647dF6cF449d01d'

export const LP_REWARD_API = 'https://test-api.krav.trade/krav/v1/miner/'

export const LP_REWARD_CONTRACT = '0x2e2dAb2d3f4dFb9F39ec6A11A0abb34fa7D27A19'

export const TRADE_REWARD_CONTRACT = '0x291182b2F0108E666e79b8fBC7c7b67C502564d7'
