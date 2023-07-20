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
import { TransactionState } from '../../store/TransactionSlice'

export const useAddLiquidity = (tokenAddress: string) => {
  const { provider, account } = useWeb3React()
  const updateError = useUpdateError()
  const tokenContract = useTokenContract(tokenAddress?.length === VALIDITY_ADDRESS_LENGTH ? tokenAddress : '')!
  const setTransactionState = useRootStore((state) => state.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)

  return useCallback(
    async (amount: BigNumber, vaultAddress: string) => {
      try {
        if (tokenContract) {
          setTransactionDialogVisibility(true)
          const trading_vault_contract = new Contract(
            vaultAddress,
            trading_vault.abi,
            getProviderOrSigner(provider!, account)
          )
          setTransactionState(TransactionState.CHECK_APPROVE)
          const allowance = await tokenContract.allowance(account, vaultAddress)
          console.log('allowance', new BigNumber(allowance._hex).toString())

          if (amount.isGreaterThan(new BigNumber(allowance._hex))) {
            setTransactionState(TransactionState.APPROVE)
            console.log('2 approve', amount.toString())
            const approveTX = await tokenContract.approve(vaultAddress, MAX_UNIT_256)
            await approveTX.wait()
            console.log('3 approveTX', approveTX)
          }
          setTransactionState(TransactionState.ADD_LIQUIDITY)
          const tx = await trading_vault_contract.depositDai(amount.toString())
          await tx.wait()
          setTransactionDialogVisibility(false)
          setTransactionState(TransactionState.START)
          console.log('tx', tx)
        }
      } catch (e) {
        setTransactionDialogVisibility(false)
        setTransactionState(TransactionState.START)
        updateError(e)
        console.error('deposit failed!', e)
      }
    },
    [tokenAddress, provider]
  )
}
