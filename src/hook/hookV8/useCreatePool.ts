import { useFactoryWithProvider } from './useContract'
import { useCallback } from 'react'
import { LINK_ADDRESS, NODE_ADDRESS } from '../../constant/chain'
import { getGasLimit } from '../../utils'
import BigNumber from 'bignumber.js'
import { useUpdateError } from './useUpdateError'
import { useRootStore } from '../../store/root'
import { TransactionState } from '../../store/TransactionSlice'

export const useCreatePool = () => {
  const factory = useFactoryWithProvider()!
  const updateError = useUpdateError()
  const setTransactionState = useRootStore((state) => state.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  return useCallback(
    async (tokenAddress: string, proportionBTC: number | string) => {
      const params = [tokenAddress, LINK_ADDRESS, NODE_ADDRESS, proportionBTC] as any
      try {
        setTransactionDialogVisibility(true)
        setTransactionState(TransactionState.CREAT_POOL)
        let gasLimit = await getGasLimit(factory, 'createQuanto', params)
        gasLimit = new BigNumber(gasLimit.toString()).times(1.1)
        // const tx = await factory.createQuanto(...params, { gasLimit: gasLimit.toFixed(0) })
        const tx = await factory.createQuanto(tokenAddress, LINK_ADDRESS, ...[NODE_ADDRESS], proportionBTC, {
          gasLimit: 3000000,
        })
        await tx.wait()
        console.log('tx', tx)
      } catch (e) {
        setTransactionDialogVisibility(false)
        setTransactionState(TransactionState.START)
        updateError(e)
        console.error('create pool failed!', e)
      }
    },
    [factory]
  )
}
