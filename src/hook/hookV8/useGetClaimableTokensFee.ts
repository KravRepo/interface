import { useWeb3React } from '@web3-react/core'
import { useContract } from './useContract'
import { useCallback, useState } from 'react'
import { FEE_DISTRBUTOR } from '../../constant/chain'
import fees_manager from '../../abi/fee_distributor_manager.json'
import BigNumber from 'bignumber.js'
import { useRootStore } from '../../store/root'
import { PoolParams } from '../../store/FactorySlice'

export type FeesRewardList = {
  amount: BigNumber
  pool: PoolParams
}
// claim reward for locked krav
export const useGetClaimableTokensFee = () => {
  const { account, provider } = useWeb3React()
  const feesDistributorContract = useContract(FEE_DISTRBUTOR, fees_manager.abi)
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const [userFeesRewardList, setUserFeesRewardList] = useState([] as FeesRewardList[])

  const getUserFeesReward = useCallback(async () => {
    if (feesDistributorContract && account && provider && allPoolParams.length > 0) {
      try {
        const validTokens = (await feesDistributorContract.getValidTokens()) as string[]
        console.log('validTokens', validTokens)
        const list = await feesDistributorContract.claimableTokens(account, validTokens)
        const feesRewardList: FeesRewardList[] = validTokens.map((item, index) => {
          const targetPool = allPoolParams.find((pool) => pool.tokenT === item)!
          return {
            amount: new BigNumber(list[index]._hex),
            pool: targetPool,
          }
        })
        setUserFeesRewardList(feesRewardList)
      } catch (e) {
        console.log('getUserFeesReward failed!', e)
      }
    }
  }, [feesDistributorContract, account, provider, allPoolParams])

  return { getUserFeesReward: getUserFeesReward, userFeesRewardList: userFeesRewardList }
}
