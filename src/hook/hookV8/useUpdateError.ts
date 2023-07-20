import { useCallback } from 'react'
import { useRootStore } from '../../store/root'

export const useUpdateError = () => {
  const setErrorContent = useRootStore((store) => store.setErrorContent)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  return useCallback((error: any) => {
    setTransactionDialogVisibility(false)
    const errorContent = {
      dialogVisibility: true,
      error: JSON.stringify(error).toString(),
    }
    setErrorContent(errorContent)
  }, [])
}
