/** @jsxImportSource @emotion/react */
import { ReactComponent as QuestionIcon } from '../../../assets/imgs/question.svg'
import { ReactComponent as KravToken } from '../../../assets/imgs/krav_token.svg'
import KRAVButton from '../../KravUIKit/KravButton'
import { useTheme } from '@mui/material'
import { css } from '@emotion/react'
import { align } from '../../../globalStyle'

export const KravRewardCard = () => {
  const theme = useTheme()
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
            &nbsp;0 KRAV
          </span>
          <span>($0.00)</span>
        </div>
        <KRAVButton sx={{ height: '30px', minHeight: '30px', width: '129px' }}>Connect Wallet</KRAVButton>
      </div>
      <div
        css={css`
          background: ${theme.background.second};
        `}
      >
        <p>Rewards get updated everyday at 12:00 AM UTC. </p>
        <p>
          <span>Next distribution:</span>
          <span>18 hours 21 minutes</span>
        </p>
      </div>
    </div>
  )
}
