/** @jsxImportSource @emotion/react */
import { align } from '../../globalStyle'
import { ReactComponent as BALDIcon } from '../../assets/imgs/tokens/Bald.svg'
import { css } from '@emotion/react'
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'
import React, { Dispatch, useCallback, useMemo } from 'react'
import { PoolParams } from '../../store/FactorySlice'
import { useRootStore } from '../../store/root'
import BigNumber from 'bignumber.js'

type SelectTokenItemProps = {
  pool: PoolParams
  setIsOpen: Dispatch<React.SetStateAction<boolean>>
}

export const SelectTokenItem = ({ pool, setIsOpen }: SelectTokenItemProps) => {
  const setTradePool = useRootStore((state) => state.setTradePool)
  const tradePool = useRootStore((state) => state.tradePool)
  const userPositionDatas = useRootStore((state) => state.userPositionDatas)
  const PoolWalletBalance = useMemo(() => {
    return userPositionDatas.find((item) => item.pool?.tradingT === pool?.tradingT)?.walletBalance ?? new BigNumber(0)
  }, [userPositionDatas, pool])

  const handleSelectPool = useCallback((pool: PoolParams) => {
    setTradePool(pool)
    localStorage.setItem('trade-pool', pool.tradingT)
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
        <BALDIcon height="40" width="40" />
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
        {tradePool?.tradingT === pool?.tradingT && <DoneOutlinedIcon sx={{ color: '#2832f5' }} />}
      </div>
    </div>
  )
}
