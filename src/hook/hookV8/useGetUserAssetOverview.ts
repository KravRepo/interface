import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { DashBoard_USER_OVERVIEW_API } from '../../constant/chain'

export type UserAssetOverview = {
  balance: string
  lpRewardBalance: string
}

export const useGetUserAssetOverview = () => {
  const { account } = useWeb3React()
  const [userAssetOverview, setUserAssetOverview] = useState<UserAssetOverview>({} as UserAssetOverview)
  const getUserAssetOverview = useCallback(async () => {
    if (account) {
      try {
        const req = await fetch(DashBoard_USER_OVERVIEW_API + account)
        const overview = await req.json()
        setUserAssetOverview(overview.data)
      } catch (e) {}
    }
  }, [account])

  return {
    userAssetOverview: userAssetOverview,
    getUserAssetOverview: getUserAssetOverview,
  }
}
