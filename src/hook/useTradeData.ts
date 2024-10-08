import { useState, useEffect, useMemo } from 'react'
import { PairInfosABI } from '../abi/deployed/PairInfosABI'
import { useContract } from './hookV8/useContract'
import { useRootStore } from '../store/root'
import BigNumber from 'bignumber.js'
import { addDecimals, eXDecimals, getLiqPrice } from '../utils/math'
import { useGetMarketStats } from './hookV8/useGetMarketStats'
import { useWeb3React } from '@web3-react/core'
import { useSingleCallResult } from './multicall'
// import { FEE_RATES } from '../constant/feeRate'
// import { EXPONENTS } from '../constant/exponents'

// const MAX_RETRIES = 10

// async function retryAsync(fn: any, args: any, retries = MAX_RETRIES) {
//   for (let i = 0; i < retries; i++) {
//     try {
//       return await fn(...args)
//     } catch (error) {
//       if (i === retries - 1) throw error
//     }
//   }
// }

export function useTradeData({ tradeType, limitPrice, isBuy, positionSizeDai, leverage }: any) {
  const { BTCPrice, tradePool, tradePairIndex } = useRootStore((state) => ({
    BTCPrice: state.BTCPrice,
    tradePool: state.tradePool,
    tradePairIndex: state.tradePairIndex,
  }))
  const { account } = useWeb3React()
  const pairContract = useContract(tradePool?.pairInfoT ?? null, PairInfosABI)

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
    const cleanedPriceImpact = priceImpact.replace('$', '').replace(/,/g, '').replace(',', '')
    const [integerPart, decimalPart] = cleanedPriceImpact.split('.')
    const fullNumberStr = integerPart + (decimalPart || '')
    const decimalPlaces = decimalPart ? decimalPart.length : 0
    const bigNumberStr = fullNumberStr + '0'.repeat(10 - decimalPlaces)
    const openPriceAfterImpact = new BigNumber(bigNumberStr).toString()
    const precision = new BigNumber(10).pow(tradePool?.decimals || 18)
    const args = {
      trader: account,
      pairIndex: tradePairIndex,
      index: 0,
      openPrice: openPriceAfterImpact,
      long: isBuy,
      collateral: positionSizeDai?.div(leverage).times(precision).toFixed(),
      leverage,
    }
    return [...Object.values(args)]
  }, [priceImpact, tradePool?.decimals, account, tradePairIndex, isBuy, positionSizeDai, leverage])

  const priceImpactArgs = useMemo(() => {
    const openInterest = positionSizeDai
      .times(new BigNumber(10).pow(tradePool?.decimals || 18))
      .times(leverage)
      .toString()
    // let openDaiPrecision
    // if (isBuy) {
    //   openDaiPrecision = openDaiLong?.times(1e18)
    // } else {
    //   openDaiPrecision = openDaiShort?.times(1e18)
    // }
    return [openPrice, tradePairIndex, isBuy.toString(), openInterest]
  }, [positionSizeDai, tradePool?.decimals, leverage, openPrice, tradePairIndex, isBuy])

  useEffect(() => {
    const totalLiquidity = parseFloat(tradePool.poolTotalSupply?.toString() || '')
    const netExposure = positionSizeDai.times(leverage).toString()

    if (netExposure >= totalLiquidity) {
      setLiquidationPrice('-')
      // setLiquidationPrice('Insufficient Liquidity')
      return
    }
    const fetchLiquidationPrice = () => {
      if (
        pairContract &&
        liquidationPriceArgs.every((arg) => arg !== undefined) &&
        positionSizeDai
          ?.div(leverage)
          .times(new BigNumber(10).pow(tradePool?.decimals || 18))
          .toString()
          .split('.')[0] !== '0'
      ) {
        const liqPrice = parseFloat(
          getLiqPrice(
            eXDecimals(openPrice, 10),
            eXDecimals(positionSizeDai, tradePool?.decimals || 18),
            isBuy,
            leverage
          ).toString()
        ).toLocaleString('en-US', { maximumFractionDigits: 2 })

        setLiquidationPrice(liqPrice)
        // try {
        //   const result = await retryAsync(pairContract.getTradeLiquidationPrice, liquidationPriceArgs)
        //   setLiquidationPrice(
        //     '$' + (result / 10 ** 10).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        //   )
        // } catch (error) {
        //   console.error('Error fetching liquidation price:', error)
        // }
      } else {
        setLiquidationPrice('-')
      }
    }

    fetchLiquidationPrice()
  }, [
    pairContract,
    liquidationPriceArgs,
    openDaiLong,
    openDaiShort,
    positionSizeDai,
    leverage,
    isBuy,
    openPrice,
    tradePool.poolTotalSupply,
    tradePool?.decimals,
  ])

  const priceImpactRes = useSingleCallResult(pairContract, 'getTradePriceImpact', priceImpactArgs)

  useEffect(() => {
    const totalLiquidity = parseFloat(tradePool.poolTotalSupply?.toString() || '')
    const netExposure = positionSizeDai.times(leverage).toString()

    if (netExposure >= totalLiquidity) {
      setPriceImpact('Insufficient Liquidity')
      return
    }

    if (!priceImpactRes.result) return

    setPriceImpact(
      '$' +
        (priceImpactRes.result.priceAfterImpact / 10 ** 10).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
    )

    // const fetchPriceImpact = async () => {
    //   if (pairContract && priceImpactArgs.every((arg: any) => arg !== undefined)) {
    //     try {
    //       const result = await retryAsync(pairContract.getTradePriceImpact, priceImpactArgs)

    //       setPriceImpact(
    //         '$' +
    //           (result.priceAfterImpact / 10 ** 10).toLocaleString('en-US', {
    //             minimumFractionDigits: 2,
    //             maximumFractionDigits: 2,
    //           })
    //       )
    //     } catch (error) {
    //       console.error('Error fetching price impact:', error)
    //     }
    //   }
    // }

    // fetchPriceImpact()
  }, [
    pairContract,
    priceImpactArgs,
    openDaiLong,
    openDaiShort,
    isBuy,
    positionSizeDai,
    leverage,
    tradePool.poolTotalSupply,
    priceImpactRes.result,
  ])

  // useEffect(() => {
  //   const fetchFundingFee = async () => {
  //     if (pairContract) {
  //       try {
  //         console.log(
  //           'account',
  //           account,
  //           'collateral',
  //           positionSizeDai?.div(leverage).times(1e18).toString().split('.')[0],
  //           'leverage',
  //           leverage
  //         )
  //         const result = await retryAsync(pairContract.getTradeFundingFee, [
  //           account,
  //           0,
  //           0,
  //           isBuy,
  //           positionSizeDai?.div(leverage).times(1e18).toString().split('.')[0],
  //           leverage,
  //         ])

  //         console.log('result', (result / 10 ** 18).toString())
  //       } catch (error) {
  //         console.error('Error fetching price impact:', error)
  //       }
  //     }
  //   }

  //   fetchFundingFee()
  // }, [pairContract, priceImpactArgs, openDaiLong, openDaiShort, isBuy, positionSizeDai, leverage])

  return useMemo(() => {
    return {
      fundingFee: tradePool.fundingFeePerBlockP ? tradePool.fundingFeePerBlockP.toFixed() : '-',
      liquidationPrice,
      openDaiLong,
      openDaiShort,
      priceImpact,
    }
  }, [tradePool.fundingFeePerBlockP, openDaiLong, openDaiShort, priceImpact, liquidationPrice])
}
