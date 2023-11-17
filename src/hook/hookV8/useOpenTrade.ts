import BigNumber from 'bignumber.js'
import { OpenTradeParams } from '../../components/Trades/type'
import { ZERO_ADDRESS } from '../../constant/math'
import { useCallback } from 'react'
import { getGasLimit } from '../../utils'
import { useTradingV6Contract } from './useContract'
import { useGetUserOpenLimitOrders } from './useGetUserOpenLimitOrders'
import { useGetUserOpenTrade } from './useGetUserOpenTrade'
import { useRootStore } from '../../store/root'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { useUpdateError } from './useUpdateError'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'
import { useWeb3React } from '@web3-react/core'
import { ChainId } from '../../constant/chain'

export const useOpenTrade = ({
  tuple,
  tradeType,
  slippageP,
  referral = ZERO_ADDRESS,
  spreadReductionId = 0,
  tradingAddress,
  storageAddress,
}: OpenTradeParams) => {
  const contract = useTradingV6Contract(tradingAddress)!
  const { chainId } = useWeb3React()
  const { getUserOpenTrade } = useGetUserOpenTrade()
  const { getUserOpenLimitOrders } = useGetUserOpenLimitOrders()
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  const setTransactionState = useRootStore((store) => store.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((state) => state.setSuccessSnackbarInfo)
  const setOpenTradeCard = useRootStore((state) => state.setOpenTradeCard)
  return useCallback(async () => {
    try {
      setTransactionState(TransactionState.INTERACTION)
      setTransactionDialogVisibility(true)
      const params = [tuple, tradeType, spreadReductionId, slippageP, referral] as any
      let gasLimit: BigNumber
      let tx: any
      if (chainId === ChainId.BASE || chainId === ChainId.BASE_TEST) {
        gasLimit = await getGasLimit(contract, 'openTrade', params)
        gasLimit = new BigNumber(gasLimit.toString()).times(1.1)
        tx = await contract.openTrade(...params, { gasLimit: gasLimit.toFixed(0) })
      } else {
        const minETHFees = await contract.minExecutionFee()
        console.log('minETHFees', minETHFees)
        // gasLimit = await getGasLimit(contract, 'openTrade', params, new BigNumber(minETHFees._hex).toString())
        // gasLimit = new BigNumber(gasLimit.toString()).times(1.1)
        tx = await contract.openTrade(...params, {
          value: new BigNumber(minETHFees._hex).toString(),
          // gasLimit: gasLimit.toFixed(0),
        })
      }
      setTransactionState(TransactionState.START_OPEN_TRADE)
      console.log('tx', await tx.wait())
      setTransactionDialogVisibility(false)
      setTransactionState(TransactionState.START)
      if (tradeType === 0) {
        await getUserOpenTrade(storageAddress, true)
      } else {
        await getUserOpenLimitOrders(storageAddress, true)
      }
      updateSuccessDialog(TransactionAction.OPEN_TRADE)
      setSuccessSnackbarInfo({
        snackbarVisibility: true,
        title: (tuple.buy ? 'Long' : 'Short') + (tuple.index === 0 ? 'Market Order' : 'Limit Order'),
        content: 'Your position has been opened successfully',
      })
      setOpenTradeCard(false)
    } catch (e: any) {
      updateError(TransactionAction.OPEN_TRADE)
      console.error('Open Trade failed!', e)
    }
  }, [contract, tuple, tradeType, slippageP, referral, spreadReductionId, tradingAddress, storageAddress, chainId])
}
