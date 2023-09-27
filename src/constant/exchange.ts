export const EXCHANGE_TRADING_T = '0x1333235fA15A0991468cd67696a5E7b81E58DF86'
export const EXCHANGE_STORAGE_T = '0xcBf486ffe298Dffc021D45CCf8550BcD31C9D8e3'

export type BasicExchangeConfig = {
  symbol: string
  chartSymbol: string
  apiSymbol: string
  titleSymbol: string
  pairIndex: number
  fixDecimals: number
  logoSource: any
}

type ExchangeConfig = { [pairIndex: number]: BasicExchangeConfig }

export const EXCHANGE_CONFIG: ExchangeConfig = {
  0: {
    symbol: 'BTC',
    chartSymbol: 'BINANCE:BTCUSDT',
    apiSymbol: 'BTCUSDT',
    titleSymbol: 'BTC/USDT',
    pairIndex: 0,
    fixDecimals: 2,
    logoSource: require('../assets/imgs/tokens/bitcoin.svg'),
  },
  // 1: {
  //   symbol: 'ETH',
  //   chartSymbol: 'BINANCE:ETHUSDT',
  //   apiSymbol: 'ETHUSDT',
  //   titleSymbol: 'ETH/USDT',
  //   pairIndex: 1,
  // },
  // 2: {
  //   symbol: 'BNB',
  //   chartSymbol: 'BINANCE:BNBUSDT',
  //   apiSymbol: 'BNBUSDT',
  //   titleSymbol: 'BNB/USDT',
  //   pairIndex: 2,
  // },
  // 3: {
  //   symbol: 'CNY',
  //   chartSymbol: 'FX_IDC:JPYUSD',
  //   apiSymbol: 'CNY',
  //   titleSymbol: 'CNY/USDT',
  //   pairIndex: 3,
  // },
  2: {
    symbol: 'JPY',
    chartSymbol: 'FX_IDC:JPYUSD',
    apiSymbol: 'JPY',
    titleSymbol: 'JPY/USD',
    pairIndex: 2,
    fixDecimals: 6,
    logoSource: require('../assets/imgs/tokens/JPY.svg'),
  },
  3: {
    symbol: 'NDX100',
    chartSymbol: 'NASDAQ:NDX',
    apiSymbol: 'NDAQ',
    titleSymbol: 'NDX100',
    pairIndex: 3,
    fixDecimals: 2,
    logoSource: require('../assets/imgs/tokens/ndaq_icon.svg'),
  },
  4: {
    symbol: 'EUR',
    chartSymbol: 'FX:EURUSD',
    apiSymbol: 'EUR',
    titleSymbol: 'EUR/USD',
    pairIndex: 4,
    fixDecimals: 6,
    logoSource: require('../assets/imgs/tokens/EUR.svg'),
  },
  5: {
    symbol: 'ETH',
    chartSymbol: 'BINANCE:ETHUSDT',
    apiSymbol: 'ETHUSDT',
    titleSymbol: 'ETH/USDT',
    pairIndex: 5,
    fixDecimals: 2,
    logoSource: require('../assets/imgs/tokens/Ehter.svg'),
  },
  6: {
    symbol: 'BNB',
    chartSymbol: 'BINANCE:BNBUSDT',
    apiSymbol: 'BNBUSDT',
    titleSymbol: 'BNB/USDT',
    pairIndex: 6,
    fixDecimals: 2,
    logoSource: require('../assets/imgs/tokens/asset_BNB.svg'),
  },
}
