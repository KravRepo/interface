/** @jsxImportSource @emotion/react */
import KRAVButton from '../KravUIKit/KravButton'
import { css, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { MarketOrder } from './MarketOrder'
import { TradeHistory } from './TradeHistory'
import { useNavigate } from 'react-router-dom'
import { LimitOrder } from './LimitOrder'
import { useRootStore } from '../../store/root'

export const MyOrder = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
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
          To trade
        </KRAVButton>
      </p>
      <div
        css={css` overflow: ${isMobile ? 'auto' : ''};
            &::-webkit-scrollbar {
            display: none
            },`}
      >
        <div
          css={css`
            padding-left: 24px;
            background: ${theme.palette.mode === 'dark' ? '#1c1e23' : '#f1f1f1'};
            min-width: ${isMobile ? '1200px' : ''};
          `}
        >
          <Tabs
            value={infoType}
            onChange={handleChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.mode === 'dark' ? '#dedede' : '#000',
              },
              '& .Mui-selected': {
                color: theme.text.primary + '!important',
              },
            }}
          >
            <Tab
              sx={{
                minWidth: 0,
                fontFamily: 'Inter',
                padding: '12px 0',
                mr: '16px',
                color: '#757575',
              }}
              label={`Positions ${useAllOpenTradesCount > 0 ? '(' + useAllOpenTradesCount + ')' : ''}`}
            />
            <Tab
              sx={{
                minWidth: 0,
                mr: '16px',
                fontFamily: 'Inter',
                padding: '12px 0',
                color: '#757575',
              }}
              label={`Orders ${userAllOpenLimitCount > 0 ? '(' + userAllOpenLimitCount + ')' : ''}`}
            />
            <Tab
              sx={{
                minWidth: 0,
                fontFamily: 'Inter',
                padding: '12px 0',
                color: '#757575',
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
