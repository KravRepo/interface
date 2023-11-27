export const EXCHANGE_TRADING_T = [
  '0x1333235fA15A0991468cd67696a5E7b81E58DF86',
  '0x8975Fdbad4884998AC36669d126471cE239D94b1',
]
export const EXCHANGE_STORAGE_T = [
  '0xcBf486ffe298Dffc021D45CCf8550BcD31C9D8e3',
  '0xCa14274EfC3b73A536e799c01E0b97c687E23454',
]

export type BasicExchangeConfig = {
  symbol: string
  chartSymbol: string
  apiSymbol: string
  titleSymbol: string
  pairIndex: number
  fixDecimals: number
  logoSource: any
  useDataFeed: boolean
}

export type ExchangeConfig = { [pairIndex: number]: BasicExchangeConfig }

export const EXCHANGE_CONFIG: ExchangeConfig = {
  0: {
    symbol: 'BTC',
    chartSymbol: 'BINANCE:BTCUSDT',
    apiSymbol: 'BTC',
    titleSymbol: 'BTC/USDT',
    pairIndex: 0,
    fixDecimals: 2,
    logoSource: require('../assets/imgs/tokens/bitcoin.svg'),
    useDataFeed: false,
  },
  2: {
    symbol: 'JPY',
    chartSymbol: 'FX_IDC:JPYUSD',
    apiSymbol: 'JPY',
    titleSymbol: 'JPY/USD',
    pairIndex: 2,
    fixDecimals: 6,
    logoSource: require('../assets/imgs/tokens/JPY.svg'),
    useDataFeed: false,
  },
  3: {
    symbol: 'NDX100',
    chartSymbol: 'NASDAQ:NDX',
    apiSymbol: 'NDAQ',
    titleSymbol: 'NDX100',
    pairIndex: 3,
    fixDecimals: 2,
    logoSource: require('../assets/imgs/tokens/ndaq_icon.svg'),
    useDataFeed: true,
  },
  4: {
    symbol: 'EUR',
    chartSymbol: 'FX:EURUSD',
    apiSymbol: 'EUR',
    titleSymbol: 'EUR/USD',
    pairIndex: 4,
    fixDecimals: 6,
    logoSource: require('../assets/imgs/tokens/EUR.svg'),
    useDataFeed: false,
  },
  5: {
    symbol: 'ETH',
    chartSymbol: 'BINANCE:ETHUSDT',
    apiSymbol: 'ETH',
    titleSymbol: 'ETH/USDT',
    pairIndex: 5,
    fixDecimals: 2,
    logoSource: require('../assets/imgs/tokens/Ehter.svg'),
    useDataFeed: false,
  },
  6: {
    symbol: 'BNB',
    chartSymbol: 'BINANCE:BNBUSDT',
    apiSymbol: 'BNB',
    titleSymbol: 'BNB/USDT',
    pairIndex: 6,
    fixDecimals: 2,
    logoSource: require('../assets/imgs/tokens/asset_BNB.svg'),
    useDataFeed: false,
  },
}

export const BASE_PAIR_CONFIG: ExchangeConfig = {
  0: {
    symbol: 'BTC',
    chartSymbol: 'BINANCE:BTCUSDT',
    apiSymbol: 'BTC',
    titleSymbol: 'BTC/USDT',
    pairIndex: 0,
    fixDecimals: 2,
    logoSource: require('../assets/imgs/tokens/bitcoin.svg'),
    useDataFeed: false,
  },
  1: {
    symbol: 'ETH',
    chartSymbol: 'BINANCE:ETHUSDT',
    apiSymbol: 'ETH',
    titleSymbol: 'ETH/USDT',
    pairIndex: 1,
    fixDecimals: 2,
    logoSource: require('../assets/imgs/tokens/Ehter.svg'),
    useDataFeed: false,
  },
}

export const COIN_BASE_TEST_CONFIG = {
  0: {
    symbol: 'BTC',
    chartSymbol: 'BINANCE:BTCUSDT',
    apiSymbol: 'BTC',
    titleSymbol: 'BTC/USDT',
    pairIndex: 0,
    fixDecimals: 2,
    logoSource: require('../assets/imgs/tokens/bitcoin.svg'),
    useDataFeed: false,
  },
  1: {
    symbol: 'Coinbase',
    chartSymbol: 'NASDAQ:COIN',
    apiSymbol: 'COIN',
    titleSymbol: 'Coinbase/USD',
    pairIndex: 1,
    fixDecimals: 4,
    logoSource: require('../assets/imgs/tokens/coinbase.svg'),
    useDataFeed: true,
  },
}
