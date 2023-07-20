import { useRootStore } from '../../store/root'
import { useContract } from './useContract'
import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import test_erc20 from '../../abi/test_erc20.json'
import { MAX_UNIT_256 } from 'constant/math'
import { TransactionState } from '../../store/TransactionSlice'
import { useUpdateError } from './useUpdateError'

BigNumber.config({ EXPONENTIAL_AT: 1e9 })

export const useApprove = (tokenAddress: string, tradingAddress: string, storageAddress: string) => {
  const contract = useContract(tokenAddress, test_erc20.abi)!
  const { account } = useWeb3React()
  const setTransactionState = useRootStore((store) => store.setTransactionState)
  const updateError = useUpdateError()
  const approve = useCallback(async () => {
    try {
      setTransactionState(TransactionState.CHECK_APPROVE)
      const allowance = await Promise.all([
        contract.allowance(account, tradingAddress),
        contract.allowance(account, storageAddress),
        // contract.allowance(account, account),
      ])
      const tradingV6IsApprove = new BigNumber(allowance[0].toString())
      const tradingStorageIsApprove = new BigNumber(allowance[1].toString())
      // const walletIsApprove = new BigNumber(allowance[2].toString())
      try {
        if (!tradingV6IsApprove.isGreaterThan(0)) {
          setTransactionState(TransactionState.APPROVE)
          const tx = await contract.approve(tradingAddress, MAX_UNIT_256)
          await tx.wait()
        }
      } catch (e) {
        throw new Error('approve trading_v6 failed')
      }
      try {
        if (!tradingStorageIsApprove.isGreaterThan(0)) {
          setTransactionState(TransactionState.APPROVE)
          const tx = await contract.approve(storageAddress, MAX_UNIT_256)
          await tx.wait()
        }
      } catch (e) {
        throw new Error('approve trading_storage failed')
      }
      // //TODO: wallet approve isn't necessary ?
      // try {
      //   console.log('wallet Approve')
      //   if (!walletIsApprove.isEqualTo(new BigNumber(MAX_UNIT_256))) {
      //     await contract.approve(account, MAX_UNIT_256)
      //   }
      // } catch (e) {
      //   throw new Error('approve wallet failed')
      // }
    } catch (e) {
      updateError(e)
      console.error('approve trading contract or storage contract failed!', e)
      setTransactionState(TransactionState.START)
    }
    setTransactionState(TransactionState.APPROVE_SUCCESS)
  }, [contract, tokenAddress, tradingAddress, storageAddress])
  return approve
}
