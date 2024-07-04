import { useState, useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { MAX_GAIN_P } from '../../constant/math'

export function useGetTakeProfit(
  openPrice: BigNumber,
  currentPrice: BigNumber,
  isBuy: boolean,
  leverage: number,
  isSl: boolean,
  trader: string,
  positionSizeDai: any,
  tradeIndex: number,
  pairContract: any
) {
  const [takeProfit, setTakeProfit] = useState(0)

  useEffect(() => {
    const fetchFundingFee = async (
      openPrice: BigNumber,
      currentPrice: BigNumber,
      isBuy: boolean,
      leverage: number,
      isSl: boolean,
      trader: string,
      positionSizeDai: any,
      tradeIndex: number,
      pairContract: any
    ) => {
      if (pairContract) {
        try {
          const result = await pairContract.getTradeFundingFee(
            trader,
            0,
            tradeIndex,
            isBuy,
            positionSizeDai?.div(leverage).times(1e18).toString().split('.')[0],
            leverage
          )

          const diff = isBuy ? currentPrice.minus(openPrice) : openPrice.minus(currentPrice)
          const pFromTrade = diff.times(100 * leverage).div(openPrice)
          const pFromFunding = (result / 10 ** 18 / Number(positionSizeDai.toString())) * -100

          const tokenEarnedFromTrade = positionSizeDai.times(pFromTrade).div(100)
          const tokenEarnedFromFunding = positionSizeDai.times(pFromFunding).div(100)

          const totalEarned = tokenEarnedFromTrade.plus(tokenEarnedFromFunding)
          const p = totalEarned.div(positionSizeDai).times(100)

          if (p.isGreaterThan(MAX_GAIN_P)) {
            setTakeProfit(MAX_GAIN_P)
          } else {
            if (isSl) {
              if (p.isLessThan(-100)) {
                setTakeProfit(-100)
              } else {
                setTakeProfit(p)
              }
            } else {
              setTakeProfit(p)
            }
          }
        } catch (error) {
          console.error('Error fetching take profit:', error)
        }
      }
    }

    fetchFundingFee(openPrice, currentPrice, isBuy, leverage, isSl, trader, positionSizeDai, tradeIndex, pairContract)
  }, [pairContract, openPrice, currentPrice, isBuy, leverage, isSl, trader, positionSizeDai, tradeIndex])

  return useMemo(() => {
    return {
      takeProfit: new BigNumber(takeProfit),
    }
  }, [takeProfit])
}
