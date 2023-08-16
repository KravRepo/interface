/** @jsxImportSource @emotion/react */
import { TradingRewards } from './componets/TradingRewards'
import { LiquidityRewards } from './componets/LiquidityRewards'
import { stake } from './style'
import { useGetUserFarmReward } from '../../hook/hookV8/useGetUserFarmReward'

export const NewFarm = () => {
  const { lpRewardAmount, receivedLpRewardAmount, tradeRewardAmount, receivedTradeRewardAmount, claimLpRewardKrav } =
    useGetUserFarmReward()

  return (
    <div css={stake}>
      <TradingRewards
        contractAmount={receivedTradeRewardAmount}
        lpRewardAmount={tradeRewardAmount}
        claimTradingRewardKrav={claimLpRewardKrav}
      />
      <LiquidityRewards
        lpRewardAmount={lpRewardAmount}
        contractAmount={receivedLpRewardAmount}
        claimLpRewardKrav={claimLpRewardKrav}
      />
    </div>
  )
}
