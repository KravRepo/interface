/** @jsxImportSource @emotion/react */
import { TradingRewards } from './componets/TradingRewards'
import { LiquidityRewards } from './componets/LiquidityRewards'
import { stake } from './style'
import { useGetUserFarmReward } from '../../hook/hookV8/useGetUserFarmReward'
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
    nextEpoch,
  } = useGetUserFarmReward()
  const { userVeKravAmount, totalVeKravAmount } = useGetUserKravLock()
  const { getOverView, overviewData } = useGetTotalMarketOverview()

  const tradeBooster = useMemo(() => {
    return getTradeBooster(userTradingVolume24H, overviewData, userVeKravAmount, totalVeKravAmount)
  }, [userTradingVolume24H, overviewData, userVeKravAmount, totalVeKravAmount])

  const LpBooster = useMemo(() => {
    return getBooster(userLiquidityProvided, overviewData, userVeKravAmount, totalVeKravAmount)
  }, [overviewData, userLiquidityProvided, userVeKravAmount, totalVeKravAmount])

  useEffect(() => {
    let interval: NodeJS.Timer
    if (provider && account) {
      Promise.all([getOverView().then()]).then()
      interval = setInterval(async () => {
        await Promise.all([getOverView()])
      }, 15000)
    }
    return () => clearInterval(interval)
  }, [account, provider])

  return (
    <div css={stake}>
      <TradingRewards
        contractAmount={receivedTradeRewardAmount}
        lpRewardAmount={tradeRewardAmount}
        claimTradingRewardKrav={claimLpRewardKrav}
        overviewData={overviewData}
        userTradingVolume24H={userTradingVolume24H}
        tradeBooster={tradeBooster}
        nextEpoch={nextEpoch}
      />
      <LiquidityRewards
        lpRewardAmount={lpRewardAmount}
        contractAmount={receivedLpRewardAmount}
        claimLpRewardKrav={claimLpRewardKrav}
        overviewData={overviewData}
        LpBooster={LpBooster}
        nextEpoch={nextEpoch}
        userLiquidityProvided={userLiquidityProvided}
      />
    </div>
  )
}
