import { useRootStore } from '../../store/root'
import { useContract } from './useContract'
import React, { Dispatch, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import test_erc20 from '../../abi/test_erc20.json'
import { MAX_UNIT_256 } from '../../constant/math'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { useUpdateError } from './useUpdateError'

BigNumber.config({ EXPONENTIAL_AT: 1e9 })

export const useApprove = (tokenAddress: string, tradingAddress: string, storageAddress: string) => {
  const contract = useContract(tokenAddress, test_erc20.abi)!
  const { account } = useWeb3React()
  const setTransactionState = useRootStore((store) => store.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const updateError = useUpdateError()
  const approve = useCallback(
    async (setOpenConfirmDialog: Dispatch<React.SetStateAction<boolean>>, amount: BigNumber) => {
      try {
        setTransactionState(TransactionState.CHECK_APPROVE)
        const allowance = await contract.allowance(account, storageAddress)
        const allowanceAmount = new BigNumber(allowance.toString())
        try {
          if (allowanceAmount.isLessThan(amount)) {
            setTransactionState(TransactionState.APPROVE)
            setTransactionDialogVisibility(true)
            const tx = await contract.approve(storageAddress, MAX_UNIT_256)
            await tx.wait()
            setTransactionDialogVisibility(false)
            setTransactionState(TransactionState.START)
          }
          setOpenConfirmDialog(true)
        } catch (e) {
          updateError(TransactionAction.APPROVE)
        }
      } catch (e) {
        updateError(TransactionAction.APPROVE)
        console.error('approve trading contract or storage contract failed!', e)
        setTransactionState(TransactionState.START)
      }
      setTransactionState(TransactionState.APPROVE_SUCCESS)
    },
    [contract, tokenAddress, tradingAddress, storageAddress]
  )
  return approve
}
