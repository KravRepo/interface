import { useWeb3React } from '@web3-react/core'
import mining_pool from '../../abi/mining_pool.json'
import { useContract } from './useContract'
import { LP_REWARD_API, LP_REWARD_CONTRACT, TRADE_REWARD_CONTRACT } from '../../constant/chain'
import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { addDecimals, eXDecimals } from '../../utils/math'
import { useUpdateError } from './useUpdateError'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'
import { useRootStore } from '../../store/root'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { getGasLimit } from '../../utils'
import { API_DECIMALS } from '../../constant/math'

type RewardApi = {
  lp: string
  lpSignature: string
  trader: string
  traderSignature: string
  liquidityProvided: string
  trdingVolume24H: string
  nextEpoch: number
}

export const useGetUserFarmReward = () => {
  const { account, provider } = useWeb3React()
  const [lpRewardAmount, setLpRewardAmount] = useState(new BigNumber(0))
  const [tradeRewardAmount, setTradeLpRewardAmout] = useState(new BigNumber(0))
  const [userLiquidityProvided, setUserLiquidityProvided] = useState(0)
  const [userTradingVolume24H, setUserTradingVolume24H] = useState(0)
  const [nextEpoch, setNextEpoch] = useState(0)
  const [lpSignature, setLpSignature] = useState('')
  const [tradeSignature, setTradeSignature] = useState('')
  const miningContract = useContract(LP_REWARD_CONTRACT, mining_pool.abi)
  const tradeMiningContract = useContract(TRADE_REWARD_CONTRACT, mining_pool.abi)
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  const setTransactionState = useRootStore((store) => store.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((state) => state.setSuccessSnackbarInfo)
  const queryLPBackend = useCallback(async () => {
    if (account) {
      try {
        const req = await fetch(LP_REWARD_API + account)
        const lpReward = await req.json()
        if (lpReward.code == 200) {
          const lpRewardInfo = lpReward.data as RewardApi
          setLpRewardAmount(eXDecimals(lpRewardInfo.lp, 18))
          setLpSignature(lpRewardInfo.lpSignature)
          setTradeLpRewardAmout(eXDecimals(lpRewardInfo.trader, 18))
          setTradeSignature(lpRewardInfo.traderSignature)
          setUserLiquidityProvided(Number(lpRewardInfo.liquidityProvided) / API_DECIMALS)
          setUserTradingVolume24H(Number(lpRewardInfo.trdingVolume24H) / API_DECIMALS)
          setNextEpoch(Number(lpRewardInfo.nextEpoch))
        }
      } catch (e) {}
    }
  }, [account])

  const claimLpRewardKrav = useCallback(
    async (isTrade: boolean) => {
      if (miningContract && tradeMiningContract && account && provider) {
        try {
          setTransactionState(TransactionState.INTERACTION)
          setTransactionDialogVisibility(true)
          const contract = isTrade ? tradeMiningContract : miningContract
          const params = [
            addDecimals(isTrade ? tradeRewardAmount : lpRewardAmount, 18).toString(),
            isTrade ? tradeSignature : lpSignature,
          ] as any
          let gasLimit = await getGasLimit(contract, 'claim', params)
          gasLimit = new BigNumber(gasLimit.toString()).times(1.1)
          const tx = await contract.claim(...params, { gasLimit: gasLimit.toFixed(0) })
          setTransactionState(TransactionState.PENDING)
          await tx.wait()
          setTransactionDialogVisibility(false)
          setTransactionState(TransactionState.START)
          updateSuccessDialog(
            isTrade ? TransactionAction.CLAIM_TRADING_REWARDS : TransactionAction.CLAIM_LIQUIDITY_PROVIDER_REWARDS
          )
          setSuccessSnackbarInfo({
            snackbarVisibility: true,
            title: `Claim ${isTrade ? 'trade' : 'liquidity provider'} rewards`,
            content: `Your ${isTrade ? 'trade' : 'liquidity provider'} rewards has been claimed successfully`,
          })
        } catch (e) {
          updateError(
            isTrade ? TransactionAction.CLAIM_TRADING_REWARDS : TransactionAction.CLAIM_LIQUIDITY_PROVIDER_REWARDS
          )
          console.error('Claim reward!', e)
        }
      }
    },
    [miningContract, account, provider, lpRewardAmount, tradeMiningContract, tradeRewardAmount]
  )

  useEffect(() => {
    let interval: NodeJS.Timer
    if (miningContract && account && provider) {
      Promise.all([queryLPBackend()]).then()
      interval = setInterval(async () => {
        await Promise.all([queryLPBackend()]).catch((e) => {
          console.log('get user farm reward failed!', e)
        })
      }, 15000)
    }
    return () => clearInterval(interval)
  }, [miningContract, account, provider])

  return {
    lpRewardAmount: lpRewardAmount,
    tradeRewardAmount: tradeRewardAmount,
    lpSignature: lpSignature,
    tradeSignature: tradeSignature,
    claimLpRewardKrav: claimLpRewardKrav,
    userLiquidityProvided: userLiquidityProvided,
    userTradingVolume24H: userTradingVolume24H,
    nextEpoch: nextEpoch,
  }
}
