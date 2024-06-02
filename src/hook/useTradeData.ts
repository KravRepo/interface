import { useState, useEffect, useMemo } from 'react'
import pair_info from '../abi/pair_info_v6_1.json'
import { useContract } from './hookV8/useContract'
import { useRootStore } from '../store/root'
// import BigNumber from 'bignumber.js';
import { addDecimals } from '../utils/math'
import { useGetMarketStats } from './hookV8/useGetMarketStats'
import { useWeb3React } from '@web3-react/core'
// import { FEE_RATES } from '../constant/feeRate'
// import { EXPONENTS } from '../constant/exponents'

const MAX_RETRIES = 10

async function retryAsync(fn: any, args: any, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn(...args)
    } catch (error) {
      if (i === retries - 1) throw error
    }
  }
}

export function useTradeData({ tradeType, limitPrice, isBuy, positionSizeDai, leverage }: any) {
  const { BTCPrice, tradePool, tradePairIndex } = useRootStore((state) => ({
    BTCPrice: state.BTCPrice,
    tradePool: state.tradePool,
    tradePairIndex: state.tradePairIndex,
  }))
  const { account } = useWeb3React()
  const pairContract = useContract(tradePool?.pairInfoT ?? null, pair_info.abi)

  const [liquidationPrice, setLiquidationPrice] = useState('-')
  const [priceImpact, setPriceImpact] = useState('-')

  const openPrice = useMemo(() => {
    return addDecimals(tradeType === 0 ? BTCPrice : limitPrice ?? '0', 10).toFixed(0, 1)
  }, [tradeType, BTCPrice, limitPrice])

  const { openDaiLong, openDaiShort } = useGetMarketStats(
    tradePool?.storageT || '',
    tradePool?.decimals || 18,
    tradePool.pairInfoT || '',
    tradePairIndex
  )

  const liquidationPriceArgs = useMemo(() => {
    const args = {
      trader: account,
      pairIndex: tradePairIndex,
      index: 0,
      openPrice,
      long: isBuy,
      collateral: positionSizeDai?.div(leverage).times(1e18).toString().split('.')[0],
      leverage,
    }
    return [...Object.values(args)]
  }, [account, tradePairIndex, openPrice, isBuy, leverage, positionSizeDai])

  const priceImpactArgs = useMemo(() => {
    const openInterest = positionSizeDai.times(1e18).times(leverage).toString()
    // let openDaiPrecision
    // if (isBuy) {
    //   openDaiPrecision = openDaiLong?.times(1e18)
    // } else {
    //   openDaiPrecision = openDaiShort?.times(1e18)
    // }
    return [openPrice, tradePairIndex, isBuy, openInterest]
  }, [openPrice, tradePairIndex, isBuy, openDaiLong, openDaiShort, positionSizeDai, leverage])

  useEffect(() => {
    const fetchLiquidationPrice = async () => {
      if (
        pairContract &&
        liquidationPriceArgs.every((arg) => arg !== undefined) &&
        positionSizeDai?.div(leverage).times(1e18).toString().split('.')[0] !== '0'
      ) {
        try {
          const result = await retryAsync(pairContract.getTradeLiquidationPrice, liquidationPriceArgs)
          setLiquidationPrice(
            '$' + (result / 10 ** 10).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          )
        } catch (error) {
          console.error('Error fetching liquidation price:', error)
        }
      } else {
        setLiquidationPrice('-')
      }
    }

    fetchLiquidationPrice()
  }, [pairContract, liquidationPriceArgs, openDaiLong, openDaiShort, positionSizeDai, leverage])

  useEffect(() => {
    // console.log(priceImpactArgs)

    const fetchPriceImpact = async () => {
      if (pairContract && priceImpactArgs.every((arg) => arg !== undefined)) {
        try {
          const result = await retryAsync(pairContract.getTradePriceImpact, priceImpactArgs)
          // console.log('trading storage', tradePool.storageT)
          // console.log('pairs storage', tradePool.pairStorageT)
          // console.log('pair infos', tradePool.pairInfoT)
          // console.log('price impact p', result.priceImpactP.toString())
          // console.log('price after impact', (result.priceAfterImpact / 10 ** 10).toString())
          // console.log('price after impact', (result.priceAfterImpact / 10 ** 10).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
          // console.log('btc price', BTCPrice.toString())
          setPriceImpact(
            '$' +
              (result.priceAfterImpact / 10 ** 10).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
          )
        } catch (error) {
          console.error('Error fetching price impact:', error)
        }
      }
    }

    fetchPriceImpact()
  }, [pairContract, priceImpactArgs, openDaiLong, openDaiShort, positionSizeDai, leverage])

  // useEffect(() => {
  //   if (!Object.keys(FEE_RATES).includes(pairContract?.address || '')) {
  //     FEE_RATES[pairContract?.address || ''] = 0.1
  //   }
  //   const baseFeeRate = FEE_RATES[pairContract?.address || '']
  //   const totalLiquidity = parseFloat(tradePool.poolTotalSupply?.toString() || '')
    
  //   if (!Object.keys(EXPONENTS).includes(pairContract?.address || '')) {
  //     EXPONENTS[pairContract?.address || ''] = 1
  //   }
  //   const priceImpactExponent = EXPONENTS[pairContract?.address || '']
  //   const longTotal = parseFloat(openDaiLong?.toString() || '')
  //   const shortTotal = parseFloat(openDaiShort?.toString() || '')
  //   const openInterest = parseFloat(positionSizeDai.times(leverage).toString() || '')
  //   const nextLongTotal = longTotal + (isBuy ? openInterest : 0)
  //   const nextShortTotal = shortTotal + (isBuy ? 0 : openInterest)
  //   const delta = Math.abs(longTotal - shortTotal)
  //   const deltaNext = Math.abs(nextLongTotal - nextShortTotal)
    
  //   if (deltaNext > delta) {
  //     const imbalanceRatio = deltaNext / totalLiquidity
  //     if (imbalanceRatio > 1) return setPriceImpact('Invalid Order Size')
  //     const afterPow = Math.pow(1 - imbalanceRatio, priceImpactExponent)
  //     const priceImpact = (baseFeeRate * (deltaNext - delta)) / afterPow
  //     const priceImpactP = priceImpact / parseFloat(BTCPrice.toString() || '')
  //     const priceAfterImpact = isBuy ? parseFloat(BTCPrice.toString() || '') * (1 + priceImpactP) : parseFloat(BTCPrice.toString() || '') * (1 - priceImpactP)
  //     setPriceImpact(
  //       '$' +
  //         priceAfterImpact.toLocaleString('en-US', {
  //           minimumFractionDigits: 2,
  //           maximumFractionDigits: 2,
  //         })
  //     )
  //   } else {
  //     setPriceImpact('-')
  //   }
  // }, [pairContract, openDaiLong, openDaiShort, positionSizeDai, leverage])


  return useMemo(() => {
    return {
      fundingFee: tradePool.fundingFeePerBlockP ? tradePool.fundingFeePerBlockP.toFixed() : '-',
      liquidationPrice,
      openDaiLong,
      openDaiShort,
      priceImpact,
    }
  }, [tradePool.fundingFeePerBlockP, liquidationPrice, openDaiLong, openDaiShort, priceImpact, positionSizeDai, leverage])
}
