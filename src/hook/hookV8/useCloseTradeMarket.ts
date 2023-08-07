import { useTradingV6Contract } from './useContract'
import { useCallback } from 'react'
import { getGasLimit } from '../../utils'
import BigNumber from 'bignumber.js'
import { useGetUserOpenTrade } from './useGetUserOpenTrade'
import { useUpdateError } from './useUpdateError'
import { useRootStore } from '../../store/root'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'

export const useCloseTradeMarket = (tradingAddress: string, storageAddress: string) => {
  const contract = useTradingV6Contract(tradingAddress)!
  const { getUserOpenTrade } = useGetUserOpenTrade()
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  const setTransactionState = useRootStore((store) => store.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((store) => store.setSuccessSnackbarInfo)
  return useCallback(
    async (orderIndex: number, pairIndex = 0) => {
      try {
        const params = [pairIndex, orderIndex] as any
        let gasLimit = await getGasLimit(contract, 'closeTradeMarket', params)
        gasLimit = new BigNumber(gasLimit.toString()).times(1.1)
        setTransactionState(TransactionState.INTERACTION)
        setTransactionDialogVisibility(true)
        const tx = await contract.closeTradeMarket(...params, { gasLimit: gasLimit.toFixed(0) })
        setTransactionState(TransactionState.CANCEL_MARKET_ORDER)
        const closeTradeMarketTX = await tx.wait()
        console.log('tx', closeTradeMarketTX)
        setTransactionDialogVisibility(false)
        setTransactionState(TransactionState.START)
        const close = await getUserOpenTrade(storageAddress, true)
        updateSuccessDialog(TransactionAction.CANCEL_MARKET_ORDER)
        setSuccessSnackbarInfo({
          snackbarVisibility: true,
          title: 'Close Market Order',
          content: `Market order closed successfully`,
        })
        console.log('close tx ', close)
      } catch (e) {
        updateError(TransactionAction.CANCEL_MARKET_ORDER)
      }
    },
    [contract, tradingAddress, storageAddress]
  )
}

export const useUpdateTradeMarket = (tradingAddress: string, storageAddress: string) => {
  const contract = useTradingV6Contract(tradingAddress)!
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  const setTransactionState = useRootStore((store) => store.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((store) => store.setSuccessSnackbarInfo)
  return useCallback(
    async (isSL: boolean, price: BigNumber, orderIndex: number, pairIndex = 0) => {
      try {
        const func = isSL ? 'updateSl' : 'updateTp'
        const params = [pairIndex, orderIndex, price.times(Number(1e10)).toString()] as any
        let gasLimit = await getGasLimit(contract, func, params)
        gasLimit = new BigNumber(gasLimit.toString()).times(1.1)
        setTransactionState(TransactionState.INTERACTION)
        setTransactionDialogVisibility(true)
        const tx = await contract[func](...params, { gasLimit: gasLimit.toFixed(0) })
        setTransactionState(isSL ? TransactionState.UPDATE_SL_ORDER : TransactionState.UPDATE_TP_ORDER)
        const closeTradeMarketTX = await tx.wait()
        console.log('tx', closeTradeMarketTX)
        setTransactionDialogVisibility(false)
        setTransactionState(TransactionState.START)
        updateSuccessDialog(isSL ? TransactionAction.UPDATE_SL_ORDER : TransactionAction.UPDATE_TP_ORDER)
        setSuccessSnackbarInfo({
          snackbarVisibility: true,
          title: isSL ? 'Stop loss trade updated' : 'Take profit trade updated',
          content: `${isSL ? 'Stop loss trade updated' : 'Take profit trade updated'} successfully`,
        })
      } catch (e) {
        console.error(e)

        updateError(isSL ? TransactionAction.UPDATE_SL_ORDER : TransactionAction.UPDATE_TP_ORDER)
      }
    },
    [contract, tradingAddress, storageAddress]
  )
}
