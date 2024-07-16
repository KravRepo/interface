/** @jsxImportSource @emotion/react */
import { marketCard } from './style'
import { Button, css, Tooltip, useMediaQuery, useTheme } from '@mui/material'
import { getBigNumberStr } from '../../utils'
import { PositionItemProps } from './type'
import { useRootStore } from '../../store/root'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'
import { ReactComponent as AddIcon } from '../../assets/imgs/addIcon.svg'
import { WITHDRAW_BLOCK_DIFF } from '../../constant/math'
import { ReactComponent as SubIcon } from '../../assets/imgs/subIcon.svg'
import { align } from '../../globalStyle'
// import { useGetLpReward } from '../../hook/hookV8/useGetLpReward'
// import { useHarvestLpReward } from '../../hook/hookV8/useHarvestLpReward'
import { useGetMarketStats } from '../../hook/hookV8/useGetMarketStats'
import { t } from '@lingui/macro'
import { usePnl } from '../../hook/hookV8/usePnl'

export const PositionItemCard = ({
  position,
  setAddLiquidity,
  setRemoveLiquidity,
  aprList,
  kTokenAddress,
}: PositionItemProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const userPositionDatas = useRootStore((store) => store.userPositionDatas)
  const { tokenAmount } = usePnl(kTokenAddress)
  // const [setLpReward] = useState(new BigNumber(0))
  // const claimLp = useHarvestLpReward(position.pool.vaultT)
  const poolSupply = useMemo(() => {
    const supply =
      userPositionDatas.find((item) => item.pool?.tradingT === position.pool?.tradingT)?.daiDeposited ??
      new BigNumber(0)
    return eXDecimals(supply, position.pool.decimals)
  }, [position, userPositionDatas])

  const setLiquidityInfo = useRootStore((store) => store.setLiquidityInfo)

  const maxWithdrawAmount = useMemo(() => {
    return position.maxDaiDeposited.times(position.pool.maxWithdrawP.div(100)).toNumber() ?? new BigNumber(0)
  }, [position])

  const lockAmount = useMemo(() => {
    if (position) {
      const lockedAmount = position.daiDeposited.minus(maxWithdrawAmount)
      return eXDecimals(lockedAmount.isGreaterThan(0) ? lockedAmount : position.daiDeposited, position.pool.decimals)
    } else {
      return new BigNumber(0)
    }
  }, [maxWithdrawAmount, position])

  const apr = useMemo(() => {
    const res = aprList.find((list) => list?.tradingT === position?.pool?.tradingT)
    if (res) return res.apr
    else return new BigNumber(0)
  }, [aprList, position?.pool?.tradingT])

  // useGetLpReward(position.pool.vaultT, position.pool.decimals, poolSupply.isGreaterThan(0) ? setLpReward : undefined)
  const { openDaiLong, openDaiShort } = useGetMarketStats(
    position.pool.storageT,
    position.pool.decimals,
    position.pool.pairInfoT,
    0
  )

  return (
    <div
      css={[
        marketCard,
        css`
          border: ${theme.splitLine.primary};
        `,
      ]}
    >
      <div
        className="card-title"
        css={css`
          border-bottom: ${theme.splitLine.primary};
        `}
      >
        <div>
          <span>{position.pool.symbol}</span>
          <div>
            <span
              css={css`
                color: ${theme.text.second};
                font-size: 12px;
                margin-right: 8px;
              `}
            >
              {t`Utilization`}
            </span>
            <span
              css={css`
                font-size: 16px;
                font-weight: 600;
              `}
            >
              {!openDaiLong ||
              !openDaiShort ||
              isNaN(
                (openDaiLong as any)
                  .plus(openDaiShort as any)
                  .div(position.pool.poolTotalSupply ?? '1')
                  .times(100)
                  .toFixed(2) as any
              ) ||
              !isFinite(
                (openDaiLong as any)
                  .plus(openDaiShort as any)
                  .div(position.pool.poolTotalSupply ?? '1')
                  .times(100)
                  .toFixed(2) as any
              )
                ? 0.0
                : ((openDaiLong as any)
                    .plus(openDaiShort as any)
                    .div(position.pool.poolTotalSupply ?? '1')
                    .times(100)
                    .toFixed(2) as any)}
              %
            </span>
          </div>
        </div>
        <img
          css={css`
            left: calc(50% - ${isMobile ? '24px' : '32px'});
            top: ${isMobile ? '-24px' : '-32px'};
            border-radius: 50%;
          `}
          src={position.pool.logoSource}
          height={isMobile ? '48' : '64'}
          width={isMobile ? '48' : '64'}
        />
      </div>
      <div className="card-content">
        <div className="data">
          <p>{t`Total Liquidity Supply`}</p>
          <p>{position.pool.poolTotalSupply?.toFormat(2, 3)}</p>
        </div>
        <div
          className="data"
          css={css`
            margin-top: 10px;
          `}
        >
          <p>{t`Your Total Liquidity`}</p>
          <div>
            <span
              css={css`
                color: #2832f5;
              `}
            >
              {poolSupply.plus(tokenAmount).toFormat(2, 3)}
            </span>
            <div
              css={css`
                margin-left: auto;
              `}
            >
              <Button
                onClick={() => {
                  setLiquidityInfo(position.pool)
                  setAddLiquidity(true)
                }}
                sx={{
                  height: '32px',
                  width: '32px',
                  minWidth: '32px',
                  border: theme.palette.mode === 'dark' ? '1px solid #dedede' : '1px solid #2E2E2E',
                  margin: '8px',
                  '> svg > path': {
                    fill: theme.palette.mode === 'dark' ? '#dedede' : '',
                  },
                }}
              >
                <AddIcon height="17" width="17" />
              </Button>
              <Button
                disabled={position.withdrawBlock.plus(WITHDRAW_BLOCK_DIFF).isGreaterThan(position.pool.blockNumber)}
                onClick={() => {
                  setLiquidityInfo(position.pool)
                  setRemoveLiquidity(true)
                }}
                sx={{
                  height: '32px',
                  width: '32px',
                  minWidth: '32px',
                  border: theme.palette.mode === 'dark' ? '1px solid #dedede' : '1px solid #2E2E2E',
                  '> svg > path': {
                    fill: theme.palette.mode === 'dark' ? '#dedede' : '',
                  },
                  '&.Mui-disabled': {
                    cursor: 'not-allowed',
                    pointerEvents: 'auto',
                  },
                }}
              >
                <SubIcon height="17" width="17" />
              </Button>
            </div>
          </div>
        </div>

        <div
          css={css`
            background: ${theme.background.second};
            margin-top: 10px;
            > div {
              flex-wrap: wrap;
            }
          `}
          className="stake-info"
        >
          {/* <div>
            <span
              css={css`
                color: ${theme.text.second};
              `}
            >
              PnL
            </span>
            <span>{pnl.toFixed(2)}%</span>
          </div> */}
          <div>
            <span
              css={css`
                color: ${theme.text.second};
                whitespace: nowrap;
              `}
            >
              {t`Initial Supply`}
            </span>
            <span>
              {poolSupply.toFormat(2, 3)}
              {position.pool.symbol}
            </span>
          </div>
          <div>
            <span
              css={css`
                color: ${theme.text.second};
              `}
            >
              {t`Yield Earned`}
            </span>
            <span>
              {tokenAmount.toFormat(4, 3)}
              {position.pool.symbol}
            </span>
          </div>
          <div>
            <span
              css={css`
                color: ${theme.text.second};
              `}
            >
              {t`Pool Stake`}
            </span>
            <span>
              {(
                (parseFloat(getBigNumberStr(poolSupply, 2)) /
                  parseFloat(position.pool.poolTotalSupply?.toFixed(2) as any)) *
                100
              ).toFixed(2)}
              %
            </span>
          </div>
          <div>
            <span
              css={css`
                color: ${theme.text.second};
              `}
            >
              {t`Withdrawal Limit`}
            </span>
            <Tooltip title={t`short withdraw notice...`}>
              <>
                <img src={position.pool.logoSource} height="24" width="24" style={{ borderRadius: '50%' }} />
                <span css={align}>
                  {lockAmount.isGreaterThan(0)
                    ? eXDecimals(new BigNumber(maxWithdrawAmount), position.pool.decimals).toFormat(2, 3)
                    : eXDecimals(position.daiDeposited, position.pool.decimals).toFormat(2, 3)}
                  {position.pool.symbol}
                </span>
              </>
            </Tooltip>
          </div>
        </div>
        {apr.isGreaterThan(0) && (
          <div className="action">
            <div
              css={css`
                background: ${theme.palette.mode === 'dark' ? '#bde0ba' : '#e7fae5'};
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0px;
              `}
            >
              <span
                css={css`
                  color: ${theme.palette.mode === 'dark' ? '#1c1e23' : '#757575'};
                `}
              >
                APR
              </span>
              <span
                css={css`
                  color: #009b72;
                `}
              >
                {apr.toFixed(2)}%
              </span>
            </div>
            {/* <div
            css={css`
              background: ${theme.background.second};
            `}
          >
            <p
              css={css`
                color: ${theme.text.second};
                margin-top: 10px;
              `}
            >
              Transaction Fee Reward
            </p>
            <div>
              <span>
                {getBigNumberStr(lpReward, 6)} {position.pool.symbol}
              </span>
            </div>
          </div> */}
          </div>
        )}
      </div>
    </div>
  )
}
