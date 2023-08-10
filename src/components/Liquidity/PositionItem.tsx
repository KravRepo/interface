/** @jsxImportSource @emotion/react */
import { align } from '../../globalStyle'
import { css } from '@emotion/react'
import { Button, Tooltip, useTheme } from '@mui/material'
import { ReactComponent as AddIcon } from '../../assets/imgs/addIcon.svg'
import { ReactComponent as SubIcon } from '../../assets/imgs/subIcon.svg'
import { PositionItemProps } from './type'
import { useRootStore } from '../../store/root'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'
import { WITHDRAW_BLOCK_DIFF } from '../../constant/math'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'

export const PositionItem = ({ position, setAddLiquidity, setRemoveLiquidity, aprList }: PositionItemProps) => {
  const theme = useTheme()
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

  return (
    <div className="liquidity-table">
      <div css={align}>
        <img
          css={css`
            border-radius: 50%;
            background: ${theme.palette.mode === 'dark' ? '#fff' : ''};
          `}
          src={position.pool.logoSource}
          height="40"
          width="40"
        />
        <div
          css={css`
            margin-left: 8px;
          `}
        >
          <p>{position.pool.symbol}</p>
          <p className="small grey">{position.pool.symbol}</p>
        </div>
      </div>
      {/*<div>*/}
      {/*  1 BTC={position.pool.proportionBTC} {position.pool.symbol}*/}
      {/*</div>*/}
      <div>{apr.toFixed(2)}%</div>
      <div>{position.pool.utilization.toFixed(2)}%</div>
      <div>
        <p>
          {eXDecimals(position.daiDeposited, position.pool.decimals).toFixed(2)} {position.pool.symbol}
        </p>
        {/*<p className="small grey">*/}
        {/*  ({eXDecimals(position.daiDeposited, position.pool.decimals).div(position.pool.proportionBTC).toFixed(2)}*/}
        {/*  &nbsp;BTC)*/}
        {/*</p>*/}
      </div>
      <div>
        <Tooltip
          title={`When withdrawing liquidity, you can only remove 25% of your provided liquidity at a time. Furthermore,
                there must be a minimum of 43,200 blocks in between two consecutive withdrawals. These rules help ensure
                a stable and fair trading environment on our platform.`}
        >
          <span css={align}>
            {lockAmount.isGreaterThan(0)
              ? eXDecimals(new BigNumber(maxWithdrawAmount), position.pool.decimals).toFixed(2)
              : eXDecimals(position.daiDeposited, position.pool.decimals).toFixed(2)}
            {position.pool.symbol}
            <HelpOutlineOutlinedIcon sx={{ height: '12px', width: '12px', ml: '4px' }} />
          </span>
        </Tooltip>
      </div>

      <div>
        <Tooltip title={`Current block: ${position.pool.blockNumber}`}>
          <span>
            {position.withdrawBlock.plus(WITHDRAW_BLOCK_DIFF).isGreaterThan(position.pool.blockNumber)
              ? position.withdrawBlock.plus(WITHDRAW_BLOCK_DIFF).minus(position.pool.blockNumber).toFixed(0)
              : '0'}
          </span>
        </Tooltip>
      </div>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: end;
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
            margin: '12px',
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
  )
}
