import { useWeb3React } from '@web3-react/core'
import { useContract } from './useContract'
import fees_manager from '../../abi/fee_distributor_manager.json'
import { useCallback } from 'react'
import { useUpdateError } from './useUpdateError'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'
import { useRootStore } from '../../store/root'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { getGasLimit } from '../../utils'
import BigNumber from 'bignumber.js'
import { FeesRewardList } from './useGetClaimableTokensFee'
import { useConfig } from './useConfig'

export const useClaimFeesReward = () => {
  const { account, provider } = useWeb3React()
  const config = useConfig()
  const feesDistributorContract = useContract(config?.feeDistrbutor, fees_manager.abi)
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  const setTransactionState = useRootStore((store) => store.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((state) => state.setSuccessSnackbarInfo)
  return useCallback(
    async (feesRewardList: FeesRewardList[]) => {
      if (account && provider && feesDistributorContract) {
        try {
          const addList = feesRewardList.map((list) => {
            return list.pool.tokenT
          })
          const params = [account, addList] as any
          setTransactionState(TransactionState.INTERACTION)
          setTransactionDialogVisibility(true)
          let gasLimit = await getGasLimit(feesDistributorContract, 'claim', params)
          gasLimit = new BigNumber(gasLimit.toString()).times(1.1)
          const tx = await feesDistributorContract.claim(...params, { gasLimit: gasLimit.toFixed(0) })
          setTransactionState(TransactionState.PENDING)
          await tx.wait()
          setTransactionDialogVisibility(false)
          setTransactionState(TransactionState.START)
          updateSuccessDialog(TransactionAction.CLAIM_LOCK_REWARD)
          setSuccessSnackbarInfo({
            snackbarVisibility: true,
            title: 'Claim reward',
            content: 'Your locked reward has been claimed successfully',
          })
        } catch (e) {
          updateError(TransactionAction.CLAIM_LOCK_REWARD)
          console.error('Open Trade failed!', e)
        }
      }
    },
    [account, provider, feesDistributorContract]
  )
}
