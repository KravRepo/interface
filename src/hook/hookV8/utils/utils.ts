import BigNumber from 'bignumber.js'
import { Tuple } from '../../../components/Trades/type'
import { eXDecimals } from '../../../utils/math'
import {
  FOUR_YEAR_TIMESTAMP,
  HALF_YEAR_TIMESTAMP,
  ONE_WEEK_TIMESTAMP,
  ONE_YEAR_TIMESTAMP,
  TOW_YEAR_TIMESTAMP,
} from '../../../constant/math'

export const forMatterOpenTrades = (
  res: any[],
  trades: number,
  account: string,
  isPendingOrder: boolean,
  orderId?: BigNumber,
  isInPending?: boolean,
  decimals?: number
) => {
  if (!isPendingOrder) {
    res = res.filter((item) => new BigNumber(item.leverage._hex).isGreaterThan(0))
  }
  const userOpenTrades: Tuple[] = []

  for (let i = 0; i < res.length; i++) {
    if (!res[i]?.leverage) break
    userOpenTrades.push({
      buy: res[i].buy,
      index: new BigNumber(res[i]?.index._hex ?? '0').toNumber(),
      initialPosToken: isPendingOrder
        ? eXDecimals(res[i].positionSizeDai._hex, decimals ?? 18)
        : eXDecimals(res[i].initialPosToken._hex, decimals ?? 18),
      trader: account,
      sl: eXDecimals(res[i].sl._hex, 10),
      tp: eXDecimals(res[i].tp._hex, 10),
      pairIndex: new BigNumber(res[i].pairIndex._hex).toNumber(),
      //TODO open price decimals is 10?
      openPrice: eXDecimals(res[i].openPrice._hex, 10),
      leverage: new BigNumber(res[i].leverage._hex).toNumber(),
      positionSizeDai: eXDecimals(res[i].positionSizeDai._hex, decimals ?? 18),
      beingMarketClosed: false,
      isPendingOrder: isPendingOrder,
      orderId: orderId,
      isInPending: isInPending,
      block: res[i].block ? new BigNumber(res[i].block._hex) : undefined,
    })
  }
  return userOpenTrades
}

export const isBeingMarketClosed = (marketOrders: Tuple[], pendingMarketOrders: Tuple[], blockNumber?: number) => {
  const trades: Tuple[] = []
  marketOrders.forEach((order) => {
    const t = { ...order }
    pendingMarketOrders.forEach((pendingOrder) => {
      if (pendingOrder?.index === order?.index && pendingOrder?.leverage === 0) {
        t.beingMarketClosed = true
        t.orderId = pendingOrder.orderId
        t.isInPending =
          pendingOrder.block && blockNumber ? new BigNumber(blockNumber).gt(pendingOrder.block.plus(30)) : false
      }
    })
    trades.push(t)
  })
  return trades
}

export const getLockTime = (lockTime: number) => {
  let forMatterLockTime = 0
  switch (lockTime) {
    case 1:
      forMatterLockTime = Math.floor(HALF_YEAR_TIMESTAMP / ONE_WEEK_TIMESTAMP) * ONE_WEEK_TIMESTAMP
      break
    case 2:
      forMatterLockTime = Math.floor(ONE_YEAR_TIMESTAMP / ONE_WEEK_TIMESTAMP) * ONE_WEEK_TIMESTAMP
      break
    case 3:
      forMatterLockTime = Math.floor(TOW_YEAR_TIMESTAMP / ONE_WEEK_TIMESTAMP) * ONE_WEEK_TIMESTAMP
      break
    case 4:
      forMatterLockTime = Math.floor(FOUR_YEAR_TIMESTAMP / ONE_WEEK_TIMESTAMP) * ONE_WEEK_TIMESTAMP
      break
    default:
      forMatterLockTime = 0
  }
  return forMatterLockTime
}
