import BigNumber from 'bignumber.js'
import { BASE_ONE_HOUR_BLOCK, LIQ_THRESHOLD_P, MAX_GAIN_P, OPEN_FEES } from 'constant/math'
import { getBigNumberStr } from './index'

export const eXDecimals = (value: BigNumber | string, decimals: number) => {
  return new BigNumber(value).div(new BigNumber(10).pow(decimals))
}

export const addDecimals = (value: BigNumber | string, decimals: number) => {
  return new BigNumber(value).times(new BigNumber(10).pow(decimals))
}

//TODO: fix After docking the factory contract
export const getLongOrShortUSD = (
  leverage: number,
  inputAmount: BigNumber,
  fees: BigNumber,
  targetPrice: BigNumber,
  tokenToBTC: number
) => {
  return inputAmount.minus(fees).times(leverage).div(tokenToBTC)
}

/*contract publicity
  // int liqPriceDistance = int(openPrice) * (
  //   int(collateral * LIQ_THRESHOLD_P / 100)
  //   - int(rolloverFee) - fundingFee
  // ) / int(collateral) / int(leverage);
*/

export const getLiqPrice = (
  openPrice: BigNumber,
  collateral: BigNumber,
  isLong: boolean,
  leverage: number,
  rolloverFee: BigNumber | number = 0,
  fundingFee: BigNumber | number = 0
) => {
  const collateralImpact = collateral.times(LIQ_THRESHOLD_P).div(100).minus(rolloverFee).minus(fundingFee)
  const liqPriceDistance = openPrice.times(collateralImpact).div(collateral).div(leverage)
  const liqPrice = isLong ? openPrice.minus(liqPriceDistance) : openPrice.plus(liqPriceDistance)
  return liqPrice.isGreaterThan(0) ? liqPrice : new BigNumber(0)
}

export const getFees = (positionDAI: BigNumber, leverage: number) => {
  return positionDAI.times(leverage).times(OPEN_FEES).times(2)
}

//    function currentPercentProfit(uint openPrice, uint currentPrice, bool buy, uint leverage) private pure returns(int p){
//         int diff = buy ? int(currentPrice) - int(openPrice) : int(openPrice) - int(currentPrice);
//         int maxPnlP = int(MAX_GAIN_P) * int(PRECISION);
//     currentPrice = openPrice -  diff
//     diff = p *  openPrice / 100 * int(PRECISION) * int(leverage)
//     currentPrice = openPrice - p *  openPrice / 100 * int(PRECISION) * int(leverage)
//         p = diff * 100 * int(PRECISION) * int(leverage) / int(openPrice);
//         p = p > maxPnlP ? maxPnlP : p;
//     }
export const getReachPrice = (leverage: number, isBuy: boolean, percentProfit: number, openPrice: BigNumber) => {
  if (isBuy) {
    const index = openPrice.times(percentProfit).div(100 * leverage)
    return index.plus(openPrice)
  } else {
    const index = openPrice.times(percentProfit).div(100 * leverage)
    return openPrice.minus(index)
  }
}

export const getTakeProfit = (
  openPrice: BigNumber,
  currentPrice: BigNumber,
  isBuy: boolean,
  leverage: number,
  isSl: boolean
) => {
  const diff = isBuy ? currentPrice.minus(openPrice) : openPrice.minus(currentPrice)
  const p = diff.times(100 * leverage).div(openPrice)
  if (p.isGreaterThan(MAX_GAIN_P)) {
    return new BigNumber(MAX_GAIN_P)
  } else {
    if (isSl) {
      if (p.isLessThan(-100)) return new BigNumber(-100)
      else return p
    } else return p
  }
}

export const getBorrowFees = (fundingFeePerBlockP?: BigNumber) => {
  if (fundingFeePerBlockP) {
    return getBigNumberStr(eXDecimals(fundingFeePerBlockP, 10).div(100).times(BASE_ONE_HOUR_BLOCK), 6)
  } else return 0
}
