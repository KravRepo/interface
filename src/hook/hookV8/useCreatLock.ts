import { useWeb3React } from '@web3-react/core'
import { useContract, useTokenContract } from './useContract'
import voting from '../../abi/voting_escrow.json'
import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { getGasLimit } from '../../utils'
import { useUpdateError } from './useUpdateError'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'
import { useRootStore } from '../../store/root'
import { MAX_UNIT_256, ONE_DAY_TIMESTAMP } from '../../constant/math'
import { eXDecimals } from '../../utils/math'
import { getLockTime } from './utils/utils'
import { useConfig } from './useConfig'

export const useCreatLock = () => {
  const { provider } = useWeb3React()
  const config = useConfig()
  const veContract = useContract(config?.veKrav, voting.abi)
  const kravTokenContract = useTokenContract(config?.kravAddress)
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  const setTransactionState = useRootStore((store) => store.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((state) => state.setSuccessSnackbarInfo)
  return useCallback(
    async (lockAmount: BigNumber, lockTime: number) => {
      if (provider && veContract && kravTokenContract && config) {
        try {
          const nowTimestamp = (Math.floor(new Date().getTime() / ONE_DAY_TIMESTAMP) * ONE_DAY_TIMESTAMP) / 1000
          const forMatterLockTime = getLockTime(lockTime)
          setTransactionState(TransactionState.CHECK_APPROVE)
          setTransactionDialogVisibility(true)
          // TODO: to fix get allowance failed
          // console.log('kravTokenContract', kravTokenContract)
          // console.log('lockAmount', lockAmount.toString())
          // const decimals = await kravTokenContract.decimals()
          // console.log('decimals', decimals)
          // const allowance = await kravTokenContract.allowance(account,VE_KRAV)
          // console.log('allowance', new BigNumber(allowance._hex).toString())
          //
          // if (lockAmount.isGreaterThan(new BigNumber(allowance._hex))) {
          //   setTransactionState(TransactionState.APPROVE)
          //   console.log('2 approve', lockAmount.toString())
          //   const approveTX = await kravTokenContract.approve(VE_KRAV, MAX_UNIT_256)
          //   await approveTX.wait()
          //   console.log('3 approveTX', approveTX)
          // }
          setTransactionState(TransactionState.APPROVE)
          console.log('2 approve', lockAmount.toString())
          const approveTX = await kravTokenContract.approve(config.veKrav, MAX_UNIT_256)
          await approveTX.wait()
          console.log('3 approveTX', approveTX)
          setTransactionState(TransactionState.INTERACTION)
          setTransactionDialogVisibility(true)
          const params = [lockAmount.toString(), forMatterLockTime / 1000 + nowTimestamp] as any
          let gasLimit = await getGasLimit(veContract, 'create_lock', params)

          gasLimit = new BigNumber(gasLimit.toString()).times(1.1)
          console.log('gasLimit', gasLimit.toFixed(0))
          const tx = await veContract.create_lock(...params, { gasLimit: gasLimit.toFixed(0) })
          setTransactionState(TransactionState.LOCK_KRAV)
          console.log('tx', await tx.wait())
          setTransactionState(TransactionState.START)
          updateSuccessDialog(TransactionAction.LOCK_KRAV)
          setSuccessSnackbarInfo({
            snackbarVisibility: true,
            title: 'Lock',
            content: `Your ${eXDecimals(lockAmount, 18).toFixed(2)} Krav has been locked successfully`,
          })
        } catch (e) {
          setTransactionDialogVisibility(false)
          setTransactionState(TransactionState.START)
          updateError(TransactionAction.LOCK_KRAV)
          console.error('deposit failed!', e)
        }
      }
    },
    [provider, veContract, config, kravTokenContract]
  )
}
