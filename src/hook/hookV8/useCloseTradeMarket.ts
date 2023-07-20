import { useTradingV6Contract } from './useContract'
import { useCallback } from 'react'
import { getGasLimit } from '../../utils'
import BigNumber from 'bignumber.js'
import { useGetUserOpenTrade } from './useGetUserOpenTrade'
import { useUpdateError } from './useUpdateError'

export const useCloseTradeMarket = (tradingAddress: string, storageAddress: string) => {
  const contract = useTradingV6Contract(tradingAddress)!
  const getUserOpenTrade = useGetUserOpenTrade(storageAddress)
  const updateError = useUpdateError()
  return useCallback(
    async (orderIndex: number, pairIndex = 0) => {
      try {
        const params = [pairIndex, orderIndex] as any
        let gasLimit = await getGasLimit(contract, 'closeTradeMarket', params)
        gasLimit = new BigNumber(gasLimit.toString()).times(1.1)
        const tx = await contract.closeTradeMarket(...params, { gasLimit: gasLimit.toFixed(0) })
        const closeTradeMarketTX = await tx.wait()
        console.log('tx', closeTradeMarketTX)
        const close = await getUserOpenTrade()
        console.log('close tx ', close)
      } catch (e) {
        updateError(e)
      }
    },
    [contract, tradingAddress, storageAddress]
  )
}
