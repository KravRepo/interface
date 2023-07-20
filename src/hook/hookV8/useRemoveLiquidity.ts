import { useTradingVaultContract } from './useContract'
import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useUpdateError } from './useUpdateError'
import { useRootStore } from '../../store/root'
import { TransactionState } from '../../store/TransactionSlice'

export const useRemoveLiquidity = (vaultAddress: string) => {
  const setTransactionState = useRootStore((state) => state.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const trading_vault_contract = useTradingVaultContract(vaultAddress)!
  const updateError = useUpdateError()
  return useCallback(
    async (amount: BigNumber) => {
      try {
        setTransactionDialogVisibility(true)
        setTransactionState(TransactionState.REMOVE_LIQUIDITY)
        const tx = await trading_vault_contract.withdrawDai(amount.toString())
        setTransactionState(TransactionState.START)
        setTransactionDialogVisibility(false)
        console.log('tx', tx)
      } catch (e) {
        setTransactionDialogVisibility(false)
        setTransactionState(TransactionState.START)
        updateError(e)
        console.log('deposit failed!', e)
      }
    },
    [vaultAddress]
  )
}
