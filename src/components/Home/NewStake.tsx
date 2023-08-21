/** @jsxImportSource @emotion/react */
import { LockAction } from './componets/LockAction'
import { MyLocked } from './componets/MyLocked'
import KRAVTab from '../KravUIKit/KravTab'
import { stake } from './style'
import { css, useTheme } from '@mui/material'
import { ReactComponent as KravToken } from '../../assets/imgs/krav_token.svg'
import { ReactComponent as VeKravToken } from '../../assets/imgs/ve_krav_token.svg'
import { align } from '../../globalStyle'
import { formatNumber } from '../../utils'
import { useGetUserKravLock } from '../../hook/hookV8/useGetUserKravLock'
import { useEffect, useMemo } from 'react'
import { useGetUserFarmReward } from '../../hook/hookV8/useGetUserFarmReward'
import { useGetTotalMarketOverview } from '../../hook/hookV8/useGetTotalMarketOverview'
import { useWeb3React } from '@web3-react/core'
import { getBooster } from '../../utils/math'

export const NewStake = () => {
  const theme = useTheme()
  const { account } = useWeb3React()
  const { userKravBalance, userLockPosition, userFeesRewardList, totalKravLock, userVeKravAmount, totalVeKravAmount } =
    useGetUserKravLock()
  const { getOverView, overviewData } = useGetTotalMarketOverview()
  const { userLiquidityProvided } = useGetUserFarmReward()
  const currentUserBooster = useMemo(() => {
    return getBooster(userLiquidityProvided, overviewData, userVeKravAmount, totalVeKravAmount)
  }, [overviewData, userLiquidityProvided, userVeKravAmount, totalVeKravAmount])

  useEffect(() => {
    let interval: NodeJS.Timer
    if (account) {
      getOverView().then()
      interval = setInterval(async () => {
        await getOverView()
      }, 60000)
    }
    return () => clearInterval(interval)
  }, [account])

  return (
    <div
      css={[
        stake,
        css`
          color: ${theme.text.primary};
        `,
      ]}
    >
      <div>
        <p className="title gt">KRAV Locking</p>
        <p
          css={css`
            font-size: 16px;
            padding-top: 12px;
            padding-bottom: 40px;
          `}
        >
          Lock in to obtain krav income and veKRAV rights and interests, up to Boost your yield up to 2.5x
        </p>
      </div>
      <div
        className="card"
        css={css`
          background: ${theme.background.primary};
        `}
      >
        <div
          css={[
            align,
            css`
              display: grid;
              grid-template-columns: 1fr 1fr;
            `,
          ]}
        >
          <div css={align}>
            <KravToken />
            <span
              css={css`
                font-size: 20px;
                font-weight: 500;
                margin-left: 12px;
              `}
            >
              KRAV
            </span>
          </div>
          {/*<div>*/}
          {/*  <KRAVTab>APR</KRAVTab>*/}
          {/*  <p className="data gt">{formatNumber('23,102.23', 2, false)}%</p>*/}
          {/*</div>*/}
        </div>
        <div
          css={css`
            padding: 0 32px;
            border-left: ${theme.splitLine.primary};
            border-right: ${theme.splitLine.primary};
          `}
        >
          <KRAVTab>Total Governance Reward Pool </KRAVTab>
          <p className="data gt">{formatNumber('23,102,345.00', 2, false)} KRAV</p>
        </div>
        <div
          css={css`
            padding-left: 32px;
          `}
        >
          <KRAVTab>Total Stake</KRAVTab>
          <p className="data gt">{formatNumber(totalKravLock.toString(), 2, false)} KRAV</p>
        </div>
      </div>
      <div
        className="card"
        css={css`
          background: ${theme.background.primary};
        `}
      >
        <div
          css={[
            align,
            css`
              display: grid;
              grid-template-columns: 1fr 1fr;
            `,
          ]}
        >
          <div css={align}>
            <VeKravToken />
            <span
              css={css`
                font-size: 20px;
                font-weight: 500;
                margin-left: 12px;
              `}
            >
              veKRAV
            </span>
          </div>
          <div>
            <KRAVTab>veKRAV Supply</KRAVTab>
            <p className="data gt">{formatNumber(totalVeKravAmount.toNumber(), 2, false)} veKRAV</p>
          </div>
        </div>
        <div
          css={css`
            padding: 0 32px;
            border-left: ${theme.splitLine.primary};
            border-right: ${theme.splitLine.primary};
          `}
        >
          <KRAVTab>You veKRAV Supply</KRAVTab>
          <p className="data gt">{formatNumber(userVeKravAmount.toNumber(), 2, false)} veKRAV</p>
        </div>
        {/*<div*/}
        {/*  css={css`*/}
        {/*    padding-left: 32px;*/}
        {/*  `}*/}
        {/*>*/}
        {/*  <KRAVTab>Avg.Lock Time(years)</KRAVTab>*/}
        {/*  <p className="data gt">1.86</p>*/}
        {/*</div>*/}
      </div>
      <div
        className="action"
        css={css`
          background: ${theme.background.primary};
        `}
      >
        <LockAction
          userKravBalance={userKravBalance}
          userLockPosition={userLockPosition}
          currentUserBooster={currentUserBooster}
          overviewData={overviewData}
          userLiquidityProvided={userLiquidityProvided}
          userVeKravAmount={userVeKravAmount}
          totalVeKravAmount={totalVeKravAmount}
        />
        <MyLocked
          userLockPosition={userLockPosition}
          userFeesRewardList={userFeesRewardList}
          currentUserBooster={currentUserBooster}
        />
      </div>
    </div>
  )
}
