import { useWeb3React } from '@web3-react/core'
import { useContract } from './useContract'
import voting from '../../abi/voting_escrow.json'
import { useUpdateError } from './useUpdateError'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'
import { useRootStore } from '../../store/root'
import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { getGasLimit } from '../../utils'
import { getLockTime } from './utils/utils'
import { useConfig } from './useConfig'

export const useAddUnlockTime = () => {
  const { provider } = useWeb3React()
  const config = useConfig()
  const veContract = useContract(config?.veKrav, voting.abi)
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  const setTransactionState = useRootStore((store) => store.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((state) => state.setSuccessSnackbarInfo)
  return useCallback(
    async (lockTime: number) => {
      if (provider && veContract) {
        try {
          const nowTimestamp = Number((new Date().getTime() / 1000).toFixed(0))
          const forMatterTime = getLockTime(lockTime) / 1000
          setTransactionState(TransactionState.INTERACTION)
          setTransactionDialogVisibility(true)
          const params = [nowTimestamp + forMatterTime] as any

          let gasLimit = await getGasLimit(veContract, 'increase_unlock_time', params)
          gasLimit = new BigNumber(gasLimit.toString()).times(1.1)

          const tx = await veContract.increase_unlock_time(...params, { gasLimit: gasLimit.toFixed(0) })
          setTransactionState(TransactionState.INCREASE_UNLOCK_TIME)
          console.log('tx', await tx.wait())
          setTransactionState(TransactionState.START)
          updateSuccessDialog(TransactionAction.INCREASE_UNLOCK_TIME)
          setSuccessSnackbarInfo({
            snackbarVisibility: true,
            title: 'Increase unlock time',
            content: `Your Krav position unlock time has been updated successfully`,
          })
        } catch (e) {
          setTransactionDialogVisibility(false)
          setTransactionState(TransactionState.START)
          updateError(TransactionAction.INCREASE_UNLOCK_TIME)
          console.error('deposit failed!', e)
        }
      }
    },
    [provider, veContract]
  )
}
