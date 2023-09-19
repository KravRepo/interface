/** @jsxImportSource @emotion/react */
import { PairInfo } from './TradeLeft/PairInfo'
import { chart, tradeLeft } from './style'
import { MyTrade } from './TradeLeft/MyTrade'
import { TradingView } from './TradeLeft/TradingView'
import { SelectToken } from '../Dialog/SelectToken'
import BigNumber from 'bignumber.js'
import { BasicModel } from './TradeLeft/BasicModel'
import { useRootStore } from '../../store/root'
import { css, useTheme } from '@mui/material'
import { TradeMode } from '../../store/TradeSlice'
import { SecondChart } from './TradeLeft/SecondCharts'

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

  return (
    <>
      <SelectToken isOpen={isOpenSelectToken} setIsOpen={setIsOpenSelectToken} />
      <div css={tradeLeft}>
        <PairInfo tradeModel={tradeModel} setIsOpenSelectToken={setIsOpenSelectToken} setTradeModel={setTradeModel} />
        {tradeModel === TradeMode.PRO && (
          <div
            css={[
              chart,
              css`
                background: ${theme.background.primary};
              `,
            ]}
          >
            <TradingView />
          </div>
        )}
        {tradeModel === TradeMode.BASIC && (
          <BasicModel
            positionSizeDai={positionSizeDai}
            isBuy={isBuy}
            leverage={leverage}
            limitPrice={limitPrice}
            tradeType={tradeType}
          />
        )}
        {tradeModel === TradeMode.DEGEN && <SecondChart />}
        <MyTrade />
      </div>
    </>
  )
}
