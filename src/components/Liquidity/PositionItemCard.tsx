/** @jsxImportSource @emotion/react */
import { marketCard } from './style'
import { Button, css, Tooltip, useMediaQuery, useTheme } from '@mui/material'
import { getBigNumberStr } from '../../utils'
import { PositionItemProps } from './type'
import { useRootStore } from '../../store/root'
import { useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'
import { ReactComponent as AddIcon } from '../../assets/imgs/addIcon.svg'
import { WITHDRAW_BLOCK_DIFF } from '../../constant/math'
import { ReactComponent as SubIcon } from '../../assets/imgs/subIcon.svg'
import { align } from '../../globalStyle'
import KRAVButton from '../KravUIKit/KravButton'
import { useGetLpReward } from '../../hook/hookV8/useGetLpReward'
import { useHarvestLpReward } from '../../hook/hookV8/useHarvestLpReward'

export const PositionItemCard = ({ position, setAddLiquidity, setRemoveLiquidity, aprList }: PositionItemProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const userPositionDatas = useRootStore((store) => store.userPositionDatas)
  const getLpReward = useGetLpReward(position.pool.vaultT, position.pool.decimals)
  const [lpReward, setLpReward] = useState(new BigNumber(0))
  const claimLp = useHarvestLpReward(position.pool.vaultT)

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
  }, [position])

  const apr = useMemo(() => {
    const res = aprList.find((list) => list?.tradingT === position?.pool?.tradingT)
    if (res) return res.apr
    else return new BigNumber(0)
  }, [aprList])

  useEffect(() => {
    if (poolSupply.isGreaterThan(0)) {
      getLpReward(setLpReward).then()
    }
  }, [poolSupply])

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
              UTILIZATION
            </span>
            <span
              css={css`
                font-size: 16px;
                font-weight: 600;
              `}
            >
              {isNaN(position.pool.utilization.toNumber()) ? 0 : position.pool.utilization.toFixed(2)}%
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
          <p>TOTAL LIQUIDITY SUPPLY</p>
          <p>{position.pool.poolTotalSupply?.toFixed(2)}</p>
        </div>
        <div className="data">
          <p>YOUR LIQUIDITY SUPPLY</p>
          <div>
            <span
              css={css`
                color: #2832f5;
              `}
            >
              {getBigNumberStr(poolSupply, 2)}
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
          `}
          className="stake-info"
        >
          <div>
            <span
              css={css`
                color: ${theme.text.second};
              `}
            >
              YOUR POOL STAKE
            </span>
            <span>0.025%</span>
          </div>
          <div>
            <span
              css={css`
                color: ${theme.text.second};
              `}
            >
              YOUR WITHDRAW LIMIT
            </span>
            <Tooltip
              title={`When withdrawing liquidity, you can only remove 25% of your provided liquidity at a time. Furthermore,
                there must be a minimum of 43,200 blocks in between two consecutive withdrawals. These rules help ensure
                a stable and fair trading environment on our platform.`}
            >
              <>
                <img src={position.pool.logoSource} height="24" width="24" style={{ borderRadius: '50%' }} />
                <span css={align}>
                  {lockAmount.isGreaterThan(0)
                    ? eXDecimals(new BigNumber(maxWithdrawAmount), position.pool.decimals).toFixed(2)
                    : eXDecimals(position.daiDeposited, position.pool.decimals).toFixed(2)}
                  {position.pool.symbol}
                </span>
              </>
            </Tooltip>
          </div>
          <div>
            <span
              css={css`
                color: ${theme.text.second};
              `}
            >
              WITHDRAW_BLOCK
            </span>
            <Tooltip title={`Current block: ${position.pool.blockNumber}`}>
              <span>
                {position.withdrawBlock.plus(WITHDRAW_BLOCK_DIFF).isGreaterThan(position.pool.blockNumber)
                  ? position.withdrawBlock.plus(WITHDRAW_BLOCK_DIFF).minus(position.pool.blockNumber).toFixed(0)
                  : '0'}
              </span>
            </Tooltip>
          </div>
        </div>
        <div className="action">
          <div
            css={css`
              background: ${theme.palette.mode === 'dark' ? '#bde0ba' : '#e7fae5'};
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
          <div
            css={css`
              background: ${theme.background.second};
            `}
          >
            <p
              css={css`
                color: ${theme.text.second};
              `}
            >
              TRANSACTION FEE REWARD
            </p>
            <div>
              <span>
                {' '}
                {getBigNumberStr(lpReward, 2)} {position.pool.symbol}
              </span>
              <KRAVButton
                disabled={lpReward.isEqualTo(0)}
                onClick={async () => {
                  await claimLp(lpReward, position.pool.symbol)
                  await getLpReward(setLpReward)
                }}
                sx={{ width: '70px', height: '32px' }}
              >
                Claim
              </KRAVButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
