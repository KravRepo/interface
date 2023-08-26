/** @jsxImportSource @emotion/react */
import { align } from '../../globalStyle'
import { css } from '@emotion/react'
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'
import { useCallback, useMemo } from 'react'
import { PoolParams } from '../../store/FactorySlice'
import { useRootStore } from '../../store/root'
import BigNumber from 'bignumber.js'
import { useTheme } from '@mui/material'

type SelectTokenItemProps = {
  pool: PoolParams
  setIsOpen: (isOpenSelectToken: boolean) => void
}

export const SelectTokenItem = ({ pool, setIsOpen }: SelectTokenItemProps) => {
  const theme = useTheme()
  const setTradePool = useRootStore((state) => state.setTradePool)
  const tradePool = useRootStore((state) => state.tradePool)
  const userPositionDatas = useRootStore((state) => state.userPositionDatas)
  const PoolWalletBalance = useMemo(() => {
    return userPositionDatas.find((item) => item.pool?.tradingT === pool?.tradingT)?.walletBalance ?? new BigNumber(0)
  }, [userPositionDatas, pool])

  const handleSelectPool = useCallback((pool: PoolParams) => {
    setTradePool(pool)
    setIsOpen(false)
  }, [])

  return (
    <div
      key={pool.tokenT}
      onClick={() => {
        handleSelectPool(pool)
      }}
    >
      <div css={align}>
        <img
          css={css`
            border-radius: 50%;
            background: ${theme.palette.mode === 'dark' ? '#fff' : ''};
          `}
          src={pool.logoSource}
          height="40"
          width="40"
        />
        <div
          css={css`
            margin-left: 12px;
          `}
        >
          <p>{pool.symbol}</p>
          <p className="grey">{pool.symbol}</p>
        </div>
      </div>
      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <span>{PoolWalletBalance.toFixed(4) || 0}</span>
        {tradePool?.tradingT === pool?.tradingT && (
          <DoneOutlinedIcon sx={{ color: theme.palette.mode === 'dark' ? '#dedede' : '#2832f5' }} />
        )}
      </div>
    </div>
  )
}
