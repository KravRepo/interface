import { useFactoryWithProvider } from './useContract'
import { useCallback } from 'react'
import { CONTRACT_CONFIG, NODE_ADDRESS } from '../../constant/chain'
// import { getGasLimit } from '../../utils'
import BigNumber from 'bignumber.js'
import { useUpdateError } from './useUpdateError'
import { useRootStore } from '../../store/root'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { Contract } from 'ethers'
import test_erc20 from '../../abi/test_erc20.json'
import { useWeb3React } from '@web3-react/core'
import { MAX_UNIT_256 } from '../../constant/math'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'
import { getProviderOrSigner } from '../../utils'

export const useCreatePool = () => {
  const { provider, account, chainId } = useWeb3React()
  const factory = useFactoryWithProvider(provider)!
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  const setTransactionState = useRootStore((state) => state.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)

  return useCallback(
    async (tokenAddress: string, proportionBTC: number | string, depositAmount: BigNumber) => {
      if (provider && account && chainId) {
        // const params = [
        //   tokenAddress,
        //   CONTRACT_CONFIG[chainId].linkAddress,
        //   CONTRACT_CONFIG[chainId].nodeAddress,
        //   proportionBTC,
        //   depositAmount.toString(),
        // ] as any
        try {
          console.log('linkAddress', CONTRACT_CONFIG[chainId].linkAddress)
          console.log('nodeAddress', CONTRACT_CONFIG[chainId].nodeAddress)
          console.log('proportionBTC', proportionBTC)
          console.log('depositAmount', depositAmount.toString())
          setTransactionDialogVisibility(true)
          setTransactionState(TransactionState.APPROVE)
          const tokenContract = new Contract(tokenAddress, test_erc20.abi, getProviderOrSigner(provider, account))
          const approve = await tokenContract.approve(CONTRACT_CONFIG[chainId].factory, MAX_UNIT_256)
          await approve.wait()
          setTransactionState(TransactionState.INTERACTION)
          console.log('factory', CONTRACT_CONFIG[chainId].factory)
          // let gasLimit = await getGasLimit(factory, 'createQuanto', params)
          // gasLimit = new BigNumber(gasLimit.toString()).times(1.6)
          // const tx = await factory.createQuanto(...params, { gasLimit: gasLimit.toFixed(0) })
          console.log('node', ...NODE_ADDRESS)
          const tx = await factory.createQuanto(
            tokenAddress,
            CONTRACT_CONFIG[chainId].linkAddress,
            CONTRACT_CONFIG[chainId].nodeAddress,
            proportionBTC,
            depositAmount.toString()
            // {
            //   gasLimit: gasLimit.toFixed(0),
            // }
          )
          setTransactionState(TransactionState.CREAT_POOL)
          await tx.wait()
          updateSuccessDialog(TransactionAction.CREATE)
          console.log('tx', tx)
        } catch (e) {
          setTransactionDialogVisibility(false)
          setTransactionState(TransactionState.START)
          updateError(TransactionAction.CREATE)
          console.error('create pool failed!', e)
        }
      }
    },
    [factory, provider, account, chainId]
  )
}
