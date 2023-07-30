import { useWeb3React } from '@web3-react/core'
import { useContract } from './useContract'
import trading_vault from '../../abi/trading_vault_v5.json'
import { useCallback } from 'react'
import { useUpdateError } from './useUpdateError'
import { useRootStore } from '../../store/root'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import BigNumber from 'bignumber.js'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'

export const useHarvestLpReward = (vaultAddress: string) => {
  const { account } = useWeb3React()
  const vaultContract = useContract(vaultAddress, trading_vault.abi)
  const setTransactionState = useRootStore((store) => store.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((store) => store.setSuccessSnackbarInfo)
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  return useCallback(
    async (amount: BigNumber, symbol: string) => {
      try {
        if (vaultContract) {
          setTransactionState(TransactionState.INTERACTION)
          setTransactionDialogVisibility(true)
          const tx = await vaultContract.harvest()
          setTransactionState(TransactionState.CLAIM_LP_REWARD)
          await tx.wait()
          setTransactionDialogVisibility(false)
          setTransactionState(TransactionState.START)
          updateSuccessDialog(TransactionAction.CLAIM_LP_REWARD)
          setSuccessSnackbarInfo({
            snackbarVisibility: true,
            title: 'Claim',
            content: `Your Claim ${amount.toFixed(2)} ${symbol} successfully`,
          })
        }
      } catch (e) {
        updateError(TransactionAction.CLAIM_LP_REWARD)
      }
    },
    [account, vaultContract]
  )
}
