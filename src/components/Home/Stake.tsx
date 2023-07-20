/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'
import DashboardBg from '../../assets/imgs/dashboard_bg.png'
import { ReactComponent as DogeIcon } from 'assets/imgs/tokens/doge.svg'
import KRAVButton from '../KravUIKit/KravButton'
import { stake } from './style'
import { align } from '../../globalStyle'
import { Button } from '@mui/material'
import { ReactComponent as AddIcon } from '../../assets/imgs/addIcon.svg'
import { ReactComponent as SubIcon } from '../../assets/imgs/subIcon.svg'
import { ReactComponent as ArrowRight } from '../../assets/imgs/arrowRight.svg'

export const Stake = () => {
  const [hasStake, setHasStake] = useState(true)
  return (
    <div css={stake}>
      <div onClick={() => setHasStake(!hasStake)} className="title">
        My Staking
      </div>
      {hasStake && (
        <div>
          <div className="overview">
            <div>
              <span>Total Staked</span>
              <span>≈ $246,556,893.30</span>
            </div>
          </div>
          <div>
            <div
              css={css`
                margin: 24px 0;
              `}
              className="grid-layout grey"
            >
              <span>ASSET</span>
              <span>POOL TOTAL STAKED</span>
              <span>YOUR STAKED</span>
              <span>APR</span>
              <span>REWARD</span>
            </div>
            <div className="grid-layout">
              <div css={align}>
                <DogeIcon />
                <div
                  css={css`
                    margin-left: 12px;
                  `}
                >
                  <p>KRAV</p>
                  <p className="grey">Krav coin</p>
                </div>
              </div>
              <div>
                <p>2,000.00 KRAV</p>
                <p className="grey">($236,123.00)</p>
              </div>
              <div>2,000,000 KRAV</div>
              <div>12.32%</div>
              <div>2,000.00 KRAV</div>
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  justify-content: end;
                  white-space: nowrap;
                `}
              >
                <Button
                  sx={{ height: '32px', width: '32px', minWidth: '32px', border: '1px solid #2E2E2E', margin: '12px' }}
                >
                  <AddIcon height="17" width="17" />
                </Button>
                <Button sx={{ height: '32px', width: '32px', minWidth: '32px', border: '1px solid #2E2E2E' }}>
                  <SubIcon height="17" width="17" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!hasStake && (
        <div
          className="no-stake"
          css={css`
            background: url(${DashboardBg}), no-repeat, #f1f1f1;
          `}
        >
          <p>You have no Staked Krav</p>
          <KRAVButton sx={{ width: '113px', mt: '32px', mb: '25px', zIndex: 3 }}>Staking Krav</KRAVButton>
          <p>
            <span
              css={css`
                font-family: 'Inter';
                font-size: 16px;
                font-weight: 500;
                display: flex;
                align-items: center;
                justify-content: center;
              `}
            >
              Learn more about Staking Krav&nbsp; <ArrowRight />
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
