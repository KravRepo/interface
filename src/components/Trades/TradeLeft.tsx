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

type TradeLeftProps = {
  positionSizeDai: BigNumber
  leverage: number
  isBuy: boolean
  limitPrice: string | BigNumber
  tradeType: number
}

export const TradeLeft = ({ positionSizeDai, leverage, isBuy, limitPrice, tradeType }: TradeLeftProps) => {
  const { isProModel, setIsProModel, isOpenSelectToken, setIsOpenSelectToken } = useRootStore((state) => ({
    isProModel: state.isProModel,
    setIsProModel: state.setIsProModel,
    isOpenSelectToken: state.isOpenSelectToken,
    setIsOpenSelectToken: state.setIsOpenSelectToken,
  }))
  const theme = useTheme()

  return (
    <>
      <SelectToken isOpen={isOpenSelectToken} setIsOpen={setIsOpenSelectToken} />
      <div css={tradeLeft}>
        <PairInfo isProModel={isProModel} setIsOpenSelectToken={setIsOpenSelectToken} setIsProModel={setIsProModel} />
        {isProModel && (
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
        {!isProModel && (
          <BasicModel
            positionSizeDai={positionSizeDai}
            isBuy={isBuy}
            leverage={leverage}
            limitPrice={limitPrice}
            tradeType={tradeType}
          />
        )}
        <MyTrade />
      </div>
    </>
  )
}
