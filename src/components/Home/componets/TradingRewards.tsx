/** @jsxImportSource @emotion/react */
import KRAVTab from '../../KravUIKit/KravTab'
import { formatNumber, getBigNumberStr } from '../../../utils'
import { ReactComponent as AlertIcon } from '../../../assets/imgs/alert.svg'
import { ReactComponent as QuestionIcon } from '../../../assets/imgs/question.svg'
import KRAVHollowButton from '../../KravUIKit/KRAVHollowButton'
import { ReactComponent as BoostIcon } from '../../../assets/imgs/boost_icon.svg'
import { KravRewardCard } from './KravRewardCard'
import { Box, css, Popover, Tooltip, useTheme } from '@mui/material'
import { align } from '../../../globalStyle'
import BigNumber from 'bignumber.js'
import { OverviewData } from '../../../hook/hookV8/useGetTotalMarketOverview'
import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'

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
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = useMemo(() => {
    return Boolean(anchorEl)
  }, [anchorEl])
  return (
    <>
      <div
        css={css`
          margin-bottom: 40px;
        `}
      >
        <p className="title gt">Daily Trading Rewards</p>
        <p
          css={css`
            margin-top: 12px;
          `}
        >
          Trade on KRAV and reap daily trading rewards. Calculations and distributions occur once a day.
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
          <Box
            sx={{ display: 'flex', alignItems: 'center' }}
            aria-owns={open ? 'mouse-over-popover' : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <KRAVTab>Your 24h Trading Volume</KRAVTab>
            &nbsp;&nbsp;
            <AlertIcon />
          </Box>
          <Popover
            id="mouse-over-popover"
            sx={{
              pointerEvents: 'none',
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <div
              css={css`
                width: 360px;
                padding: 12px 16px;
                border-radius: 8px;
              `}
            >
              <div
                css={css`
                  font-size: 12px;
                  padding-bottom: 16px;
                `}
              >
                When actually distributing income, calculate your ratio according to your trading volume after boost
              </div>
              <div
                css={css`
                  font-size: 14px;
                  padding-bottom: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                `}
              >
                <span>Actual trading volume</span>
                <span
                  css={css`
                    font-size: 16px;
                    font-weight: 500;
                  `}
                >
                  {formatNumber(userTradingVolume24H, 2)}
                </span>
              </div>
              <div
                css={css`
                  font-size: 14px;
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                `}
              >
                <span>Trading volume after boost</span>
                <span
                  css={css`
                    font-size: 16px;
                    font-weight: 500;
                  `}
                >
                  {formatNumber(
                    tradeBooster.isEqualTo(0)
                      ? userTradingVolume24H
                      : tradeBooster.times(userTradingVolume24H).toNumber(),
                    2,
                    true
                  )}
                </span>
              </div>
            </div>
          </Popover>
          {/*<div css={[align]}>*/}
          {/*  <KRAVTab>Your 24h Trading Volume</KRAVTab>*/}
          {/*  &nbsp;&nbsp;*/}
          {/*  <AlertIcon />*/}
          {/*</div>*/}
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
            <KRAVHollowButton
              onClick={() => navigate('/portfolio/stake')}
              sx={{ borderRadius: '100px', width: '96px', height: '30px', minHeight: '30px' }}
            >
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
