import { SwipeableDrawer } from '@mui/material'
import { OrderParamsCard } from '../Trades/TradeRight/OrderParamsCard'
import React from 'react'
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
}: OrderParamsMobileProps) => {
  console.log('is open', isOpen)
  return (
    <SwipeableDrawer anchor={'bottom'} open={isOpen} onOpen={() => console.log('open')} onClose={setIsOpen}>
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
    </SwipeableDrawer>
  )
}
