import { useWeb3React } from '@web3-react/core'
import { useContract, useTokenContract } from './useContract'
import voting from '../../abi/voting_escrow.json'
import { useUpdateError } from './useUpdateError'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'
import { useRootStore } from '../../store/root'
import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { MAX_UNIT_256 } from '../../constant/math'
import { getGasLimit } from '../../utils'
import { eXDecimals } from '../../utils/math'
import { useConfig } from './useConfig'

export const useAddLockAmount = () => {
  const { provider, account } = useWeb3React()
  const config = useConfig()
  const veContract = useContract(config?.veKrav, voting.abi)
  const kravTokenContract = useTokenContract(config?.kravAddress)
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  const setTransactionState = useRootStore((store) => store.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((state) => state.setSuccessSnackbarInfo)
  return useCallback(
    async (lockAmount: BigNumber, showSuccess = true) => {
      if (provider && veContract && kravTokenContract && account && config) {
        try {
          setTransactionState(TransactionState.CHECK_APPROVE)
          setTransactionDialogVisibility(true)
          const allowance = await kravTokenContract.allowance(account, config.veKrav)

          if (lockAmount.isGreaterThan(new BigNumber(allowance._hex))) {
            setTransactionState(TransactionState.APPROVE)
            const approveTX = await kravTokenContract.approve(config.veKrav, MAX_UNIT_256)
            await approveTX.wait()
          }
          setTransactionState(TransactionState.INTERACTION)
          setTransactionDialogVisibility(true)
          const params = [lockAmount.toString()] as any

          let gasLimit = await getGasLimit(veContract, 'increase_amount', params)
          gasLimit = new BigNumber(gasLimit.toString()).times(1.1)

          const tx = await veContract.increase_amount(...params, { gasLimit: gasLimit.toFixed(0) })
          setTransactionState(TransactionState.INCREASE_AMOUNT)
          console.log('tx', await tx.wait())
          if (showSuccess) {
            setTransactionState(TransactionState.START)
            updateSuccessDialog(TransactionAction.INCREASE_AMOUNT)
            setSuccessSnackbarInfo({
              snackbarVisibility: true,
              title: 'Increase Lock Krav',
              content: `Your increase ${eXDecimals(lockAmount, 18).toFixed(2)} Krav has been locked successfully`,
            })
          }
        } catch (e) {
          setTransactionDialogVisibility(false)
          setTransactionState(TransactionState.START)
          updateError(TransactionAction.INCREASE_AMOUNT)
          console.error('deposit failed!', e)
        }
      }
    },
    [provider, veContract, kravTokenContract, account, config]
  )
}
