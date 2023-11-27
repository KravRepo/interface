import { useWeb3React } from '@web3-react/core'
import { creatCall, decodeCallResult, useFactoryWithProvider } from './useContract'
import { useCallback, useEffect, useState } from 'react'
import { useRootStore } from '../../store/root'
import { Contract } from 'ethers'
import multicall2 from '../../abi/multicall2.json'
import factory_abi from '../../abi/krav_factory.json'
import { Interface } from 'ethers/lib/utils'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'
import { PoolParams } from '../../store/FactorySlice'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { useUpdateError } from './useUpdateError'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'
import { getGasLimit } from '../../utils'
import { CONTRACT_CONFIG, DEFAULT_CHAIN, SUPPORT_CHAIN } from '../../constant/chain'
import { useInterval } from './useInterval'

type UseRewardInfo = {
  pool: PoolParams
  amount: BigNumber
}

export const useReferral = () => {
  const { account, provider, chainId } = useWeb3React()
  const [useRewardInfo, setUserRewardInfo] = useState([] as UseRewardInfo[])
  const [buttonEnable, setButtonEnable] = useState(false)
  const factory = useFactoryWithProvider(provider)
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  const setTransactionState = useRootStore((store) => store.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((state) => state.setSuccessSnackbarInfo)

  const claimRewards = useCallback(async () => {
    if (factory && account && provider && allPoolParams.length > 0 && chainId) {
      try {
        const tokenAddresses: string[] = []
        allPoolParams.forEach((pool) => {
          tokenAddresses.push(pool.tokenT)
        })
        const params = [tokenAddresses] as any
        setTransactionState(TransactionState.INTERACTION)
        setTransactionDialogVisibility(true)
        let gasLimit = await getGasLimit(factory, 'claimReward', params)
        gasLimit = new BigNumber(gasLimit.toString()).times(1.1)
        const tx = await factory.claimReward(...params, { gasLimit: gasLimit.toFixed(0) })
        setTransactionState(TransactionState.CLAIM_REFERRAL_REWARD)
        console.log('tx', await tx.wait())
        setTransactionDialogVisibility(false)
        setTransactionState(TransactionState.START)
        updateSuccessDialog(TransactionAction.CLAIM_REFERRAL_REWARD)
        setSuccessSnackbarInfo({
          snackbarVisibility: true,
          title: 'Claim referral rewards',
          content: 'Your rewards has been opened successfully',
        })
      } catch (e) {
        console.log('claim referral rewards failed!', e)
        updateError(TransactionAction.CLAIM_REFERRAL_REWARD)
      }
    }
  }, [account, provider, factory, allPoolParams, chainId])

  const getRewardsReferral = useCallback(async () => {
    if (factory && account && provider && allPoolParams.length > 0 && chainId) {
      try {
        const multicall = new Contract(
          chainId && SUPPORT_CHAIN.includes(chainId)
            ? CONTRACT_CONFIG[chainId].multicall
            : CONTRACT_CONFIG[DEFAULT_CHAIN].multicall,
          multicall2.abi,
          provider
        )
        const factoryInterface = new Interface(factory_abi.abi)
        const task: any[] = []
        allPoolParams.forEach((pool) => {
          task.push(
            creatCall(
              CONTRACT_CONFIG[chainId && SUPPORT_CHAIN.includes(chainId) ? chainId : DEFAULT_CHAIN].factory,
              factoryInterface,
              'rewardsReferral',
              [account, pool.tokenT]
            )
          )
        })
        const data = await multicall.callStatic.aggregate(task)
        let rewardInfos = data.returnData
        rewardInfos = rewardInfos.map((info: any, index: number) => {
          const amount = new BigNumber(decodeCallResult(factoryInterface, 'rewardsReferral', info)._hex)
          if (amount.isGreaterThan(0)) setButtonEnable(true)
          return {
            pool: allPoolParams[index],
            amount: eXDecimals(amount, allPoolParams[index].decimals),
          }
        })
        setUserRewardInfo(rewardInfos)
      } catch (e) {
        console.log('getRewardsReferral failed!', e)
      }
    }
  }, [account, provider, factory, allPoolParams, chainId])

  useInterval(getRewardsReferral, 30000)

  useEffect(() => {
    getRewardsReferral().then()
  }, [getRewardsReferral])

  return { useRewardInfo: useRewardInfo, claimRewards: claimRewards, buttonEnable: buttonEnable }
}
