import { useCallback } from 'react'
import { useRootStore } from '../../store/root'
import { TransactionAction } from '../../store/TransactionSlice'

export const useUpdateError = () => {
  const setErrorContent = useRootStore((store) => store.setErrorContent)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  return useCallback((action: TransactionAction, reason?: string) => {
    setTransactionDialogVisibility(false)
    const errorContent = {
      dialogVisibility: true,
      action: action,
      reason: reason,
    }
    setErrorContent(errorContent)
  }, [])
}
