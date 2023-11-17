/** @jsxImportSource @emotion/react */
import { css, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Positions } from './Positions'
import { Orders } from './Orders'
import { HistoryData, TradeHistory } from './TradeHistory'
import { myTrade } from './style'
import { useRootStore } from '../../../store/root'
import { useGetUserOpenTrade } from '../../../hook/hookV8/useGetUserOpenTrade'
import { useGetUserOpenLimitOrders } from '../../../hook/hookV8/useGetUserOpenLimitOrders'
import { useInterval } from '../../../hook/hookV8/useInterval'
import { useWeb3React } from '@web3-react/core'

export const MyTrade = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [infoType, setInfoType] = useState(0)
  const { provider, account, chainId } = useWeb3React()
  const [historyList, setHistoryList] = useState<HistoryData[]>([])
  const userOpenTradeList = useRootStore((state) => state.userOpenTradeList)
  const userOpenLimitList = useRootStore((state) => state.userOpenLimitList)
  const tradePool = useRootStore((store) => store.tradePool)
  const tradePairIndex = useRootStore((store) => store.tradePairIndex)
  const expectChainId = useRootStore((store) => store.expectChainId)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setInfoType(newValue)
  }
  const { getUserOpenTrade } = useGetUserOpenTrade()
  const { getUserOpenLimitOrders } = useGetUserOpenLimitOrders()
  useInterval(async () => {
    await getUserOpenTrade(tradePool.storageT, true)
  }, 15000)
  useInterval(async () => {
    await getUserOpenLimitOrders(tradePool.storageT, true)
  }, 15000)

  useEffect(() => {
    if (provider && account && tradePool.storageT && expectChainId === chainId) {
      getUserOpenLimitOrders(tradePool.storageT, true).then()
    }
  }, [provider, account, tradePairIndex, tradePool, expectChainId, chainId])

  useEffect(() => {
    if (provider && account && tradePool.storageT && expectChainId === chainId) {
      getUserOpenTrade(tradePool.storageT, true).then()
    }
  }, [provider, account, tradePairIndex, tradePool, expectChainId, chainId])

  return (
    <div
      css={[
        myTrade,
        css`
          background: ${theme.background.primary};
          overflow: ${isMobile ? 'auto' : ''};
          &::-webkit-scrollbar {
            display: none
          },
        `,
      ]}
    >
      <div
        css={css`
          padding-left: 24px;
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
              color: '#FFB800!important',
            },
          }}
        >
          <Tab
            sx={{
              minWidth: 0,
              fontFamily: 'Inter',
              padding: '20px 0 8px 0',
              color: '#757575',
              mr: '16px',
              '& .MuiTab-root': {
                color: '#757575',
              },
            }}
            label={`Positions ${userOpenTradeList.length > 0 ? '(' + userOpenTradeList.length + ')' : ''}`}
          />
          <Tab
            sx={{
              minWidth: 0,
              mr: '16px',
              fontFamily: 'Inter',
              padding: '20px 0 8px 0',
              color: '#757575',
              '& .MuiTab-root': {
                color: '#757575',
              },
            }}
            label={`Orders ${userOpenLimitList.length > 0 ? '(' + userOpenLimitList.length + ')' : ''}`}
          />
          <Tab
            sx={{
              minWidth: 0,
              fontFamily: 'Inter',
              padding: '20px 0 8px 0',
              color: '#757575',
              '& .MuiTab-root': {
                color: '#757575',
              },
            }}
            label="Trades"
          />
        </Tabs>
      </div>
      <>
        {infoType === 0 && <Positions />}
        {infoType === 1 && <Orders />}
        {infoType === 2 && <TradeHistory historyList={historyList} setHistoryList={setHistoryList} />}
      </>
    </div>
  )
}
