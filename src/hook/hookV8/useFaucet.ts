import { useCallback } from 'react'
import { useGetUserAllBalance } from './useGetBalance'
import { Contract } from 'ethers'
import test_erc20 from 'abi/test_erc20.json'
import { useWeb3React } from '@web3-react/core'
import { getProviderOrSigner } from '../../utils'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { useRootStore } from '../../store/root'
import { useUpdateError } from './useUpdateError'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'

export const useFaucet = () => {
  const { account, provider } = useWeb3React()
  const getBalance = useGetUserAllBalance()
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  const setTransactionState = useRootStore((store) => store.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  return useCallback(
    async (tokenAddress: string) => {
      try {
        setTransactionState(TransactionState.INTERACTION)
        setTransactionDialogVisibility(true)
        const tokenContract = new Contract(tokenAddress, test_erc20.abi, getProviderOrSigner(provider!, account))
        const faucetTx = await tokenContract.mint('10000000000000000000000', account)
        setTransactionState(TransactionState.FAUCET_TEST_TOKEN)
        await faucetTx.wait()
        updateSuccessDialog(TransactionAction.FAUCET_TEST_TOKEN)
        console.log('faucetTx', faucetTx)
        await getBalance()
      } catch (e) {
        console.error('faucet failed!', e)
        updateError(TransactionAction.FAUCET_TEST_TOKEN)
      }
    },
    [account, provider]
  )
}
