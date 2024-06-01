import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useUpdateError } from './useUpdateError'
import { useRootStore } from '../../store/root'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { eXDecimals } from '../../utils/math'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'ethers'
import k_token from '../../abi/k_token.json'
import { getProviderOrSigner } from '../../utils'

export const useRemoveLiquidity = (vaultAddress: string) => {
  const { chainId, provider, account } = useWeb3React()
  const setTransactionState = useRootStore((state) => state.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((state) => state.setSuccessSnackbarInfo)
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  return useCallback(
    async (amount: BigNumber, symbol: string, decimals: number) => {
      try {
        const kTokenContract = new Contract(vaultAddress, k_token.abi, getProviderOrSigner(provider!, account))

        setTransactionState(TransactionState.INTERACTION)
        setTransactionDialogVisibility(true)
        const tx = await kTokenContract['makeWithdrawRequest'](amount.toString())
        setTransactionState(TransactionState.REMOVE_LIQUIDITY)
        await tx.wait()
        setTransactionState(TransactionState.START)
        setTransactionDialogVisibility(false)
        updateSuccessDialog(TransactionAction.REMOVE_LIQUIDITY)
        setSuccessSnackbarInfo({
          snackbarVisibility: true,
          title: 'Withdraw',
          content: `Your ${eXDecimals(amount, decimals).toFixed(2)} ${symbol} request has been sent`,
        })
      } catch (e) {
        setTransactionDialogVisibility(false)
        setTransactionState(TransactionState.START)
        updateError(TransactionAction.REMOVE_LIQUIDITY)
        console.log('remove request failed!', e)
      }
    },
    [vaultAddress, chainId]
  )
}

export const useRedeemLiquidity = (vaultAddress: string) => {
  const { chainId, provider, account } = useWeb3React()
  const setTransactionState = useRootStore((state) => state.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((state) => state.setSuccessSnackbarInfo)
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  return useCallback(
    async (shares: string, amount: BigNumber, decimals?: number, symbol?: string) => {
      try {
        const kTokenContract = new Contract(vaultAddress, k_token.abi, getProviderOrSigner(provider!, account))

        setTransactionState(TransactionState.INTERACTION)
        setTransactionDialogVisibility(true)
        const tx = await kTokenContract['redeem'](shares, account, account)
        setTransactionState(TransactionState.REDEEM_LIQUIDITY)
        await tx.wait()
        setTransactionState(TransactionState.START)
        setTransactionDialogVisibility(false)
        updateSuccessDialog(TransactionAction.REDEEM_LIQUIDITY)
        setSuccessSnackbarInfo({
          snackbarVisibility: true,
          title: 'Claim Liquidity',
          content: `Your ${eXDecimals(amount, decimals ?? 18).toFixed(2)} ${symbol} has been claimed`,
        })
      } catch (e) {
        setTransactionDialogVisibility(false)
        setTransactionState(TransactionState.START)
        updateError(TransactionAction.REMOVE_LIQUIDITY)
        console.log('redeem liquidity request failed!', e)
      }
    },
    [vaultAddress, chainId]
  )
}
