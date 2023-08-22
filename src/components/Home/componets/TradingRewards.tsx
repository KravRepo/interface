/** @jsxImportSource @emotion/react */
import KRAVTab from '../../KravUIKit/KravTab'
import { formatNumber, getBigNumberStr } from '../../../utils'
import { ReactComponent as AlertIcon } from '../../../assets/imgs/alert.svg'
import { ReactComponent as QuestionIcon } from '../../../assets/imgs/question.svg'
import KRAVHollowButton from '../../KravUIKit/KravHollowButton'
import { ReactComponent as BoostIcon } from '../../../assets/imgs/boost_icon.svg'
import { KravRewardCard } from './KravRewardCard'
import { css, Tooltip, useTheme } from '@mui/material'
import { align } from '../../../globalStyle'
import BigNumber from 'bignumber.js'
import { OverviewData } from '../../../hook/hookV8/useGetTotalMarketOverview'

type TradingRewardsProps = {
  lpRewardAmount: BigNumber
  contractAmount: BigNumber
  claimTradingRewardKrav: (isTrade: boolean) => Promise<void>
  overviewData: OverviewData
  userTradingVolume24H: number
  tradeBooster: BigNumber
  nextEpoch: number
}
export const TradingRewards = ({
  lpRewardAmount,
  contractAmount,
  claimTradingRewardKrav,
  overviewData,
  userTradingVolume24H,
  tradeBooster,
  nextEpoch,
}: TradingRewardsProps) => {
  const theme = useTheme()
  return (
    <>
      <div
        css={css`
          margin-bottom: 40px;
        `}
      >
        <p className="title gt">Trading Rewards</p>
        <p
          css={css`
            margin-top: 12px;
          `}
        >
          Earn trading rewards when you trade on KRAV. Rewards are calculated and distributed once daily.
        </p>
      </div>
      <div
        className="overview-card"
        css={css`
          background: ${theme.background.primary};
        `}
      >
        <div>
          <KRAVTab>Total Trading Volume</KRAVTab>
          <p className="data gt">{formatNumber(overviewData.tradingVolume, 2, true)}</p>
        </div>
        <div
          css={css`
            border-left: ${theme.splitLine.primary};
          `}
        >
          <KRAVTab>24h Trading Volume</KRAVTab>
          <p className="data gt">{formatNumber(overviewData.tradingVolume24H, 2, true)}</p>
        </div>
        <div
          css={css`
            border-left: ${theme.splitLine.primary};
          `}
        >
          <div css={[align]}>
            <KRAVTab>Your 24h Trading Volume</KRAVTab>
            &nbsp;&nbsp;
            <AlertIcon />
          </div>
          <p className="data gt">{formatNumber(userTradingVolume24H, 2, true)}</p>
        </div>
        <div
          css={css`
            border-left: ${theme.splitLine.primary};
          `}
        >
          <Tooltip
            title={
              'Locking KRAV can get krav income and veKRAV rights and interests, which can Boost your yield up to 2.5x'
            }
          >
            <div css={[align]}>
              <KRAVTab>My Boost</KRAVTab>
              &nbsp;&nbsp;
              <QuestionIcon />
            </div>
          </Tooltip>
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
                padding-top: 10px;
              `}
            >
              {getBigNumberStr(tradeBooster, 2)}
            </span>
            <KRAVHollowButton sx={{ borderRadius: '100px', width: '96px', height: '30px', minHeight: '30px' }}>
              <span>Boost&nbsp;</span>
              <BoostIcon
                css={css`
                  min-width: 24px;
                `}
              />
            </KRAVHollowButton>
          </p>
        </div>
      </div>
      <div
        css={css`
          width: 50%;
        `}
      >
        <KravRewardCard
          isTrade={true}
          backendAmount={lpRewardAmount}
          contractAmount={contractAmount}
          claimMethod={claimTradingRewardKrav}
          nextEpoch={nextEpoch}
        />
      </div>
    </>
  )
}
