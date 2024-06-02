import BigNumber from 'bignumber.js'
import { OpenTradeParams } from '../../components/Trades/type'
import { MAX_UNIT_256, ZERO_ADDRESS } from '../../constant/math'
import { useCallback } from 'react'
// import { getGasLimit } from '../../utils'
import { useTradingV6Contract, useTokenContract } from './useContract'
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
  tokenAddress,
  tradingAddress,
  storageAddress,
}: OpenTradeParams) => {
  const contract = useTradingV6Contract(tradingAddress)!
  const tokenContract = useTokenContract(tokenAddress)!
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
      setTransactionState(TransactionState.APPROVE)
      // console.log(tradingAddress, tokenAddress, storageAddress) // 0x8524098Ef6cc858c796D1067c8C35B46ae0634BB 0xbE3111856e4acA828593274eA6872f27968C8DD6 0xB7095F2e5672c060fE37d781Fe3cB431E89fBb0a
      const approveTX = await tokenContract.approve(storageAddress, MAX_UNIT_256)
      await approveTX.wait()

      setTransactionState(TransactionState.INTERACTION)
      setTransactionDialogVisibility(true)
      const params = [tuple, slippageP] as any
      // console.log(params)
      // let gasLimit: BigNumber
      let tx: any
      if (chainId === ChainId.BASE || chainId === ChainId.BASE_TEST) {
        // gasLimit = await getGasLimit(contract, 'openTrade', params)
        // gasLimit = new BigNumber(gasLimit.toString()).times(1.1)
        // convert all number params to numbers

        tx = await contract.openTrade(
          {
            trader: params[0].trader,
            sl: params[0].sl,
            tp: params[0].tp,
            pairIndex: params[0].pairIndex,
            openPrice: params[0].openPrice,
            leverage: params[0].leverage,
            initialPosToken: params[0].initialPosToken,
            index: params[0].index,
            buy: params[0].buy,
            positionSizeDai: params[0].positionSizeDai,
          },
          params[1],
          { gasLimit: 10000000 }
        )
      } else {
        const minETHFees = await contract.minExecutionFee()
        // console.log('minETHFees', minETHFees)
        // gasLimit = await getGasLimit(contract, 'openTrade', params, new BigNumber(minETHFees._hex).toString())
        // gasLimit = new BigNumber(gasLimit.toString()).times(1.1)
        tx = await contract.openTrade(
          {
            trader: params[0].trader,
            sl: params[0].sl,
            tp: params[0].tp,
            pairIndex: params[0].pairIndex,
            openPrice: params[0].openPrice,
            leverage: params[0].leverage,
            initialPosToken: params[0].initialPosToken,
            index: params[0].index,
            buy: params[0].buy,
            positionSizeDai: params[0].positionSizeDai,
          },
          params[1],
          {
            value: new BigNumber(minETHFees._hex).toString(),
            gasLimit: 10000000,
          }
        )
      }
      setTransactionState(TransactionState.START_OPEN_TRADE)
      await tx.wait()
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
      console.log('Open Trade failed!', e)
    }
  }, [contract, tuple, tradeType, slippageP, referral, spreadReductionId, tradingAddress, storageAddress, chainId])
}
