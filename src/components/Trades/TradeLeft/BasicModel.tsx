/** @jsxImportSource @emotion/react */
import { css } from '@mui/material'
import { BasicModelDepth } from './BasicModelDepth'
import { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useRootStore } from '../../../store/root'
import { getLiqPrice } from '../../../utils/math'

type BasicModelProps = {
  positionSizeDai: BigNumber
  leverage: number
  isBuy: boolean
  limitPrice: string | BigNumber
  tradeType: number
}

export const BasicModel = ({ positionSizeDai, leverage, isBuy, limitPrice, tradeType }: BasicModelProps) => {
  const [priceReaches, setPriceReaches] = useState(new BigNumber(0))
  const [takeProfit, setTakeProfit] = useState(new BigNumber(0))
  const [takeProfitPercentage, setTakeProfitPercentage] = useState(new BigNumber(0))
  const tradePool = useRootStore((state) => state.tradePool)
  const BTCPrice = useRootStore((state) => state.BTCPrice)
  const liquidityPrice = useMemo(() => {
    return getLiqPrice(BTCPrice, positionSizeDai, isBuy, leverage)
  }, [positionSizeDai, leverage, isBuy, BTCPrice])
  return (
    <div>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 12px 0;
          @media screen and (max-width: 1000px) {
            display: block;
            text-align: center;
          }
          @media screen and (max-width: 500px) {
            display: block;
            text-align: start;
          }
        `}
      >
        <div>
          <span>{isBuy ? 'Long' : 'Short'} Amount</span>
          <span
            css={css`
              padding: 0 15px;
            `}
          >
            {positionSizeDai.toFixed(2)}
          </span>
          <span>{tradePool?.symbol}</span>
        </div>
        <div>
          <span
            css={css`
              margin-right: 30px;
            `}
          >
            When the price reaches
          </span>
          <span
            css={css`
              color: #ff6838;
            `}
          >
            ${priceReaches.toFixed(2)}
          </span>
        </div>
        <div>
          <span> The profit will be </span>
          <span
            css={css`
              color: #00c076;
            `}
          >
            {takeProfit.toFixed(2)} {tradePool?.symbol} ({+takeProfitPercentage.toFixed(0)})%
          </span>
        </div>
      </div>
      <div
        css={css`
          height: 481px;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
        `}
      >
        <BasicModelDepth
          isBuy={isBuy}
          setPriceReaches={setPriceReaches}
          setTakeProfit={setTakeProfit}
          setTakeProfitPercentage={setTakeProfitPercentage}
          leverage={leverage}
          liquidityPrice={liquidityPrice}
          positionSize={positionSizeDai}
          limitPrice={limitPrice}
          tradeType={tradeType}
        />
      </div>
    </div>
  )
}
