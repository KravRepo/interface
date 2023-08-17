import BigNumber from 'bignumber.js'
import { Tuple } from '../../../components/Trades/type'
import { eXDecimals } from '../../../utils/math'
import {
  FOUR_YEAR_TIMESTAMP,
  HALF_YEAR_TIMESTAMP,
  ONE_YEAR_TIMESTAMP,
  TOW_YEAR_TIMESTAMP,
} from '../../../constant/math'

export const forMatterOpenTrades = (
  res: any[],
  trades: number,
  account: string,
  isPendingOrder: boolean,
  orderId?: BigNumber
) => {
  if (!isPendingOrder) {
    res = res.filter((item) => new BigNumber(item.leverage._hex).isGreaterThan(0))
  }
  const userOpenTrades: Tuple[] = []

  for (let i = 0; i < trades; i++) {
    userOpenTrades.push({
      buy: res[i].buy,
      index: new BigNumber(res[i].index._hex).toNumber(),
      initialPosToken: isPendingOrder
        ? eXDecimals(res[i].positionSizeDai._hex, 18)
        : eXDecimals(res[i].initialPosToken._hex, 18),
      trader: account,
      sl: eXDecimals(res[i].sl._hex, 10),
      tp: eXDecimals(res[i].tp._hex, 10),
      pairIndex: new BigNumber(res[i].pairIndex._hex).toNumber(),
      //TODO open price decimals is 10?
      openPrice: eXDecimals(res[i].openPrice._hex, 10),
      leverage: new BigNumber(res[i].leverage._hex).toNumber(),
      positionSizeDai: eXDecimals(res[i].positionSizeDai._hex, 18),
      isPendingOrder: isPendingOrder,
      orderId: orderId,
    })
  }
  return userOpenTrades
}

export const getLockTime = (lockTime: number) => {
  let forMatterLockTime = 0
  switch (lockTime) {
    case 1:
      forMatterLockTime = HALF_YEAR_TIMESTAMP
      break
    case 2:
      forMatterLockTime = ONE_YEAR_TIMESTAMP
      break
    case 3:
      forMatterLockTime = TOW_YEAR_TIMESTAMP
      break
    case 4:
      forMatterLockTime = FOUR_YEAR_TIMESTAMP
      break
    default:
      forMatterLockTime = 0
  }
  return forMatterLockTime
}
