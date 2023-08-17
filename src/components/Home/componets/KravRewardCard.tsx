/** @jsxImportSource @emotion/react */
import { ReactComponent as QuestionIcon } from '../../../assets/imgs/question.svg'
import { ReactComponent as KravToken } from '../../../assets/imgs/krav_token.svg'
import KRAVButton from '../../KravUIKit/KravButton'
import { useTheme } from '@mui/material'
import { css } from '@emotion/react'
import { align } from '../../../globalStyle'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { getBigNumberStr } from '../../../utils'

type KravRewardCardProps = {
  isTrade: boolean
  backendAmount: BigNumber
  contractAmount: BigNumber
  claimMethod: (isTrade: boolean) => Promise<void>
}
export const KravRewardCard = ({ isTrade, backendAmount, contractAmount, claimMethod }: KravRewardCardProps) => {
  const nextDistribution = useMemo(() => {
    const nowTime = new Date()
    const nowSeconds = nowTime.getUTCHours() * 3600 + nowTime.getUTCMinutes() * 60 + nowTime.getUTCSeconds()
    const targetSeconds = 24 * 3600
    const timeInterval =
      targetSeconds > nowSeconds ? targetSeconds - nowSeconds : targetSeconds + 24 * 3600 - nowSeconds
    const disHour = new BigNumber(timeInterval).div(60 * 60).toFixed(0, 1)
    const disMinut = new BigNumber(timeInterval)
      .minus(Number(disHour) * 3600)
      .div(60)
      .toFixed(0, 1)
    return { disHour: disHour, disMinut: disMinut }
  }, [backendAmount])
  const { account } = useWeb3React()
  const theme = useTheme()
  const kravRewardInfo = useMemo(() => {
    if (backendAmount.isGreaterThan(contractAmount)) return { amount: backendAmount, claimEnable: true }
    else return { amount: new BigNumber(0), claimEnable: false }
  }, [backendAmount, contractAmount])
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
        <div className="title gt">KRAV Rewards</div>
        <div css={align}>
          <span>What is this?&nbsp;&nbsp;</span>
          <QuestionIcon />
        </div>
      </div>
      <div
        css={css`
          margin-bottom: 40px;
        `}
      >
        <div css={align}>
          <KravToken />
          <span
            css={css`
              font-weight: 500;
              font-size: 20px;
            `}
          >
            &nbsp;{getBigNumberStr(kravRewardInfo.amount, 2)} KRAV
          </span>
          <span>($0.00)</span>
        </div>
        {!account && <KRAVButton sx={{ height: '30px', minHeight: '30px', width: '129px' }}>Connect Wallet</KRAVButton>}
        {account && (
          <KRAVButton
            disabled={!kravRewardInfo.claimEnable}
            onClick={async () => {
              await claimMethod(isTrade)
            }}
            sx={{ height: '30px', minHeight: '30px', width: '129px' }}
          >
            Claim
          </KRAVButton>
        )}
      </div>
      <div
        css={css`
          background: ${theme.background.second};
        `}
      >
        <p>Rewards get updated everyday at 12:00 AM UTC. </p>
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
