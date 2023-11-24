import { Box, SwipeableDrawer, Tab, Tabs, useTheme } from '@mui/material'
import { OrderParamsCard } from '../Trades/TradeRight/OrderParamsCard'
import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'

type OrderParamsMobileProps = {
  isOpen: boolean
  setIsOpen: () => void
  leverage: number
  setLeverage: React.Dispatch<React.SetStateAction<number>>
  positionSizeDai: BigNumber
  setPositionSizeDai: React.Dispatch<React.SetStateAction<BigNumber>>
  tpPrice: BigNumber | string
  setTpPrice: React.Dispatch<React.SetStateAction<string | BigNumber>>
  slPrice: BigNumber | string
  setSlPrice: React.Dispatch<React.SetStateAction<string | BigNumber>>
  isBuy: boolean
  limitPrice: string | BigNumber
  setLimitPrice: React.Dispatch<React.SetStateAction<string | BigNumber>>
  tradeType: number
  setTradeType: React.Dispatch<React.SetStateAction<number>>
  setIsBuy: React.Dispatch<React.SetStateAction<boolean>>
}

export const OrderParamsMobile = ({
  isOpen,
  setIsOpen,
  isBuy,
  leverage,
  limitPrice,
  positionSizeDai,
  setLeverage,
  setLimitPrice,
  setPositionSizeDai,
  setSlPrice,
  setTpPrice,
  setTradeType,
  slPrice,
  tpPrice,
  tradeType,
  setIsBuy,
}: OrderParamsMobileProps) => {
  const [orderType, setOrderType] = useState(0)
  const theme = useTheme()
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setOrderType(newValue)
    setIsBuy(newValue === 0)
  }

  useEffect(() => {
    return () => {
      setIsOpen()
    }
  }, [])

  return (
    <SwipeableDrawer anchor={'bottom'} open={isOpen} onOpen={() => console.log('open')} onClose={setIsOpen}>
      <Box sx={{ padding: '16px 24px 32px' }}>
        <Box
          sx={{
            width: '96px',
            borderRadius: '8px',
            height: '4px',
            background: theme.background.third,
            margin: '0 auto 32px',
          }}
        />
        <Box
          sx={{
            padding: '4px',
            background: theme.palette.mode === 'dark' ? theme.background.second : '#F7F7F7',
            borderRadius: '4px',
          }}
        >
          <Tabs
            value={orderType}
            onChange={handleChange}
            sx={{
              color: '#000000',
              minHeight: '30px',
              '& .MuiTabs-indicator': { display: 'none' },
              '& .Mui-selected': { color: '#fff !important' },
            }}
          >
            <Tab
              sx={{
                width: '50%',
                borderRadius: '4px',
                minHeight: '30px',
                maxWidth: '50%',
                padding: 0,
                background: orderType === 0 ? '#009B72 !important' : '',
              }}
              label="Long"
            />
            <Tab
              sx={{
                width: '50%',
                borderRadius: '4px',
                minHeight: '30px',
                maxWidth: '50%',
                padding: 0,
                background: orderType === 1 ? '#DB4C40 !important' : '',
              }}
              label="Short"
            />
          </Tabs>
        </Box>
        <OrderParamsCard
          leverage={leverage}
          positionSizeDai={positionSizeDai}
          setLeverage={setLeverage}
          setPositionSizeDai={setPositionSizeDai}
          setSlPrice={setSlPrice}
          setTpPrice={setTpPrice}
          slPrice={slPrice}
          tpPrice={tpPrice}
          isBuy={isBuy}
          limitPrice={limitPrice}
          setLimitPrice={setLimitPrice}
          tradeType={tradeType}
          setTradeType={setTradeType}
        />
      </Box>
    </SwipeableDrawer>
  )
}
