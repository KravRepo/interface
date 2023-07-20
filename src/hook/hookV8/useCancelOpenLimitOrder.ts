import { useTradingV6Contract } from './useContract'
import { useCallback } from 'react'
import { getGasLimit } from '../../utils'
import BigNumber from 'bignumber.js'
import { useGetUserOpenLimitOrders } from './useGetUserOpenLimitOrders'
import { useUpdateError } from './useUpdateError'

export const useCancelOpenLimitOrder = (tradingAddress: string, storageAddress: string) => {
  const contract = useTradingV6Contract(tradingAddress)!
  const getUserOpenLimitOrders = useGetUserOpenLimitOrders(storageAddress)
  const updateError = useUpdateError()
  return useCallback(
    async (orderIndex: number, pairIndex = 0) => {
      try {
        const params = [pairIndex, orderIndex] as any
        let gasLimit = await getGasLimit(contract, 'cancelOpenLimitOrder', params)
        gasLimit = new BigNumber(gasLimit.toString()).times(1.1)
        const tx = await contract.cancelOpenLimitOrder(...params, { gasLimit: gasLimit.toFixed(0) })
        console.log('tx', await tx.wait())
        const close = await getUserOpenLimitOrders()
        console.log('close tx', close)
      } catch (e) {
        updateError(e)
      }
    },
    [contract, tradingAddress, storageAddress]
  )
}
