/** @jsxImportSource @emotion/react */
import { TradingRewards } from './componets/TradingRewards'
import { LiquidityRewards } from './componets/LiquidityRewards'
import { stake } from './style'
import { useGetUserFarmReward } from '../../hook/hookV8/useGetUserFarmReward'
import { useGetTotalMarketOverview } from '../../hook/hookV8/useGetTotalMarketOverview'
import { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { LP_REWARD_API } from '../../constant/chain'

type RewardInfo = {
  liquidityProvided: string
  lp: string
  nextEpoch: number
  trader: string
  trdingVolume24H: string
  veBalance: string
  veTotalSupply: string
}

export const NewFarm = () => {
  const { account, provider } = useWeb3React()
  const {
    lpRewardAmount,
    tradeRewardAmount,
    claimLpRewardKrav,
    userTradingVolume24H,
    userLiquidityProvided,
    nextEpoch,
  } = useGetUserFarmReward()
  // const { userVeKravAmount, totalVeKravAmount } = useGetUserKravLock()
  const { getOverView, overviewData } = useGetTotalMarketOverview()
  const [tradeReward, setTradeReward] = useState(0)
  const [liquidityReward, setLiquidityReward] = useState(0)

  const getRewardList = useCallback(async () => {
    if (account) {
      try {
        const totalReq = await fetch(LP_REWARD_API + account)
        const totalRep = await totalReq.json()
        const rewardInfo: RewardInfo = totalRep.data
        setTradeReward(tradeReward + Number(rewardInfo.trader))
        setLiquidityReward(liquidityReward + Number(rewardInfo.lp))
      } catch (e) {}
    }
  }, [account])

  // const tradeBooster = useMemo(() => {
  //   return getTradeBooster(userTradingVolume24H, overviewData, userVeKravAmount, totalVeKravAmount)
  // }, [userTradingVolume24H, overviewData, userVeKravAmount, totalVeKravAmount])
  //
  // const LpBooster = useMemo(() => {
  //   return getBooster(userLiquidityProvided, overviewData, userVeKravAmount, totalVeKravAmount)
  // }, [overviewData, userLiquidityProvided, userVeKravAmount, totalVeKravAmount])

  useEffect(() => {
    let interval: NodeJS.Timer
    if (provider && account) {
      Promise.all([getOverView().then(), getRewardList().then()]).then()
      interval = setInterval(async () => {
        await Promise.all([getOverView(), getRewardList()])
      }, 15000)
    }
    return () => clearInterval(interval)
  }, [account, provider])

  return (
    <div css={stake}>
      <TradingRewards
        contractAmount={new BigNumber(0)}
        lpRewardAmount={tradeRewardAmount}
        claimTradingRewardKrav={claimLpRewardKrav}
        overviewData={overviewData}
        userTradingVolume24H={userTradingVolume24H}
        tradeBooster={new BigNumber(0)}
        tradeReward={tradeReward}
        nextEpoch={nextEpoch}
      />
      <LiquidityRewards
        lpRewardAmount={lpRewardAmount}
        contractAmount={new BigNumber(0)}
        claimLpRewardKrav={claimLpRewardKrav}
        overviewData={overviewData}
        LpBooster={new BigNumber(0)}
        nextEpoch={nextEpoch}
        userLiquidityProvided={userLiquidityProvided}
        liquidityReward={liquidityReward}
      />
    </div>
  )
}
