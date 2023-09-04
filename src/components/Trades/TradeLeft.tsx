/** @jsxImportSource @emotion/react */
import { PairInfo } from './TradeLeft/PairInfo'
import { chart, tradeLeft } from './style'
import { MyTrade } from './TradeLeft/MyTrade'
import TradingViewWidget from './TradeLeft/newTradingView'
import { SelectToken } from '../Dialog/SelectToken'
import BigNumber from 'bignumber.js'
import { BasicModel } from './TradeLeft/BasicModel'
import { useRootStore } from '../../store/root'
import { css, useTheme } from '@mui/material'
import { SecondChart } from './TradeLeft/SecondChart'
import { useState } from 'react'
import KRAVHollowButton from '../KravUIKit/KRAVHollowButton'

type TradeLeftProps = {
  positionSizeDai: BigNumber
  leverage: number
  isBuy: boolean
  limitPrice: string | BigNumber
  tradeType: number
}

export const TradeLeft = ({ positionSizeDai, leverage, isBuy, limitPrice, tradeType }: TradeLeftProps) => {
  const { tradeModel, setTradeModel, isOpenSelectToken, setIsOpenSelectToken } = useRootStore((state) => ({
    tradeModel: state.tradeModel,
    setTradeModel: state.setTradeModel,
    isOpenSelectToken: state.isOpenSelectToken,
    setIsOpenSelectToken: state.setIsOpenSelectToken,
  }))
  const theme = useTheme()
  const [chartType, setChartType] = useState(0)

  return (
    <>
      <SelectToken isOpen={isOpenSelectToken} setIsOpen={setIsOpenSelectToken} />
      <div css={tradeLeft}>
        <PairInfo tradeModel={tradeModel} setIsOpenSelectToken={setIsOpenSelectToken} setTradeModel={setTradeModel} />
        <div
          css={css`
            height: 48px;
            width: 100%;
            border-radius: 8px 8px 0px 0px;
            border-bottom: ${theme.splitLine.primary};
            margin-top: 12px;
            display: flex;
            align-items: center;
            justify-content: end;
            padding-right: 24px;
            background: ${theme.background.primary};
          `}
        >
          <KRAVHollowButton
            sx={{
              width: '106px',
              height: '28px',
              mr: '8px',
              borderRadius: '100px',
              border: chartType === 0 ? 'unset' : theme.hollowButton.border,
              background: chartType === 0 ? '#2832f5' : '',
            }}
            onClick={() => setChartType(0)}
          >
            Trading
          </KRAVHollowButton>
          <KRAVHollowButton
            sx={{
              width: '97px',
              height: '28px',
              borderRadius: '100px',
              mr: '16px',
              border: chartType === 1 ? 'unset' : theme.hollowButton.border,
              background: chartType === 1 ? '#2832f5' : '',
            }}
            onClick={() => setChartType(1)}
          >
            Per second
          </KRAVHollowButton>
          <KRAVHollowButton
            sx={{
              width: '97px',
              height: '28px',
              borderRadius: '100px',
              mr: '16px',
              border: chartType === 2 ? 'unset' : theme.hollowButton.border,
              background: chartType === 2 ? '#2832f5' : '',
            }}
            onClick={() => setChartType(2)}
          >
            Depth
          </KRAVHollowButton>
        </div>
        {chartType === 0 && (
          <div
            css={[
              chart,
              css`
                background: ${theme.background.primary};
              `,
            ]}
          >
            <TradingViewWidget />
          </div>
        )}
        {chartType === 2 && (
          <BasicModel
            positionSizeDai={positionSizeDai}
            isBuy={isBuy}
            leverage={leverage}
            limitPrice={limitPrice}
            tradeType={tradeType}
          />
        )}
        {chartType === 1 && <SecondChart />}
        <MyTrade />
      </div>
    </>
  )
}
