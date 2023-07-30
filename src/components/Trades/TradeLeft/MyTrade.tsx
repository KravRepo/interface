/** @jsxImportSource @emotion/react */
import { css, Tab, Tabs } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Positions } from './Positions'
import { Orders } from './Orders'
import { HistoryData, TradeHistory } from './TradeHistory'
import { myTrade } from './style'
import { useRootStore } from '../../../store/root'
import { useGetUserOpenTrade } from '../../../hook/hookV8/useGetUserOpenTrade'
import { useGetUserOpenLimitOrders } from '../../../hook/hookV8/useGetUserOpenLimitOrders'
import { useWeb3React } from '@web3-react/core'

export const MyTrade = () => {
  const [infoType, setInfoType] = useState(0)
  const [historyList, setHistoryList] = useState<HistoryData[]>([])
  const { account, chainId } = useWeb3React()
  const userOpenTradeList = useRootStore((state) => state.userOpenTradeList)
  const userOpenLimitList = useRootStore((state) => state.userOpenLimitList)
  const tradePool = useRootStore((store) => store.tradePool)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setInfoType(newValue)
  }
  const getUserOpenTrade = useGetUserOpenTrade(tradePool.storageT)
  const getUserOpenLimitOrders = useGetUserOpenLimitOrders(tradePool.storageT)

  useEffect(() => {
    let tradeInterval: NodeJS.Timer | null = null
    Promise.all([getUserOpenLimitOrders(), getUserOpenTrade()]).then()

    tradeInterval = setInterval(async () => {
      console.log('---------------------update user orders------------------')
      await Promise.all([getUserOpenLimitOrders(), getUserOpenTrade()])
    }, 15000)
    return () => {
      if (tradeInterval) clearInterval(tradeInterval)
    }
  }, [tradePool, account, chainId])

  return (
    <div css={myTrade}>
      <div
        css={css`
          border-bottom: 1px solid #dadada;
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
              color: '#000!important',
            },
          }}
        >
          <Tab
            sx={{
              minWidth: 0,
              fontFamily: 'Inter',
              padding: '20px 0 8px 0',
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
