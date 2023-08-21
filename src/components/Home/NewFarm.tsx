/** @jsxImportSource @emotion/react */
import { TradingRewards } from './componets/TradingRewards'
import { LiquidityRewards } from './componets/LiquidityRewards'
import { stake } from './style'
import { useGetUserFarmReward } from '../../hook/hookV8/useGetUserFarmReward'
import { useGetUserAssetOverview } from '../../hook/hookV8/useGetUserAssetOverview'
import { useGetTotalMarketOverview } from '../../hook/hookV8/useGetTotalMarketOverview'
import { useEffect, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getBooster, getTradeBooster } from '../../utils/math'
import { useGetUserKravLock } from '../../hook/hookV8/useGetUserKravLock'

export const NewFarm = () => {
  const { account, provider } = useWeb3React()
  const {
    lpRewardAmount,
    receivedLpRewardAmount,
    tradeRewardAmount,
    receivedTradeRewardAmount,
    claimLpRewardKrav,
    userTradingVolume24H,
    userLiquidityProvided,
  } = useGetUserFarmReward()
  const { userVeKravAmount, totalVeKravAmount } = useGetUserKravLock()
  const { getOverView, overviewData } = useGetTotalMarketOverview()
  const { userAssetOverview, getUserAssetOverview } = useGetUserAssetOverview()
  useEffect(() => {
    let interval: NodeJS.Timer
    if (provider && account) {
      Promise.all([getOverView().then(), getUserAssetOverview()]).then()
      interval = setInterval(async () => {
        console.log('get user asset data ')
        await Promise.all([getOverView(), getUserAssetOverview()])
      }, 15000)
    }
    return () => clearInterval(interval)
  }, [account, provider])

  const tradeBooster = useMemo(() => {
    return getTradeBooster(userTradingVolume24H, overviewData, userVeKravAmount, totalVeKravAmount)
  }, [userTradingVolume24H, overviewData, userVeKravAmount, totalVeKravAmount])

  const LpBooster = useMemo(() => {
    return getBooster(userLiquidityProvided, overviewData, userVeKravAmount, totalVeKravAmount)
  }, [overviewData, userLiquidityProvided, userVeKravAmount, totalVeKravAmount])
  return (
    <div css={stake}>
      <TradingRewards
        contractAmount={receivedTradeRewardAmount}
        lpRewardAmount={tradeRewardAmount}
        claimTradingRewardKrav={claimLpRewardKrav}
        overviewData={overviewData}
        userTradingVolume24H={userTradingVolume24H}
        tradeBooster={tradeBooster}
      />
      <LiquidityRewards
        lpRewardAmount={lpRewardAmount}
        contractAmount={receivedLpRewardAmount}
        claimLpRewardKrav={claimLpRewardKrav}
        overviewData={overviewData}
        userAssetOverview={userAssetOverview}
        LpBooster={LpBooster}
      />
    </div>
  )
}
