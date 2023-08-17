/** @jsxImportSource @emotion/react */
import { TradingRewards } from './componets/TradingRewards'
import { LiquidityRewards } from './componets/LiquidityRewards'
import { stake } from './style'
import { useGetUserFarmReward } from '../../hook/hookV8/useGetUserFarmReward'
import { useGetUserAssetOverview } from '../../hook/hookV8/useGetUserAssetOverview'
import { useGetTotalMarketOverview } from '../../hook/hookV8/useGetTotalMarketOverview'
import { useEffect } from 'react'

export const NewFarm = () => {
  const { lpRewardAmount, receivedLpRewardAmount, tradeRewardAmount, receivedTradeRewardAmount, claimLpRewardKrav } =
    useGetUserFarmReward()
  const { getOverView, overviewData } = useGetTotalMarketOverview()
  const { userAssetOverview, getUserAssetOverview } = useGetUserAssetOverview()
  Promise.all([
    // getUserStake().then((stakeAmount) => setUserStake(eXDecimals(stakeAmount, 18))),
    getOverView().then(),
    getUserAssetOverview(),
  ]).then()
  useEffect(() => {
    Promise.all([getOverView().then(), getUserAssetOverview()]).then()
    const interval = setInterval(async () => {
      console.log('get user asset data ')
      await Promise.all([getOverView(), getUserAssetOverview()])
    }, 15000)
    return () => clearInterval(interval)
  }, [getOverView, getUserAssetOverview])
  return (
    <div css={stake}>
      <TradingRewards
        contractAmount={receivedTradeRewardAmount}
        lpRewardAmount={tradeRewardAmount}
        claimTradingRewardKrav={claimLpRewardKrav}
        overviewData={overviewData}
      />
      <LiquidityRewards
        lpRewardAmount={lpRewardAmount}
        contractAmount={receivedLpRewardAmount}
        claimLpRewardKrav={claimLpRewardKrav}
        overviewData={overviewData}
        userAssetOverview={userAssetOverview}
      />
    </div>
  )
}
