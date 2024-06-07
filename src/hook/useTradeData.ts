import { useState, useEffect, useMemo } from 'react'
import { PairInfosABI } from '../abi/deployed/PairInfosABI'
import { useContract } from './hookV8/useContract'
import { useRootStore } from '../store/root'
import BigNumber from 'bignumber.js';
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
    
    const cleanedPriceImpact = priceImpact.replace('$', '').replace(/,/g, '').replace(',', '');
    const [integerPart, decimalPart] = cleanedPriceImpact.split('.');
    const fullNumberStr = integerPart + (decimalPart || '');
    const decimalPlaces = decimalPart ? decimalPart.length : 0;
    const bigNumberStr = fullNumberStr + '0'.repeat(10 - decimalPlaces);
    const openPriceAfterImpact = (new BigNumber(bigNumberStr)).toString();

    const args = {
      trader: account,
      pairIndex: tradePairIndex,
      index: 0,
      openPrice: openPriceAfterImpact,
      long: isBuy,
      collateral: positionSizeDai?.div(leverage).times(1e18).toString().split('.')[0],
      leverage,
    }
    return [...Object.values(args)]
  }, [account, tradePairIndex, openPrice, priceImpact, isBuy, leverage, positionSizeDai])

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
    const totalLiquidity = parseFloat(tradePool.poolTotalSupply?.toString() || '')
    const netExposure = positionSizeDai.times(leverage).toString();

    if (netExposure >= totalLiquidity) {
      setLiquidationPrice('Insufficient Liquidity')
      return
    }
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
    // console.log('ktoken', tradePool.vaultT);
    // console.log('trading', tradePool.tradingT);
    // console.log('storage', tradePool.storageT);
    const totalLiquidity = parseFloat(tradePool.poolTotalSupply?.toString() || '')
    const netExposure = positionSizeDai.times(leverage).toString();

    if (netExposure >= totalLiquidity) {
      setPriceImpact('Insufficient Liquidity')
      return
    }

    const fetchPriceImpact = async () => {
      if (pairContract && priceImpactArgs.every((arg: any) => arg !== undefined)) {
        try {
          const result = await retryAsync(pairContract.getTradePriceImpact, priceImpactArgs)  
          
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

  return useMemo(() => {
    // console.log(tradePool)
    return {
      fundingFee: tradePool.fundingFeePerBlockP ? tradePool.fundingFeePerBlockP.toFixed() : '-',
      liquidationPrice,
      openDaiLong,
      openDaiShort,
      priceImpact,
    }
  }, [
    tradePool.fundingFeePerBlockP,
    liquidationPrice,
    openDaiLong,
    openDaiShort,
    priceImpact,
    positionSizeDai,
    leverage,
  ])
}
