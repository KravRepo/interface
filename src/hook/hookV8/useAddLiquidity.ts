import { useTokenContract } from './useContract'
import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { MAX_UNIT_256, VALIDITY_ADDRESS_LENGTH } from '../../constant/math'
import { Contract } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import trading_vault from 'abi/trading_vault_v5.json'
import { getProviderOrSigner } from '../../utils'
import { useUpdateError } from './useUpdateError'
import { useRootStore } from '../../store/root'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { eXDecimals } from '../../utils/math'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'

export const useAddLiquidity = (tokenAddress: string) => {
  const { provider, account } = useWeb3React()
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  const tokenContract = useTokenContract(tokenAddress?.length === VALIDITY_ADDRESS_LENGTH ? tokenAddress : '')!
  const setTransactionState = useRootStore((state) => state.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((state) => state.setSuccessSnackbarInfo)
  return useCallback(
    async (amount: BigNumber, vaultAddress: string, symbol: string, decimals: number) => {
      try {
        if (tokenContract) {
          const trading_vault_contract = new Contract(
            vaultAddress,
            trading_vault.abi,
            getProviderOrSigner(provider!, account)
          )
          setTransactionState(TransactionState.CHECK_APPROVE)
          setTransactionDialogVisibility(true)
          const allowance = await tokenContract.allowance(account, vaultAddress)
          console.log('allowance', new BigNumber(allowance._hex).toString())

          if (amount.isGreaterThan(new BigNumber(allowance._hex))) {
            setTransactionState(TransactionState.APPROVE)
            console.log('2 approve', amount.toString())
            const approveTX = await tokenContract.approve(vaultAddress, MAX_UNIT_256)
            await approveTX.wait()
            console.log('3 approveTX', approveTX)
          }
          setTransactionState(TransactionState.INTERACTION)
          const tx = await trading_vault_contract.depositDai(amount.toString())
          setTransactionState(TransactionState.ADD_LIQUIDITY)
          await tx.wait()
          setTransactionDialogVisibility(false)
          setTransactionState(TransactionState.START)
          updateSuccessDialog(TransactionAction.ADD_LIQUIDITY)
          setSuccessSnackbarInfo({
            snackbarVisibility: true,
            title: 'Deposit',
            content: `Your ${eXDecimals(amount, decimals).toFixed(2)} ${symbol} has been deposited successfully`,
          })
          console.log('tx', tx)
        }
      } catch (e) {
        setTransactionDialogVisibility(false)
        setTransactionState(TransactionState.START)
        updateError(TransactionAction.ADD_LIQUIDITY)
        console.error('deposit failed!', e)
      }
    },
    [tokenAddress, provider]
  )
}
