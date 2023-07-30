import { Contract, ethers } from 'ethers'
import { KRAV_ADDRESS, KRAV_STAKE, TEST_RPC_NODE } from '../../constant/chain'
import { JsonRpcProvider } from '@ethersproject/providers'
import krav_stake from '../../abi/krav_stake.json'
import test_erc20 from '../../abi/test_erc20.json'
import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useContract } from './useContract'
import { useUpdateError } from './useUpdateError'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'
import { useRootStore } from '../../store/root'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { MAX_UNIT_256 } from '../../constant/math'

export const useGetKravStake = () => {
  const { account, provider } = useWeb3React()
  const providerRpc = new ethers.providers.JsonRpcProvider(TEST_RPC_NODE) as JsonRpcProvider
  const stakeContract = new Contract(KRAV_STAKE, krav_stake, providerRpc)
  const stakeContractWithProvider = useContract(KRAV_STAKE, krav_stake)
  const kravContract = useContract(KRAV_ADDRESS, test_erc20.abi)
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  const setTransactionState = useRootStore((store) => store.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((state) => state.setSuccessSnackbarInfo)

  const getTotalStake = useCallback(async () => {
    const totalStake = await stakeContract.totalSupply()
    return new BigNumber(totalStake._hex)
  }, [provider, stakeContract])

  const getUserStake = useCallback(async () => {
    const userBalance = await stakeContract.balanceOf(account)
    return new BigNumber(userBalance._hex)
  }, [account, stakeContract])

  const getUserReward = useCallback(async () => {
    const stakeContractWithProvider = new Contract(KRAV_STAKE, krav_stake, provider)
    if (stakeContractWithProvider) {
      const userReward = await stakeContractWithProvider.rewards(account)
      return new BigNumber(userReward._hex)
    } else return new BigNumber(0)
  }, [account, provider])

  const getUserKRAVBalance = useCallback(async () => {
    if (kravContract) {
      const userReward = await kravContract.balanceOf(account)
      return new BigNumber(userReward._hex)
    } else return new BigNumber(0)
  }, [account, kravContract])

  const stakeKrav = useCallback(
    async (amount: BigNumber) => {
      if (account && kravContract && provider && stakeContractWithProvider) {
        try {
          console.log('amount', amount.toString())
          setTransactionState(TransactionState.INTERACTION)
          setTransactionDialogVisibility(true)
          const allowance = await kravContract.allowance(account, KRAV_STAKE)
          const allowanceAmount = new BigNumber(allowance.toString())
          if (allowanceAmount.isLessThan(amount)) {
            setTransactionState(TransactionState.APPROVE)
            setTransactionDialogVisibility(true)
            const tx = await kravContract.approve(KRAV_STAKE, MAX_UNIT_256)
            await tx.wait()
            setTransactionState(TransactionState.INTERACTION)
          }
          const stake = await stakeContractWithProvider.stake(amount.toString())
          setTransactionState(TransactionState.STAKE_KRAV)
          await stake.wait()
          setTransactionDialogVisibility(false)
          setTransactionState(TransactionState.START)
          updateSuccessDialog(TransactionAction.STAKE_KRAV)
          setSuccessSnackbarInfo({
            snackbarVisibility: true,
            title: 'Stake KRAV',
            content: 'Stake successfully',
          })
        } catch (e) {
          updateError(TransactionAction.STAKE_KRAV)
          console.error(e)
        }
      }
    },
    [account, kravContract, provider, stakeContractWithProvider]
  )

  const withdrawKrav = useCallback(
    async (amount: BigNumber) => {
      if (account && provider && stakeContractWithProvider) {
        try {
          setTransactionState(TransactionState.INTERACTION)
          setTransactionDialogVisibility(true)
          const withdraw = await stakeContractWithProvider.withdraw(amount.toString())
          setTransactionState(TransactionState.WITHDRAW_KRAV)
          await withdraw.wait()
          setTransactionState(TransactionState.START)
          updateSuccessDialog(TransactionAction.WITHDRAW_KRAV)
          setSuccessSnackbarInfo({
            snackbarVisibility: true,
            title: 'Withdraw KRAV',
            content: 'Withdraw successfully',
          })
        } catch (e) {
          updateError(TransactionAction.WITHDRAW_KRAV)
          console.error(e)
        }
      }
    },
    [account, provider, stakeContractWithProvider]
  )

  const claimReward = useCallback(async () => {
    if (account && provider && stakeContractWithProvider) {
      try {
        setTransactionState(TransactionState.INTERACTION)
        setTransactionDialogVisibility(true)
        const claim = await stakeContractWithProvider.claimReward()
        setTransactionState(TransactionState.CLAIM_KRAV_REWARD)
        await claim.wait()
        setTransactionState(TransactionState.START)
        updateSuccessDialog(TransactionAction.CLAIM_KRAV_REWARD)
        setSuccessSnackbarInfo({
          snackbarVisibility: true,
          title: 'Claim KRAV reward',
          content: 'Claim successfully',
        })
      } catch (e) {
        updateError(TransactionAction.CLAIM_KRAV_REWARD)
      }
    }
  }, [account, provider, stakeContractWithProvider])

  return {
    getTotalStake: getTotalStake,
    getUserStake: getUserStake,
    getUserReward: getUserReward,
    stakeKrav: stakeKrav,
    withdrawKrav: withdrawKrav,
    claimReward: claimReward,
    getUserKRAVBalance: getUserKRAVBalance,
  }
}
