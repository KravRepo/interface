/** @jsxImportSource @emotion/react */
import KRAVButton from '../KravUIKit/KravButton'
import { css, Tab, Tabs } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { MarketOrder } from './MarketOrder'
import { TradeHistory } from './TradeHistory'
import { useNavigate } from 'react-router-dom'
import { LimitOrder } from './LimitOrder'
import { useRootStore } from '../../store/root'

export const MyOrder = () => {
  const [infoType, setInfoType] = useState(0)
  const navigate = useNavigate()
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setInfoType(newValue)
  }
  const useAllOpenTrades = useRootStore((state) => state.userAllOpenTradeList)
  const userAllOpenLimitList = useRootStore((state) => state.userAllOpenLimitList)
  const useAllOpenTradesCount = useMemo(() => {
    let count = 0
    useAllOpenTrades.forEach((trades) => {
      count += trades.tuple.length
    })
    return count
  }, [useAllOpenTrades])

  const userAllOpenLimitCount = useMemo(() => {
    let count = 0
    userAllOpenLimitList.forEach((trades) => {
      count += trades.tuple.length
    })
    return count
  }, [userAllOpenLimitList])
  return (
    <div className="my-order">
      <p
        className="title"
        css={css`
          display: flex;
          justify-content: space-between;
          padding-bottom: 33px;
        `}
      >
        <span>My Order</span>
        <KRAVButton onClick={() => navigate('/trade')} sx={{ width: '83px' }}>
          to trade
        </KRAVButton>
      </p>
      <div>
        <div
          css={css`
            padding-left: 24px;
            background: #f1f1f1;
          `}
        >
          <Tabs
            value={infoType}
            onChange={handleChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#000',
              },
              '& .Mui-selected': {
                color: '#000!important',
              },
            }}
          >
            <Tab
              sx={{
                minWidth: 0,
                fontFamily: 'Inter',
                padding: '12px 0',
                mr: '16px',
                '& .MuiTab-root': {
                  color: '#757575',
                },
              }}
              label={`Positions ${useAllOpenTradesCount > 0 ? '(' + useAllOpenTradesCount + ')' : ''}`}
            />
            <Tab
              sx={{
                minWidth: 0,
                mr: '16px',
                fontFamily: 'Inter',
                padding: '12px 0',
                '& .MuiTab-root': {
                  color: '#757575',
                },
              }}
              label={`Orders ${userAllOpenLimitCount > 0 ? '(' + userAllOpenLimitCount + ')' : ''}`}
            />
            <Tab
              sx={{
                minWidth: 0,
                fontFamily: 'Inter',
                padding: '12px 0',
                '& .MuiTab-root': {
                  color: '#757575',
                },
              }}
              label="Trades"
            />
          </Tabs>
        </div>
        {infoType === 0 && <MarketOrder />}
        {infoType === 1 && <LimitOrder />}
        {infoType === 2 && <TradeHistory />}
      </div>
    </div>
  )
}
