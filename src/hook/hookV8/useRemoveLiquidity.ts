import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useUpdateError } from './useUpdateError'
import { useRootStore } from '../../store/root'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { eXDecimals } from '../../utils/math'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'
import { ChainId } from '../../constant/chain'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'ethers'
import trading_vault from '../../abi/trading_vault_v5.json'
import trading_vault_eth from '../../abi/trading_vault_v5_eth.json'
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
        const isBase = chainId === ChainId.BASE || chainId === ChainId.BASE_TEST
        const trading_vault_contract = new Contract(
          vaultAddress,
          isBase ? trading_vault.abi : trading_vault_eth.abi,
          getProviderOrSigner(provider!, account)
        )
        setTransactionState(TransactionState.INTERACTION)
        setTransactionDialogVisibility(true)
        const tx = await trading_vault_contract[isBase ? 'withdrawDai' : 'withdraw'](amount.toString())
        setTransactionState(TransactionState.REMOVE_LIQUIDITY)
        await tx.wait()
        setTransactionState(TransactionState.START)
        setTransactionDialogVisibility(false)
        updateSuccessDialog(TransactionAction.REMOVE_LIQUIDITY)
        setSuccessSnackbarInfo({
          snackbarVisibility: true,
          title: 'Withdraw',
          content: `Your ${eXDecimals(amount, decimals).toFixed(2)} ${symbol} has been withdraw successfully`,
        })
      } catch (e) {
        setTransactionDialogVisibility(false)
        setTransactionState(TransactionState.START)
        updateError(TransactionAction.REMOVE_LIQUIDITY)
        console.log('deposit failed!', e)
      }
    },
    [vaultAddress, chainId]
  )
}
