import { useMemo } from 'react'
import pair_info from '../abi/pair_info_v6_1.json'
import { useContract } from './hookV8/useContract'
import { useSingleCallResult } from './multicall'
import { useRootStore } from '../store/root'
import BigNumber from 'bignumber.js'
import { addDecimals } from '../utils/math'
import { useGetMarketStats } from './hookV8/useGetMarketStats'
import { useWeb3React } from '@web3-react/core'

export function useTradeData({
  tradeType,
  limitPrice,
  isBuy,
  leverage,
}: {
  tradeType?: number
  limitPrice?: string | BigNumber
  isBuy: boolean
  leverage?: number
}) {
  const { BTCPrice, tradePool, tradePairIndex } = useRootStore((state) => ({
    BTCPrice: state.BTCPrice,
    tradePool: state.tradePool,
    tradePairIndex: state.tradePairIndex,
  }))
  const { account } = useWeb3React()
  const pairContract = useContract(tradePool?.pairInfoT ?? null, pair_info.abi)

  const openPrice = useMemo(() => {
    return addDecimals(tradeType === 0 ? BTCPrice : limitPrice ?? '0', 10).toFixed(0, 1)
  }, [])

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
      collateral: 0,
      leverage,
    }
    return [...Object.values(args)]
  }, [account, tradePairIndex, openPrice, isBuy, leverage])

  const priceImpactArgs = useMemo(() => {
    return [openPrice, tradePairIndex, isBuy, isBuy ? openDaiLong?.toString() : openDaiShort?.toString()]
  }, [openPrice, tradePairIndex, isBuy, openDaiLong, openDaiShort])

  const liquidationPrice = useSingleCallResult(pairContract, 'getTradeLiquidationPrice', liquidationPriceArgs as any[])

  const priceImpact = useSingleCallResult(pairContract, 'getTradePriceImpact', priceImpactArgs as any[])
  console.log({ priceImpact, liquidationPrice })
  return useMemo(() => {
    return {
      fundingFee: tradePool.fundingFeePerBlockP ? tradePool.fundingFeePerBlockP.toFixed() : '-',
      liquidationPrice: liquidationPrice?.result ? liquidationPrice?.result?.toString() : '-',
      openDaiLong,
      openDaiShort,
      priceImpact: priceImpact.result ? priceImpact.result?.toString() : '-',
    }
  }, [])
}
