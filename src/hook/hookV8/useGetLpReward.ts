import { useContract } from './useContract'
import trading_vault from '../../abi/trading_vault_v5.json'
import { useWeb3React } from '@web3-react/core'
import React, { Dispatch, useCallback, useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'
import { useRootStore } from '../../store/root'
import { Contract } from 'ethers'
import { UserData } from './useUserPosition'

export const useGetLpReward = (vaultAddress: string, decimals: number) => {
  const { account } = useWeb3React()
  const vaultContract = useContract(vaultAddress, trading_vault.abi)
  return useCallback(
    async (setLpReward: Dispatch<React.SetStateAction<BigNumber>>) => {
      try {
        if (vaultContract) {
          const lpReward = await vaultContract.pendingRewardDai.call({
            from: account,
          })
          setLpReward(eXDecimals(new BigNumber(lpReward._hex), decimals))
        }
      } catch (e) {
        console.log('get lp reward failed!', e)
      }
    },
    [account, vaultContract]
  )
}

export type UserFeesRewardList = {
  position: UserData
  rewardAmount: BigNumber
}
export const useGetAllLpReward = () => {
  const { account, provider, chainId } = useWeb3React()
  const [userFeesRewardList, setUserFeesRewardList] = useState([] as UserFeesRewardList[])
  const userPositionDatas = useRootStore((store) => store.userPositionDatas)
  const positionDatas = useMemo(() => {
    let flag = false
    userPositionDatas.find((positionData) => {
      if (positionData?.hasPosition) flag = true
    })
    if (flag) {
      return userPositionDatas.filter((position) => position.hasPosition)
    } else return []
  }, [userPositionDatas])
  const getAllLpReward = useCallback(async () => {
    if (positionDatas.length > 0 && account && provider && chainId) {
      const feesRewardList: UserFeesRewardList[] = []
      const getAndForMatter = async () => {
        return await Promise.all(
          positionDatas.map(async (positionData, index) => {
            const asyncWorker = async () => {
              try {
                const contract = new Contract(positionData.pool.vaultT, trading_vault.abi, provider)
                const lpReward = await contract.pendingRewardDaiByAccount(account)
                const amount = new BigNumber(lpReward._hex)
                if (amount.isGreaterThan(0)) {
                  feesRewardList.push({
                    position: positionData,
                    rewardAmount: eXDecimals(new BigNumber(lpReward._hex), positionData.pool.decimals),
                  })
                }
              } catch (e) {}
            }
            return await asyncWorker()
          })
        )
      }
      await getAndForMatter()
      setUserFeesRewardList(feesRewardList)
    }
  }, [positionDatas, account, provider, chainId])

  useEffect(() => {
    let interval: NodeJS.Timer
    if (account && provider && positionDatas.length > 0) {
      getAllLpReward().then()
      interval = setInterval(async () => {
        await getAllLpReward()
      }, 15000)
    }
    return () => clearInterval(interval)
  }, [account, positionDatas, provider])

  return { userFeesRewardList: userFeesRewardList }
}
