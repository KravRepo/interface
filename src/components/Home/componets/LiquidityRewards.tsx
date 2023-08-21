/** @jsxImportSource @emotion/react */
import KRAVTab from '../../KravUIKit/KravTab'
import { formatNumber, getBigNumberStr } from '../../../utils'
import { ReactComponent as AlertIcon } from '../../../assets/imgs/alert.svg'
import { ReactComponent as QuestionIcon } from '../../../assets/imgs/question.svg'
import { ReactComponent as ArrowLeft } from '../../../assets/imgs/arrowLeft.svg'
import { ReactComponent as ArrowLeftDark } from '../../../assets/imgs/darkModel/arrow_left_dark.svg'
import KRAVHollowButton from '../../KravUIKit/KravHollowButton'
import { ReactComponent as BoostIcon } from '../../../assets/imgs/boost_icon.svg'
import { align } from '../../../globalStyle'
import { KravRewardCard } from './KravRewardCard'
import { css, useTheme } from '@mui/material'
import BigNumber from 'bignumber.js'
import { OverviewData } from '../../../hook/hookV8/useGetTotalMarketOverview'
import { UserAssetOverview } from '../../../hook/hookV8/useGetUserAssetOverview'
import { useGetAllLpReward } from '../../../hook/hookV8/useGetLpReward'
import { useNavigate } from 'react-router-dom'

type LiquidityRewardsProps = {
  lpRewardAmount: BigNumber
  contractAmount: BigNumber
  claimLpRewardKrav: (isTrade: boolean) => Promise<void>
  overviewData: OverviewData
  userAssetOverview: UserAssetOverview
  LpBooster: BigNumber
}
export const LiquidityRewards = ({
  lpRewardAmount,
  contractAmount,
  claimLpRewardKrav,
  overviewData,
  userAssetOverview,
  LpBooster,
}: LiquidityRewardsProps) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { userFeesRewardList } = useGetAllLpReward()
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
            <p className="data gt">{formatNumber(overviewData.liquiditySupply, 2, true)}</p>
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
            <p className="data gt">{formatNumber(userAssetOverview.balance, 2, true)}</p>
          </div>
          <div
            css={css`
              border-left: ${theme.splitLine.primary};
            `}
          >
            <KRAVTab>Share of pool</KRAVTab>
            <p className="data gt">
              {formatNumber(Number(userAssetOverview.balance) / overviewData.liquiditySupply, 2, false)} %
            </p>
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
                {getBigNumberStr(LpBooster, 2)}
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
              margin-top: 25px;
              min-height: 144px;
              max-height: 144px;
              overflow: auto;
              &::-webkit-scrollbar {
                display: none
              },
            `}
          >
            {userFeesRewardList.length > 0 &&
              userFeesRewardList.map((list) => {
                return (
                  <div key={list.position.pool.tradingT} className="reward-item">
                    <img
                      css={css`
                        border-radius: 50%;
                        background: ${theme.palette.mode === 'dark' ? '#fff' : ''};
                      `}
                      src={list.position.pool.logoSource}
                      height="32"
                      width="32"
                    />
                    <span>
                      &nbsp;&nbsp;{formatNumber(list.rewardAmount.toString(), 2)} {list.position.pool.symbol}
                    </span>
                  </div>
                )
              })}
            {userFeesRewardList.length === 0 && (
              <div
                css={css`
                  text-align: center;
                  padding-top: 40px;
                  color: ${theme.text.second};
                `}
              >
                No Fees Reward
              </div>
            )}
          </div>
          <div className="flex">
            <div
              css={css`
                padding-right: 36px;
              `}
            >
              {'Please go to the "dashboard" page to claim the fee income'}
            </div>
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
                  onClick={() => navigate('/portfolio')}
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
                  onClick={() => navigate('/portfolio')}
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
