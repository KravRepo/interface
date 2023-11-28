/** @jsxImportSource @emotion/react */
import KRAVButton from '../../KravUIKit/KravButton'
import { useMediaQuery, useTheme } from '@mui/material'
import { css } from '@emotion/react'
import { align } from '../../../globalStyle'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import moment from 'moment'

type KravRewardCardProps = {
  isTrade: boolean
  backendAmount: BigNumber
  contractAmount: BigNumber
  claimMethod: (isTrade: boolean) => Promise<void>
  nextEpoch: number
  tradeReward?: number
  liquidityReward?: number
}
export const KravRewardCard = ({
  isTrade,
  backendAmount,
  contractAmount,
  claimMethod,
  nextEpoch,
  tradeReward,
  liquidityReward,
}: KravRewardCardProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const nextDistribution = useMemo(() => {
    const nowTime = new Date()
    const targetTime = new Date(nextEpoch * 1000)
    const nowSeconds = nowTime.getUTCHours() * 3600 + nowTime.getUTCMinutes() * 60 + nowTime.getUTCSeconds()
    const targetSeconds = targetTime.getUTCHours() * 3600 + targetTime.getUTCMinutes() * 60 + targetTime.getUTCSeconds()
    const timeInterval = targetSeconds > nowSeconds ? targetSeconds - nowSeconds : 0
    const disHour = new BigNumber(timeInterval).div(60 * 60).toFixed(0, 1)
    const disMinut = new BigNumber(timeInterval)
      .minus(Number(disHour) * 3600)
      .div(60)
      .toFixed(0, 0)
    return { disHour: disHour, disMinut: disMinut }
  }, [backendAmount])
  const { account } = useWeb3React()
  // const kravRewardInfo = useMemo(() => {
  //   if (backendAmount.isGreaterThan(contractAmount)) return { amount: backendAmount, claimEnable: true }
  //   else return { amount: new BigNumber(0), claimEnable: false }
  // }, [backendAmount, contractAmount])
  return (
    <div
      className="krav-reward-card"
      css={css`
        background: ${theme.background.primary};
      `}
    >
      <div
        css={css`
          margin-bottom: 10px;
        `}
      >
        <div className="title gt">Rewards</div>
        <div css={align}>
          {/*<span>What is this?&nbsp;&nbsp;</span>*/}
          {/*<QuestionIcon />*/}
        </div>
      </div>
      <div
        css={css`
          margin-bottom: 40px;
        `}
      >
        <div
          css={[
            align,
            css`
              padding-bottom: ${isMobile ? '24px' : ''};
            `,
          ]}
        >
          {/*<KravToken />*/}
          <span
            css={css`
              font-weight: 500;
              font-size: 20px;
            `}
          >
            &nbsp;{typeof tradeReward !== 'undefined' ? tradeReward : liquidityReward}
          </span>
        </div>
        {!account && <KRAVButton sx={{ height: '30px', minHeight: '30px', width: '129px' }}>Connect Wallet</KRAVButton>}
        {/*{account && (*/}
        {/*  <KRAVButton*/}
        {/*    disabled={!kravRewardInfo.claimEnable}*/}
        {/*    onClick={async () => {*/}
        {/*      await claimMethod(isTrade)*/}
        {/*    }}*/}
        {/*    sx={{ height: '30px', minHeight: '30px', width: '129px' }}*/}
        {/*  >*/}
        {/*    Claim*/}
        {/*  </KRAVButton>*/}
        {/*)}*/}
      </div>
      <div
        css={css`
          background: ${theme.background.second};
        `}
      >
        <p>
          Rewards will be refreshed on{' '}
          {moment(nextEpoch * 1000)
            .utc()
            .format('MMM DD, YYYY HH:mm A')}{' '}
          &nbsp;UTC.{' '}
        </p>
        <p>
          <span>Next distribution:</span>
          <span>
            {nextDistribution.disHour} hours {nextDistribution.disMinut} minutes
          </span>
        </p>
      </div>
    </div>
  )
}
