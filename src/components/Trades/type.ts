import BigNumber from 'bignumber.js'

export type Tuple = TupleWithTrade & {
  isPendingOrder: boolean
  beingMarketClosed: boolean
  orderId?: BigNumber
  isInPending?: boolean
}

export type TupleWithTrade = {
  trader: string
  sl: string | BigNumber
  tp: string | BigNumber
  pairIndex: number
  openPrice: string | BigNumber
  leverage: number
  initialPosToken: number | BigNumber
  index: number
  buy: boolean
  positionSizeDai: string | BigNumber
}

export type TupleLimitOrder = {
  block: number | BigNumber
  buy: boolean
  index: number
  leverage: number
  maxPrice: BigNumber
  minPrice: BigNumber
  pairIndex: number
  positionSize: string | BigNumber
  sl: string | BigNumber
  spreadReductionP: BigNumber
  tokenId: number | BigNumber
  tp: string | BigNumber
  trader: string
}

export type OpenTradeParams = {
  tuple: TupleWithTrade
  tradeType: number
  spreadReductionId: number
  slippageP: string | BigNumber
  referral: string
  tradingAddress: string
  storageAddress: string
}

export type UpdateOpenLimitOrderParams = {
  pairIndex: number
  index: number
  price: string | BigNumber
  sl: string | BigNumber
  tp: string | BigNumber
}

export type CloseTradeMarketParams = {
  pairIndex: number
  index: number
}
