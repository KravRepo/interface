import { useFactoryWithProvider } from './useContract'
import { useCallback } from 'react'
import { LINK_ADDRESS, NODE_ADDRESS } from '../../constant/chain'
import { getGasLimit, getProviderOrSigner } from '../../utils'
import BigNumber from 'bignumber.js'
import { useUpdateError } from './useUpdateError'
import { useRootStore } from '../../store/root'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { Contract } from 'ethers'
import test_erc20 from '../../abi/test_erc20.json'
import krav_factory from '../../abi/krav_factory.json'
import { useWeb3React } from '@web3-react/core'
import { MAX_UNIT_256 } from '../../constant/math'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'

export const useCreatePool = () => {
  const { provider, account } = useWeb3React()
  const factory = useFactoryWithProvider()!
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  const setTransactionState = useRootStore((state) => state.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)

  return useCallback(
    async (tokenAddress: string, proportionBTC: number | string, depositAmount: BigNumber) => {
      const params = [tokenAddress, LINK_ADDRESS, NODE_ADDRESS, proportionBTC, depositAmount.toString()] as any
      if (provider && account) {
        try {
          setTransactionDialogVisibility(true)
          setTransactionState(TransactionState.APPROVE)
          const tokenContract = new Contract(tokenAddress, test_erc20.abi, getProviderOrSigner(provider, account))
          const approve = await tokenContract.approve(krav_factory.address, MAX_UNIT_256)
          await approve.wait()
          setTransactionState(TransactionState.INTERACTION)
          let gasLimit = await getGasLimit(factory, 'createQuanto', params)
          gasLimit = new BigNumber(gasLimit.toString()).times(1.1)
          // const tx = await factory.createQuanto(...params, { gasLimit: gasLimit.toFixed(0) })
          const tx = await factory.createQuanto(
            tokenAddress,
            LINK_ADDRESS,
            ...[NODE_ADDRESS],
            proportionBTC,
            depositAmount.toString(),
            {
              gasLimit: gasLimit.toFixed(0),
            }
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
    [factory, provider, account]
  )
}
