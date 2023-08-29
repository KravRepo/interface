/** @jsxImportSource @emotion/react */
import { tradeRight } from './style'
import { ActionsCard } from './TradeRight/ActionCard'
import { PositionOverView } from './TradeRight/PositionOverView'
import { UsefulLinks } from './TradeRight/UsefulLinks'
import React from 'react'
import BigNumber from 'bignumber.js'

export type TradeRightProps = {
  leverage: number
  setLeverage: React.Dispatch<React.SetStateAction<number>>
  positionSizeDai: BigNumber
  setPositionSizeDai: React.Dispatch<React.SetStateAction<BigNumber>>
  isBuy: boolean
  setIsBuy: React.Dispatch<React.SetStateAction<boolean>>
  tpPrice: string | BigNumber
  setTpPrice: React.Dispatch<React.SetStateAction<string | BigNumber>>
  slPrice: string | BigNumber
  setSlPrice: React.Dispatch<React.SetStateAction<string | BigNumber>>
  limitPrice: string | BigNumber
  setLimitPrice: React.Dispatch<React.SetStateAction<string | BigNumber>>
  tradeType: number
  setTradeType: React.Dispatch<React.SetStateAction<number>>
}

export const TradeRight = ({
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
}: TradeRightProps) => {
  return (
    <div css={tradeRight}>
      <ActionsCard
        leverage={leverage}
        positionSizeDai={positionSizeDai}
        setLeverage={setLeverage}
        setPositionSizeDai={setPositionSizeDai}
        setSlPrice={setSlPrice}
        setTpPrice={setTpPrice}
        slPrice={slPrice}
        tpPrice={tpPrice}
        isBuy={isBuy}
        setIsBuy={setIsBuy}
        limitPrice={limitPrice}
        setLimitPrice={setLimitPrice}
        tradeType={tradeType}
        setTradeType={setTradeType}
      />
      <PositionOverView />
      <UsefulLinks />
    </div>
  )
}
