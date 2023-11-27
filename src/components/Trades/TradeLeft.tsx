/** @jsxImportSource @emotion/react */
import { PairInfo } from './TradeLeft/PairInfo'
import { chart, tradeLeft } from './style'
import { MyTrade } from './TradeLeft/MyTrade'
import TradingViewWidget from './TradeLeft/newTradingView'
import { SelectToken } from '../Dialog/SelectToken'
import BigNumber from 'bignumber.js'
import { BasicModel } from './TradeLeft/BasicModel'
import { useRootStore } from '../../store/root'
import { css, useMediaQuery, useTheme } from '@mui/material'
import { SecondChart } from './TradeLeft/SecondChart'
import { TradeMode } from '../../store/TradeSlice'
import KRAVButton from '../KravUIKit/KravButton'
import { OrderParamsMobile } from '../Dialog/OrderParamsMobile'
import { useWeb3React } from '@web3-react/core'
import React from 'react'

type TradeLeftProps = {
  positionSizeDai: BigNumber
  leverage: number
  isBuy: boolean
  limitPrice: string | BigNumber
  tradeType: number
  setLeverage: React.Dispatch<React.SetStateAction<number>>
  setPositionSizeDai: React.Dispatch<React.SetStateAction<BigNumber>>
  tpPrice: BigNumber | string
  setTpPrice: React.Dispatch<React.SetStateAction<string | BigNumber>>
  slPrice: BigNumber | string
  setSlPrice: React.Dispatch<React.SetStateAction<string | BigNumber>>
  setLimitPrice: React.Dispatch<React.SetStateAction<string | BigNumber>>
  setTradeType: React.Dispatch<React.SetStateAction<number>>
  setIsBuy: React.Dispatch<React.SetStateAction<boolean>>
}

export const TradeLeft = ({
  positionSizeDai,
  leverage,
  isBuy,
  limitPrice,
  tradeType,
  setLeverage,
  setLimitPrice,
  setPositionSizeDai,
  setSlPrice,
  setTpPrice,
  setTradeType,
  slPrice,
  tpPrice,
  setIsBuy,
}: TradeLeftProps) => {
  const {
    tradeModel,
    setTradeModel,
    isOpenSelectToken,
    setIsOpenSelectToken,
    setWalletDialogVisibility,
    openTradeCard,
    setOpenTradeCard,
  } = useRootStore((state) => ({
    tradeModel: state.tradeModel,
    setTradeModel: state.setTradeModel,
    isOpenSelectToken: state.isOpenSelectToken,
    setIsOpenSelectToken: state.setIsOpenSelectToken,
    setWalletDialogVisibility: state.setWalletDialogVisibility,
    openTradeCard: state.openTradeCard,
    setOpenTradeCard: state.setOpenTradeCard,
  }))
  const theme = useTheme()
  const { account } = useWeb3React()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

  return (
    <>
      <SelectToken isOpen={isOpenSelectToken} setIsOpen={setIsOpenSelectToken} />
      {isMobile && (
        <OrderParamsMobile
          isOpen={openTradeCard}
          setIsOpen={() => setOpenTradeCard(false)}
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
          setIsBuy={setIsBuy}
        />
      )}
      <div
        css={[
          tradeLeft,
          css`
            padding-right: ${isMobile ? 0 : '18px'};
          `,
        ]}
      >
        <PairInfo tradeModel={tradeModel} setIsOpenSelectToken={setIsOpenSelectToken} setTradeModel={setTradeModel} />
        <div
          css={[
            chart,
            css`
              background: ${theme.background.primary};
              height: ${!isMobile ? '481px' : ''};
            `,
          ]}
        >
          {tradeModel === TradeMode.BASIC && (
            <BasicModel
              positionSizeDai={positionSizeDai}
              isBuy={isBuy}
              leverage={leverage}
              limitPrice={limitPrice}
              tradeType={tradeType}
            />
          )}
          {tradeModel === TradeMode.PRO && <TradingViewWidget />}
          {tradeModel === TradeMode.DEGEN && <SecondChart />}
          {isMobile && (
            <div
              css={css`
                padding: 16px 10px;
              `}
            >
              {account ? (
                <KRAVButton onClick={() => setOpenTradeCard(true)}>Open Trade</KRAVButton>
              ) : (
                <KRAVButton onClick={() => setWalletDialogVisibility(true)}>Connect Wallet</KRAVButton>
              )}
            </div>
          )}
        </div>
        {!isMobile && <MyTrade />}
      </div>
    </>
  )
}
