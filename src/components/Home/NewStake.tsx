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
import { useGetTotalMarketOverview } from '../../hook/hookV8/useGetTotalMarketOverview'
import { useWeb3React } from '@web3-react/core'
import { useInterval } from '../../hook/hookV8/useInterval'
import { useGetUserFarmReward } from '../../hook/hookV8/useGetUserFarmReward'
import { getBooster, getTradeBooster } from '../../utils/math'

export const NewStake = () => {
  const theme = useTheme()
  const { account } = useWeb3React()
  const { userKravBalance, userLockPosition, userFeesRewardList, totalKravLock, userVeKravAmount, totalVeKravAmount } =
    useGetUserKravLock()
  const { getOverView, overviewData } = useGetTotalMarketOverview()

  const { userLiquidityProvided, userTradingVolume24H } = useGetUserFarmReward()
  const currentUserBooster = useMemo(() => {
    return getBooster(userLiquidityProvided, overviewData, userVeKravAmount, totalVeKravAmount)
  }, [overviewData, userLiquidityProvided, userVeKravAmount, totalVeKravAmount])

  const tradeBooster = useMemo(() => {
    return getTradeBooster(userTradingVolume24H, overviewData, userVeKravAmount, totalVeKravAmount)
  }, [userTradingVolume24H, overviewData, userVeKravAmount, totalVeKravAmount])

  const lpBooster = useMemo(() => {
    return getBooster(userLiquidityProvided, overviewData, userVeKravAmount, totalVeKravAmount)
  }, [overviewData, userLiquidityProvided, userVeKravAmount, totalVeKravAmount])

  useInterval(getOverView, 30000)

  useEffect(() => {
    if (account) {
      getOverView().then()
    }
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
          Engage the lock-in feature to secure your Krav earnings and obtain veKRAV privileges. Enhance your yield
          potential by up to 2.5x
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
          <div
            css={[
              align,
              css`
                @media screen and (max-width: 1200px) {
                  padding-bottom: 16px;
                }
              `,
            ]}
          >
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
            @media screen and (max-width: 1200px) {
              width: 100%;
              border-left: unset;
              border-right: unset;
              padding: 0 0 16px 0;
              margin-bottom: 16px;
              border-bottom: ${theme.splitLine.primary};
            }
          `}
        >
          <KRAVTab>Total Governance Reward Pool </KRAVTab>
          <p className="data gt">{formatNumber(overviewData?.govFeeTotal, 2, true)}</p>
        </div>
        <div
          css={css`
            padding-left: 32px;
            @media screen and (max-width: 1200px) {
              padding: 0;
            }
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
              @media screen and (max-width: 1200px) {
                grid-template-columns: 1fr;
                grid-template-rows: 1fr 1fr;
              }
            `,
          ]}
        >
          <div
            css={[
              align,
              css`
                @media screen and (max-width: 1200px) {
                  padding-bottom: 16px;
                }
              `,
            ]}
          >
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
            @media screen and (max-width: 1200px) {
              width: 100%;
              border-bottom: unset;
              border-left: unset;
              border-right: unset;
              padding: 16px 0 0 0;
              margin-top: 16px;
              border-top: ${theme.splitLine.primary};
            }
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
          @media screen and (max-width: 1200px) {
            display: block !important;
            > div:first-of-type {
              margin-bottom: 36px;
            }
          }
        `}
      >
        <LockAction
          userKravBalance={userKravBalance}
          userLockPosition={userLockPosition}
          currentUserBooster={currentUserBooster}
          overviewData={overviewData}
          userLiquidityProvided={0}
          userVeKravAmount={userVeKravAmount}
          totalVeKravAmount={totalVeKravAmount}
        />
        <MyLocked
          userLockPosition={userLockPosition}
          userFeesRewardList={userFeesRewardList}
          tradeBooster={tradeBooster}
          LpBooster={lpBooster}
        />
      </div>
    </div>
  )
}
