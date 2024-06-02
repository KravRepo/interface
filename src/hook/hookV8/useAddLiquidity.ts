import { useTokenContract } from './useContract'
import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { MAX_UNIT_256, VALIDITY_ADDRESS_LENGTH } from '../../constant/math'
import { Contract } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { getProviderOrSigner } from '../../utils'
import { useUpdateError } from './useUpdateError'
import { useRootStore } from '../../store/root'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { eXDecimals } from '../../utils/math'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'
import k_token from '../../abi/k_token.json'

export const useAddLiquidity = (tokenAddress: string) => {
  const { provider, account, chainId } = useWeb3React()
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
          console.log('tokenAddress', tokenAddress)
          console.log('vaultAddress', vaultAddress)
// const krav = await ethers.getContractAt(`KToken`, tokenAddress)
// await (await krav.approve(vaultAddress, ethers.constants.MaxUint256)).wait()
// const kToken = await ethers.getContractAt(`KToken`, vaultAddress)
// await kToken.deposit(ethers.utils.parseEther(`1`), account)          
        
          const contractA = new Contract(tokenAddress, k_token.abi, getProviderOrSigner(provider!, account))
          setTransactionState(TransactionState.CHECK_APPROVE)
          setTransactionDialogVisibility(true)

          // const allowance = await kTokenContract.allowance(account, vaultAddress)
          // if (amount.isGreaterThan(new BigNumber(allowance._hex))) {
          //   setTransactionState(TransactionState.APPROVE)
          //   const approveTX = await kTokenContract.approve(vaultAddress, MAX_UNIT_256)
          //   await approveTX.wait()
          // }

          setTransactionState(TransactionState.APPROVE)
          const approveTx = await contractA.approve(vaultAddress, MAX_UNIT_256)
          await approveTx.wait()
          
          const contractB = new Contract(vaultAddress, k_token.abi, getProviderOrSigner(provider!, account))
          setTransactionState(TransactionState.INTERACTION)
          const tx = await contractB.deposit(amount.toString(), account)
      
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
    [tokenAddress, provider, chainId]
  )
}
