import { useTradingV6Contract } from './useContract'
import { useUpdateError } from './useUpdateError'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'
import { useRootStore } from '../../store/root'
import { useCallback } from 'react'
import { getGasLimit } from '../../utils'
import BigNumber from 'bignumber.js'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'

export const useClaimPendingOrder = (tradingAddress: string) => {
  const contract = useTradingV6Contract(tradingAddress)!
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  const setTransactionState = useRootStore((store) => store.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((store) => store.setSuccessSnackbarInfo)
  return useCallback(
    async (orderId: BigNumber, isClosePosition: boolean) => {
      try {
        const params = [orderId.toNumber()] as any
        let gasLimit = await getGasLimit(
          contract,
          isClosePosition ? 'closeTradeMarketTimeout' : 'openTradeMarketTimeout',
          params
        )
        gasLimit = new BigNumber(gasLimit.toString()).times(1.1)
        setTransactionState(TransactionState.INTERACTION)
        setTransactionDialogVisibility(true)
        let tx: any
        if (isClosePosition) {
          tx = await contract.closeTradeMarketTimeout(...params, { gasLimit: gasLimit.toFixed(0) })
        } else tx = await contract.openTradeMarketTimeout(...params, { gasLimit: gasLimit.toFixed(0) })

        setTransactionState(TransactionState.CLAIM_ORDER)
        const closeTradeMarketTX = await tx.wait()
        console.log('tx', closeTradeMarketTX)
        setTransactionDialogVisibility(false)
        setTransactionState(TransactionState.START)
        updateSuccessDialog(TransactionAction.CLAIM_ORDER)
        setSuccessSnackbarInfo({
          snackbarVisibility: true,
          title: 'Claim position',
          content: `Claim position successfully`,
        })
      } catch (e) {
        updateError(TransactionAction.CLAIM_ORDER)
      }
    },
    [tradingAddress]
  )
}
