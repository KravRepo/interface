/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { Box, Drawer, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material'
import { actionCard } from '../style'
import { OrderParamsCard } from './OrderParamsCard'
import BigNumber from 'bignumber.js'
import { css } from '@emotion/react'

export type ActionCardProp = {
  leverage: number
  setLeverage: React.Dispatch<React.SetStateAction<number>>
  positionSizeDai: BigNumber
  setPositionSizeDai: React.Dispatch<React.SetStateAction<BigNumber>>
  isBuy: boolean
  setIsBuy: React.Dispatch<React.SetStateAction<boolean>>
  tpPrice: BigNumber | string
  setTpPrice: React.Dispatch<React.SetStateAction<string | BigNumber>>
  slPrice: BigNumber | string
  setSlPrice: React.Dispatch<React.SetStateAction<string | BigNumber>>
  limitPrice: string | BigNumber
  setLimitPrice: React.Dispatch<React.SetStateAction<string | BigNumber>>
  tradeType: number
  setTradeType: React.Dispatch<React.SetStateAction<number>>
  openDrawer?: boolean
  setOpenDrawer?: React.Dispatch<React.SetStateAction<boolean>>
}

type ActionsCardLayoutProps = {
  isOpen?: boolean
  setIsOpen?: (isOpenSelectToken: boolean) => void
  children: JSX.Element
}

export const ActionsCardLayout = ({ isOpen, setIsOpen, children }: ActionsCardLayoutProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  return (
    <>
      {!isMobile && <>{children}</>}
      {isMobile && setIsOpen && isOpen && (
        <Drawer anchor={'bottom'} open={isOpen} onClose={() => setIsOpen(false)}>
          {children}
        </Drawer>
      )}
    </>
  )
}

export const ActionsCard = ({
  isBuy,
  setIsBuy,
  leverage,
  setLeverage,
  positionSizeDai,
  setPositionSizeDai,
  tpPrice,
  setTpPrice,
  slPrice,
  setSlPrice,
  limitPrice,
  setLimitPrice,
  tradeType,
  setTradeType,
  openDrawer,
  setOpenDrawer,
}: ActionCardProp) => {
  const [orderType, setOrderType] = useState(0)
  const theme = useTheme()
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setOrderType(newValue)
    setIsBuy(newValue === 0)
  }
  return (
    <ActionsCardLayout isOpen={openDrawer} setIsOpen={setOpenDrawer}>
      <div
        css={[
          actionCard,
          css`
            background: ${theme.background.primary};
          `,
        ]}
      >
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
      </div>
    </ActionsCardLayout>
  )
}
