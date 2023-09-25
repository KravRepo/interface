export const EXCHANGE_TRADING_T = '0x1333235fA15A0991468cd67696a5E7b81E58DF86'

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
    logoSource: '',
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
    logoSource: '',
  },
}
