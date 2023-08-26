import { useTradingV6Contract } from './useContract'
import { useCallback } from 'react'
import { getGasLimit } from '../../utils'
import BigNumber from 'bignumber.js'
import { useGetUserOpenLimitOrders } from './useGetUserOpenLimitOrders'
import { useUpdateError } from './useUpdateError'
import { useRootStore } from '../../store/root'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'

export const useCancelOpenLimitOrder = (tradingAddress: string, storageAddress: string) => {
  const contract = useTradingV6Contract(tradingAddress)!
  const { getUserOpenLimitOrders } = useGetUserOpenLimitOrders()
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  const setTransactionState = useRootStore((store) => store.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((store) => store.setSuccessSnackbarInfo)
  return useCallback(
    async (orderIndex: number, pairIndex = 0) => {
      try {
        const params = [pairIndex, orderIndex] as any
        let gasLimit = await getGasLimit(contract, 'cancelOpenLimitOrder', params)
        gasLimit = new BigNumber(gasLimit.toString()).times(1.1)
        setTransactionState(TransactionState.INTERACTION)
        setTransactionDialogVisibility(true)
        const tx = await contract.cancelOpenLimitOrder(...params, { gasLimit: gasLimit.toFixed(0) })
        setTransactionState(TransactionState.CANCEL_LIMIT_ORDER)
        console.log('tx', await tx.wait())
        setTransactionDialogVisibility(false)
        setTransactionState(TransactionState.START)
        const close = await getUserOpenLimitOrders(storageAddress, true)
        updateSuccessDialog(TransactionAction.CANCEL_LIMIT_ORDER)
        setSuccessSnackbarInfo({
          snackbarVisibility: true,
          title: 'Cancel Limit order',
          content: `Limit order canceled successfully`,
        })
        console.log('close tx', close)
      } catch (e: any) {
        if (e.reason.includes('LIMIT_TIMELOCK')) {
          updateError(
            TransactionAction.CANCEL_LIMIT_ORDER,
            'Newly created orders cannot be canceled immediately, you need to wait for 30 blocks before canceling.'
          )
        } else {
          updateError(TransactionAction.CANCEL_LIMIT_ORDER)
        }

        console.error(JSON.stringify(e))
      }
    },
    [contract, tradingAddress, storageAddress]
  )
}
