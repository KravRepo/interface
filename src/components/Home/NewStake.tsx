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

export const NewStake = () => {
  const theme = useTheme()
  const { userKravBalance, userLockPosition, userFeesRewardList, totalKravLock, userVeKravAmount } =
    useGetUserKravLock()

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
          <div>
            <KRAVTab>APR</KRAVTab>
            <p className="data gt">{formatNumber('23,102.23', 2, false)}%</p>
          </div>
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
            <p className="data gt">{formatNumber(userVeKravAmount.toNumber(), 2, false)} veKRAV</p>
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
        <LockAction userKravBalance={userKravBalance} userLockPosition={userLockPosition} />
        <MyLocked userLockPosition={userLockPosition} userFeesRewardList={userFeesRewardList} />
      </div>
    </div>
  )
}
