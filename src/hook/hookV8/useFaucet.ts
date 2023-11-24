import { useCallback, useMemo } from 'react'
import { useGetUserAllBalance } from './useGetBalance'
import { Contract } from 'ethers'
import test_erc20 from '../../abi/test_erc20.json'
import { useWeb3React } from '@web3-react/core'
import { getProviderOrSigner } from '../../utils'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { useRootStore } from '../../store/root'
import { useUpdateError } from './useUpdateError'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'
import { ChainId } from '../../constant/chain'

export const useFaucet = () => {
  const { account, provider, chainId } = useWeb3React()
  const getBalance = useGetUserAllBalance()
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  const setTransactionState = useRootStore((store) => store.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const testTokenAddress = useMemo(() => {
    switch (chainId) {
      case ChainId.BSC_TEST:
        return '0xe92C6f77C00B31B808641f498BB42f6951a47297'
      case ChainId.ARB_TEST:
        return '0x0A9475f047DFc96E23343F01eeBbce56497f7520'
      case ChainId.MUMBAI_TEST:
        return '0x17a26d994800Faf302CE033B4d49B2FD12bE669b'
      case ChainId.POLYGON_ZKEVM_TEST:
        return '0x9daCd4B76b748674a46f8554c8b56bb10A95ef04'
      default:
        return '0x0A9475f047DFc96E23343F01eeBbce56497f7520'
    }
  }, [chainId])

  return useCallback(async () => {
    try {
      setTransactionState(TransactionState.INTERACTION)
      setTransactionDialogVisibility(true)
      const tokenContract = new Contract(testTokenAddress, test_erc20.abi, getProviderOrSigner(provider!, account))
      const faucetTx = await tokenContract.mint('500000000000000000000000', account)
      setTransactionState(TransactionState.FAUCET_TEST_TOKEN)
      await faucetTx.wait()
      updateSuccessDialog(TransactionAction.FAUCET_TEST_TOKEN)
      console.log('faucetTx', faucetTx)
      await getBalance()
    } catch (e) {
      console.error('faucet failed!', e)
      updateError(TransactionAction.FAUCET_TEST_TOKEN)
    }
  }, [account, provider])
}
