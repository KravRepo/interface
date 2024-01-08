export enum ChainId {
  MAINNET = 1,
  OP = 10,
  BSC = 56,
  BSC_TEST = 97,
  POLYGON = 137,
  POLYGON_ZK_EVM = 1101,
  SEPOLIA = 11155111,
  BASE = 8453,
  BASE_TEST = 84531,
  ARB = 42161,
  ARB_TEST = 421613,
  MUMBAI_TEST = 80001,
  OP_GOERLI = 420,
  POLYGON_ZKEVM_TEST = 1442,
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
  nativeToken: string
  tokenSwap?: string
}

type apiInfo = {
  rpcNode: string
}

export const SUPPORT_CHAIN_TEST = [
  ChainId.MAINNET,
  ChainId.BASE,
  ChainId.BASE_TEST,
  ChainId.MUMBAI_TEST,
  ChainId.ARB_TEST,
  ChainId.OP_GOERLI,
  ChainId.BSC_TEST,
  ChainId.POLYGON_ZKEVM_TEST,
]

export const SUPPORT_CHAIN_PRODUCTION = [
  ChainId.MAINNET,
  ChainId.BASE,
  ChainId.BSC,
  ChainId.POLYGON,
  ChainId.ARB,
  ChainId.OP,
  ChainId.POLYGON_ZK_EVM,
]

export const DEFAULT_CHAIN = ChainId.BASE

export const API_CONFIG_TEST: { [chainId: number]: apiInfo } = {
  [ChainId.MAINNET]: {
    rpcNode: 'https://ethereum.publicnode.com',
  },
  [ChainId.BASE]: {
    rpcNode: 'https://mainnet.base.org',
  },
  [ChainId.BSC_TEST]: {
    rpcNode: 'https://bsc-testnet.publicnode.com',
  },
  [ChainId.BASE_TEST]: {
    rpcNode: 'https://base-goerli.publicnode.com',
  },
  [ChainId.OP_GOERLI]: {
    rpcNode: 'https://optimism-goerli.publicnode.com',
  },
  [ChainId.ARB_TEST]: {
    rpcNode: 'https://arbitrum-goerli.publicnode.com',
  },
  [ChainId.MUMBAI_TEST]: {
    rpcNode: 'https://polygon-testnet.public.blastapi.io',
  },
  [ChainId.POLYGON_ZKEVM_TEST]: {
    rpcNode: 'https://rpc.public.zkevm-test.net',
  },
}

export const API_CONFIG_PRODUCTION: { [chainId: number]: apiInfo } = {
  [ChainId.MAINNET]: {
    rpcNode: 'https://ethereum.publicnode.com',
  },
  [ChainId.BASE]: {
    rpcNode: 'https://mainnet.base.org',
  },
  [ChainId.BSC]: {
    rpcNode: 'https://bsc.publicnode.com',
  },
  [ChainId.OP]: {
    rpcNode: 'https://opt-mainnet.g.alchemy.com/v2/oB5aEK18AWZaY9W_L8IhuqRx5pIFYsdQ',
  },
  [ChainId.ARB]: {
    rpcNode: 'https://arb-mainnet.g.alchemy.com/v2/mwtFvWS1EjUHkU-pFTBDqakpLZTn2kN1',
  },
  [ChainId.POLYGON]: {
    rpcNode: 'https://polygon-mainnet.g.alchemy.com/v2/mJ8yErW75AGxNl5bk50DJK-8hV37xUOc',
  },
  [ChainId.POLYGON_ZK_EVM]: {
    rpcNode: 'https://polygonzkevm-mainnet.g.alchemy.com/v2/hgPVJ9u__bH3XrIBngdm2BAKSm21zOcC',
  },
}

export const CONTRACT_CONFIG_TEST: { [chainId: number]: ContractInfo } = {
  [ChainId.MAINNET]: {
    factory: '0xB86eE91672f9bC416De975a6DE06dCFF6bcE9677',
    linkAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    nodeAddress: ['0xcf9c4337dcBFd7cBB71c2c5fb1b9e86edEcfb7C8'],
    kravStake: '',
    kravAddress: '',
    kravTrading: '',
    veKrav: '',
    feeDistrbutor: '',
    lpReward: '',
    tradeReward: '',
    multicall: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    nativeToken: 'ETH',
  },
  [ChainId.BASE]: {
    factory: '0xFfD88F38025e02f9d2eB7F0875060F6B4a20980a',
    linkAddress: '0xC9EbC2469E403DD89eAcA78C6B0b216fc7501011',
    nodeAddress: ['0x2B0DaBAC8437672F2f8c3b4981F17F7F88173e56'],
    kravStake: '0xe480d334e6BF7693b12982e9Bf116F3BEeD386a0',
    kravAddress: '0xbE3111856e4acA828593274eA6872f27968C8DD6',
    kravTrading: '0x8975Fdbad4884998AC36669d126471cE239D94b1',
    veKrav: '0xDeE06ff0dBE3eBFD05b9E54B4ea228eC0FbD7f71',
    feeDistrbutor: '0x37170e7f0045C3DDe99F8884d9B6E2322697CC74',
    lpReward: '0x2e2dAb2d3f4dFb9F39ec6A11A0abb34fa7D27A19',
    tradeReward: '0x291182b2F0108E666e79b8fBC7c7b67C502564d7',
    multicall: '0x01096E802a1f6798173f2b876fbc6A8D423D8bdD',
    nativeToken: 'ETH',
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
    nativeToken: 'ETH',
    tokenSwap: '0x03c8dbc458FC19CF773384C6c607f04278854980',
  },
  [ChainId.ARB_TEST]: {
    factory: '0x8F882250C6b7a5Cd21A7192BD99A9E1C1A88275A',
    linkAddress: '0xd14838A68E8AFBAdE5efb411d5871ea0011AFd28',
    nodeAddress: ['0x9daCd4B76b748674a46f8554c8b56bb10A95ef04'],
    kravStake: '',
    kravAddress: '',
    kravTrading: '',
    veKrav: '',
    feeDistrbutor: '',
    lpReward: '',
    tradeReward: '',
    multicall: '0xF7050aEf15a1E6EF477439c69E58fCc38CB80B43',
    nativeToken: 'ETH',
  },
  [ChainId.BSC_TEST]: {
    factory: '0xc87E47Bf5e8615651247bb2BbbD0bED2225fbB8D',
    linkAddress: '0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06',
    nodeAddress: ['0x18465D16a1c6c12EABD540F815d6eD1f521515a0'],
    kravStake: '',
    kravAddress: '',
    kravTrading: '',
    veKrav: '',
    feeDistrbutor: '',
    lpReward: '',
    tradeReward: '',
    multicall: '0xd0C3CFF5f01d3357505077D4a72d5538ef4DbA50',
    nativeToken: 'BNB',
  },
  [ChainId.MUMBAI_TEST]: {
    factory: '0x7e7D51C0F9f496Baf7dB89d864476f7953169324',
    linkAddress: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    nodeAddress: ['0xd74312bbB9d7Af619E23f8afB5bcC820F7c26E0A'],
    kravStake: '',
    kravAddress: '',
    kravTrading: '',
    veKrav: '',
    feeDistrbutor: '',
    lpReward: '',
    tradeReward: '',
    multicall: '0x39De4bF497E5e26B03d227bdf4534c4775f73709',
    nativeToken: 'MATIC',
  },
  [ChainId.OP_GOERLI]: {
    factory: '0x188dFEE91c18cbF821731de6125cF4551011b2a4',
    linkAddress: '0xdc2CC710e42857672E7907CF474a69B63B93089f',
    nodeAddress: ['0x9daCd4B76b748674a46f8554c8b56bb10A95ef04'],
    kravStake: '',
    kravAddress: '',
    kravTrading: '',
    veKrav: '',
    feeDistrbutor: '',
    lpReward: '',
    tradeReward: '',
    multicall: '0xF7050aEf15a1E6EF477439c69E58fCc38CB80B43',
    nativeToken: 'ETH',
  },
  [ChainId.POLYGON_ZKEVM_TEST]: {
    factory: '0x0A9475f047DFc96E23343F01eeBbce56497f7520',
    linkAddress: '0x67630EAaea12B10740E2b0e4955E654961A55AE4',
    nodeAddress: ['0x5Dc7cbF3D0a8AC43Dd344e3d16887044a749D960'],
    kravStake: '',
    kravAddress: '',
    kravTrading: '',
    veKrav: '',
    feeDistrbutor: '',
    lpReward: '',
    tradeReward: '',
    multicall: '0x12EADdBF9133F2cde1aFb999CC17966B998aEac3',
    nativeToken: 'ETH',
  },
}

export const CONTRACT_CONFIG_PRODUCTION: { [chainId: number]: ContractInfo } = {
  [ChainId.MAINNET]: {
    factory: '0xB86eE91672f9bC416De975a6DE06dCFF6bcE9677',
    linkAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    nodeAddress: ['0xcf9c4337dcBFd7cBB71c2c5fb1b9e86edEcfb7C8'],
    kravStake: '',
    kravAddress: '',
    kravTrading: '',
    veKrav: '',
    feeDistrbutor: '',
    lpReward: '',
    tradeReward: '',
    multicall: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    nativeToken: 'ETH',
  },
  [ChainId.BASE]: {
    factory: '0xFfD88F38025e02f9d2eB7F0875060F6B4a20980a',
    linkAddress: '0xC9EbC2469E403DD89eAcA78C6B0b216fc7501011',
    nodeAddress: ['0x2B0DaBAC8437672F2f8c3b4981F17F7F88173e56'],
    kravStake: '0xe480d334e6BF7693b12982e9Bf116F3BEeD386a0',
    kravAddress: '0xbE3111856e4acA828593274eA6872f27968C8DD6',
    kravTrading: '0x8975Fdbad4884998AC36669d126471cE239D94b1',
    veKrav: '0xDeE06ff0dBE3eBFD05b9E54B4ea228eC0FbD7f71',
    feeDistrbutor: '0x37170e7f0045C3DDe99F8884d9B6E2322697CC74',
    lpReward: '0x2e2dAb2d3f4dFb9F39ec6A11A0abb34fa7D27A19',
    tradeReward: '0x291182b2F0108E666e79b8fBC7c7b67C502564d7',
    multicall: '0x01096E802a1f6798173f2b876fbc6A8D423D8bdD',
    nativeToken: 'ETH',
    tokenSwap: '0xa3C4A04c70A93dff0D9Ad294F7F28b3cE399F023',
  },
  [ChainId.ARB]: {
    factory: '0x83822f0500e6d13CB983Baac07828F86B12de5f9',
    linkAddress: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
    nodeAddress: ['0x78fb985d6628338932c2A95391EE96ADA15Fd2A0'],
    kravStake: '',
    kravAddress: '',
    kravTrading: '',
    veKrav: '',
    feeDistrbutor: '',
    lpReward: '',
    tradeReward: '',
    multicall: '0x6F7358D87a421d3dCe7859f31026C996444bedCc',
    nativeToken: 'ETH',
  },
  [ChainId.BSC]: {
    factory: '0x83822f0500e6d13CB983Baac07828F86B12de5f9',
    linkAddress: '0x404460C6A5EdE2D891e8297795264fDe62ADBB75',
    nodeAddress: ['0x78fb985d6628338932c2A95391EE96ADA15Fd2A0'],
    kravStake: '',
    kravAddress: '',
    kravTrading: '',
    veKrav: '',
    feeDistrbutor: '',
    lpReward: '',
    tradeReward: '',
    multicall: '0x6F7358D87a421d3dCe7859f31026C996444bedCc',
    nativeToken: 'BNB',
  },
  [ChainId.POLYGON]: {
    factory: '0x83822f0500e6d13CB983Baac07828F86B12de5f9',
    linkAddress: '0xb0897686c545045aFc77CF20eC7A532E3120E0F1',
    nodeAddress: ['0x78fb985d6628338932c2A95391EE96ADA15Fd2A0'],
    kravStake: '',
    kravAddress: '',
    kravTrading: '',
    veKrav: '',
    feeDistrbutor: '',
    lpReward: '',
    tradeReward: '',
    multicall: '0x6F7358D87a421d3dCe7859f31026C996444bedCc',
    nativeToken: 'MATIC',
  },
  [ChainId.OP]: {
    factory: '0x6F7358D87a421d3dCe7859f31026C996444bedCc',
    linkAddress: '0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6',
    nodeAddress: ['0xC9EbC2469E403DD89eAcA78C6B0b216fc7501011'],
    kravStake: '',
    kravAddress: '',
    kravTrading: '',
    veKrav: '',
    feeDistrbutor: '',
    lpReward: '',
    tradeReward: '',
    multicall: '0xBef3e43E183f4a4D61D8e2d446eb5FA4aA3c7fe1',
    nativeToken: 'ETH',
  },
  [ChainId.POLYGON_ZK_EVM]: {
    factory: '0x05863AEAB4AeE6FD54d9f9314054f4EfAB7f8d87',
    linkAddress: '0x78fb985d6628338932c2A95391EE96ADA15Fd2A0',
    nodeAddress: ['0xC9EbC2469E403DD89eAcA78C6B0b216fc7501011'],
    kravStake: '',
    kravAddress: '',
    kravTrading: '',
    veKrav: '',
    feeDistrbutor: '',
    lpReward: '',
    tradeReward: '',
    multicall: '0xB86eE91672f9bC416De975a6DE06dCFF6bcE9677',
    nativeToken: 'ETH',
  },
}

export const IS_PRODUCTION = true

export const API_CONFIG = IS_PRODUCTION ? API_CONFIG_PRODUCTION : API_CONFIG_TEST

export const CONTRACT_CONFIG = IS_PRODUCTION ? CONTRACT_CONFIG_PRODUCTION : CONTRACT_CONFIG_TEST

export const SUPPORT_CHAIN = IS_PRODUCTION ? SUPPORT_CHAIN_PRODUCTION : SUPPORT_CHAIN_TEST

export const TEST_RPC_NODE = 'https://base-goerli.g.alchemy.com/v2/pjZ1AFp1o4cKAxlaTFre52frhKOxy-nH'

export const K_LINE_API = 'https://api.krav.trade/krav/v1/klines?symbol=BTCUSDT&interval=1d'

export const QUANTO_API = 'https://api.krav.trade/krav/v1/list/quanto'

export const TRADE_HISTORY_API = 'https://api.krav.trade/krav/v1/list/market'

export const DASHBOARD_OVERVIEW_API = 'https://api.krav.trade/krav/v1/overview'

export const BTC_PRICE_API = 'https://api.krav.trade/krav/v1/ticker?symbol='

export const KRAV_STAKE = '0xe480d334e6BF7693b12982e9Bf116F3BEeD386a0'

export const KRAV_ADDRESS = '0x593C951BFF6519E56435367eD302688728963523'

export const VE_KRAV = '0x8b81153Ad24869F54B32bf60B4303142E38A10b5'

export const DashBoard_USER_OVERVIEW_API = 'https://api.krav.trade/krav/v1/user/asset/amount?account='

export const BASE_KRAV_TRADING_ADDRESS = '0x8975Fdbad4884998AC36669d126471cE239D94b1'

export const FEE_DISTRBUTOR = '0x345bCD94ac3aBe5C7d9a5Cbe4647dF6cF449d01d'

export const LP_REWARD_API = 'https://api.krav.trade/krav/v1/miner/'

export const LP_REWARD_CONTRACT = '0x2e2dAb2d3f4dFb9F39ec6A11A0abb34fa7D27A19'

export const TRADE_REWARD_CONTRACT = '0x291182b2F0108E666e79b8fBC7c7b67C502564d7'

export const REWARD_API = 'https://api.krav.trade/krav/v1/reward/list/'

export const BURN_ADDRESS = '0x000000000000000000000000000000000000dead'

export const STAKE_HISTORY_API = 'https://api.krav.trade/krav/v1/staked/list?staker='
