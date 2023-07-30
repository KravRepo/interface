import { useRootStore } from '../../store/root'
import { useCallback } from 'react'
import { TransactionAction } from '../../store/TransactionSlice'

export const useUpdateSuccessDialog = () => {
  const setSuccessContent = useRootStore((store) => store.setSuccessContent)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  return useCallback((action: TransactionAction) => {
    setTransactionDialogVisibility(false)
    const successContent = {
      dialogVisibility: true,
      action: action,
    }
    setSuccessContent(successContent)
  }, [])
}
