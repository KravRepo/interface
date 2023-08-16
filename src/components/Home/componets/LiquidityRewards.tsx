/** @jsxImportSource @emotion/react */
import KRAVTab from '../../KravUIKit/KravTab'
import { formatNumber } from '../../../utils'
import { ReactComponent as AlertIcon } from '../../../assets/imgs/alert.svg'
import { ReactComponent as KravToken } from '../../../assets/imgs/krav_token.svg'
import { ReactComponent as QuestionIcon } from '../../../assets/imgs/question.svg'
import { ReactComponent as ArrowLeft } from '../../../assets/imgs/arrowLeft.svg'
import { ReactComponent as ArrowLeftDark } from '../../../assets/imgs/darkModel/arrow_left_dark.svg'
import KRAVHollowButton from '../../KravUIKit/KravHollowButton'
import { ReactComponent as BoostIcon } from '../../../assets/imgs/boost_icon.svg'
import { align } from '../../../globalStyle'
import { KravRewardCard } from './KravRewardCard'
import { css, useTheme } from '@mui/material'
import BigNumber from 'bignumber.js'

type LiquidityRewardsProps = {
  lpRewardAmount: BigNumber
  contractAmount: BigNumber
  claimLpRewardKrav: (isTrade: boolean) => Promise<void>
}
export const LiquidityRewards = ({ lpRewardAmount, contractAmount, claimLpRewardKrav }: LiquidityRewardsProps) => {
  const theme = useTheme()
  return (
    <>
      <div>
        <div
          css={css`
            margin: 40px 0;
          `}
          className="title gt"
        >
          Liquidity Provider Rewards
        </div>
        <div
          className="overview-card"
          css={css`
            background: ${theme.background.primary};
          `}
        >
          <div>
            <KRAVTab>Total Liquidity Provider</KRAVTab>
            <p className="data gt">{formatNumber('23102.23', 2, false)}%</p>
          </div>
          <div
            css={css`
              border-left: ${theme.splitLine.primary};
            `}
          >
            <div css={[align]}>
              <KRAVTab>Your Liquidity Provider</KRAVTab>
              &nbsp;&nbsp;
              <AlertIcon />
            </div>
            <p className="data gt">{formatNumber('12345.00', 2, false)} KRAV</p>
          </div>
          <div
            css={css`
              border-left: ${theme.splitLine.primary};
            `}
          >
            <KRAVTab>Share of pool</KRAVTab>
            <p className="data gt">{formatNumber(' 23102345.00', 2, false)}KRAV</p>
          </div>
          <div
            css={css`
              border-left: ${theme.splitLine.primary};
            `}
          >
            <div css={[align]}>
              <KRAVTab>My Boost</KRAVTab>
              &nbsp;&nbsp;
              <QuestionIcon />
            </div>
            <p
              className="data gt"
              css={[
                align,
                css`
                  justify-content: space-between;
                  padding-top: 0 !important;
                `,
              ]}
            >
              <span
                css={css`
                  padding-top: 2px;
                `}
                className="data gt"
              >
                {formatNumber('12345.00', 2, false)} KRAV
              </span>
              <KRAVHollowButton sx={{ borderRadius: '100px', width: '96px', height: '30px', minHeight: '30px' }}>
                <span
                  css={css`
                    min-width: 24px;
                  `}
                >
                  Boost&nbsp;
                </span>
                <BoostIcon />
              </KRAVHollowButton>
            </p>
          </div>
        </div>
      </div>
      <div css={[align]} className="liquidity-reward-action">
        <KravRewardCard
          isTrade={false}
          backendAmount={lpRewardAmount}
          contractAmount={contractAmount}
          claimMethod={claimLpRewardKrav}
        />
        <div
          className="fees-rewards"
          css={css`
            background: ${theme.background.primary};
          `}
        >
          <div className="flex">
            <div className="title gt">Fees Rewards</div>
            <div css={align}>
              <span>What is this?&nbsp;&nbsp;</span>
              <QuestionIcon />
            </div>
          </div>
          <div
            css={css`
              > div:last-of-type {
                border-bottom: unset;
              }
              > div {
                border-bottom: ${theme.splitLine.primary};
              }
            `}
          >
            <div className="reward-item">
              <KravToken
                css={css`
                  height: 32px;
                  width: 32px;
                `}
              />
              <span>&nbsp;&nbsp;1200 DOGE</span>
            </div>
            <div className="reward-item">
              <KravToken
                css={css`
                  height: 32px;
                  width: 32px;
                `}
              />
              <span>&nbsp;&nbsp;1200 DOGE</span>
            </div>
            <div className="reward-item">
              <KravToken
                css={css`
                  height: 32px;
                  width: 32px;
                `}
              />
              <span>&nbsp;&nbsp;1200 DOGE</span>
            </div>
          </div>
          <div className="flex">
            <div>{'Please go to the "liquidity" page to claim the fee income'}</div>
            <div css={align}>
              <span
                css={css`
                  font-weight: 500;
                  font-size: 16px;
                  white-space: nowrap;
                  margin-right: 8px;
                `}
              >
                VIEW MORE
              </span>
              {theme.palette.mode === 'dark' ? (
                <ArrowLeftDark
                  className="poolArrow"
                  css={css`
                    cursor: pointer;
                    :hover {
                      transform: scale(1.1);
                    }
                  `}
                />
              ) : (
                <ArrowLeft
                  className="poolArrow"
                  css={css`
                    cursor: pointer;
                    margin-left: 16px;
                    :hover {
                      transform: scale(1.1);
                    }
                  `}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
