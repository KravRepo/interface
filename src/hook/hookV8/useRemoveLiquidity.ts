import { useTradingVaultContract } from './useContract'
import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useUpdateError } from './useUpdateError'
import { useRootStore } from '../../store/root'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { eXDecimals } from '../../utils/math'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'

export const useRemoveLiquidity = (vaultAddress: string) => {
  const setTransactionState = useRootStore((state) => state.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((state) => state.setSuccessSnackbarInfo)
  const trading_vault_contract = useTradingVaultContract(vaultAddress)!
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  return useCallback(
    async (amount: BigNumber, symbol: string, decimals: number) => {
      try {
        setTransactionState(TransactionState.INTERACTION)
        setTransactionDialogVisibility(true)
        //TODO Only ethereum use withdraw other use withdrawDai
        const tx = await trading_vault_contract.withdraw(amount.toString())
        setTransactionState(TransactionState.REMOVE_LIQUIDITY)
        await tx.wait()
        setTransactionState(TransactionState.START)
        setTransactionDialogVisibility(false)
        updateSuccessDialog(TransactionAction.REMOVE_LIQUIDITY)
        setSuccessSnackbarInfo({
          snackbarVisibility: true,
          title: 'Withdraw',
          content: `Your ${eXDecimals(amount, decimals).toFixed(2)} ${symbol} has been withdraw successfully`,
        })
      } catch (e) {
        setTransactionDialogVisibility(false)
        setTransactionState(TransactionState.START)
        updateError(TransactionAction.REMOVE_LIQUIDITY)
        console.log('deposit failed!', e)
      }
    },
    [vaultAddress]
  )
}
