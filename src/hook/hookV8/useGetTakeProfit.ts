import { useState, useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { MAX_GAIN_P } from '../../constant/math'
import { useSingleCallResult } from '../multicall'

export function useGetTakeProfit(
  openPrice: BigNumber,
  currentPrice: BigNumber,
  isBuy: boolean,
  leverage: number,
  isSl: boolean,
  trader: string,
  positionSizeDai: any,
  tradeIndex: number,
  pairIndex: number,
  pairContract: any
) {
  const [takeProfit, setTakeProfit] = useState(0)

  const args = useMemo(() => {
    return [
      trader,
      pairIndex,
      tradeIndex,
      isBuy === true ? 'true' : 'false',
      positionSizeDai?.div(leverage).times(1e18).toString().split('.')[0],
      leverage,
    ]
  }, [isBuy, leverage, pairIndex, positionSizeDai, tradeIndex, trader])

  const tradeFundingFee = useSingleCallResult(pairContract, 'getTradeFundingFee', args)

  useEffect(() => {
    if (!tradeFundingFee.result) return

    const result = tradeFundingFee.result as any

    if (isBuy) {
      console.log('tradingFundingFee', result.toString())
      console.log('tradingFundingFee', (result / 10 ** 18).toString())
      console.log('result', (result / 10 ** 18 / Number(positionSizeDai.toString())).toString())
    }

    const diff = isBuy ? currentPrice.minus(openPrice) : openPrice.minus(currentPrice)
    const pFromTrade = diff.times(100 * leverage).div(openPrice)
    // const pFromFunding = (result / 10 ** 18 / Number(positionSizeDai.toString())) * -100

    const tokenEarnedFromTrade = positionSizeDai.times(pFromTrade).div(100)
    // const tokenEarnedFromFunding = positionSizeDai.times(pFromFunding).div(100)

    // const totalEarned = tokenEarnedFromTrade.plus(tokenEarnedFromFunding)
    const totalEarned = tokenEarnedFromTrade
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
    // const fetchFundingFee = async (
    //   openPrice: BigNumber,
    //   currentPrice: BigNumber,
    //   isBuy: boolean,
    //   leverage: number,
    //   isSl: boolean,
    //   trader: string,
    //   positionSizeDai: any,
    //   tradeIndex: number,
    //   pairContract: any
    // ) => {
    //   if (pairContract && openPrice && leverage && positionSizeDai) {
    //     try {
    //       const result = await pairContract.getTradeFundingFee(
    //         trader,
    //         pairIndex,
    //         tradeIndex,
    //         isBuy,
    //         positionSizeDai?.div(leverage).times(1e18).toString().split('.')[0],
    //         leverage
    //       )

    //       const diff = isBuy ? currentPrice.minus(openPrice) : openPrice.minus(currentPrice)
    //       const pFromTrade = diff.times(100 * leverage).div(openPrice)
    //       const pFromFunding = (result / 10 ** 18 / Number(positionSizeDai.toString())) * -100

    //       const tokenEarnedFromTrade = positionSizeDai.times(pFromTrade).div(100)
    //       const tokenEarnedFromFunding = positionSizeDai.times(pFromFunding).div(100)

    //       const totalEarned = tokenEarnedFromTrade.plus(tokenEarnedFromFunding)
    //       const p = totalEarned.div(positionSizeDai).times(100)

    //       if (p.isGreaterThan(MAX_GAIN_P)) {
    //         setTakeProfit(MAX_GAIN_P)
    //       } else {
    //         if (isSl) {
    //           if (p.isLessThan(-100)) {
    //             setTakeProfit(-100)
    //           } else {
    //             setTakeProfit(p)
    //           }
    //         } else {
    //           setTakeProfit(p)
    //         }
    //       }
    //     } catch (error) {
    //       console.error('Error fetching take profit:', error)
    //     }
    //   }
    // }
  }, [
    pairContract,
    openPrice,
    currentPrice,
    isBuy,
    leverage,
    isSl,
    trader,
    positionSizeDai,
    tradeIndex,
    pairIndex,
    tradeFundingFee.result,
  ])

  return useMemo(() => {
    return {
      takeProfit: new BigNumber(takeProfit),
    }
  }, [takeProfit])
}
