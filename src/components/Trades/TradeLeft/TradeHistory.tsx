/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import React, { Dispatch, useCallback, useEffect } from 'react'
import { useRootStore } from '../../../store/root'
import { QUANTO_API, TRADE_HISTORY_API } from '../../../constant/chain'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { HistoryItem } from './HistoryItem'
import { useMediaQuery, useTheme } from '@mui/material'
import { historyOverflow } from './style'
import { t } from '@lingui/macro'

export type Quanto = {
  id: number
  createTime: string
  updateTime: string
  chainId: number
  indexId: number
  storage: string
  pairInfo: string
  pairStorage: string
  tradingT: string
  callbackT: string
  rewardT: string
  vaultT: string
  priceAggregatorT: string
  timestamp: number
}

export type HistoryData = {
  chainId: number
  createTime: string
  daiSentToTrader: string
  id: number
  indexId: number
  isCancel: boolean
  limitIndex: number
  limitNftHolder: string
  limitOrderType: number
  marketOpen: boolean
  orderId: number
  percentProfit: string
  positionSizeDai: string
  price: string
  priceImpactP: string
  tradeBuy: boolean
  tradeIndex: number
  tradeInitialPosToken: string
  tradeLeverage: string
  tradeOpenPrice: string
  tradePairIndex: number
  tradePositionSizeDai: string
  tradeSl: string
  tradeTp: string
  tradeTrader: string
  updateTime: string
}

type TradeHistoryProps = {
  historyList: HistoryData[]
  setHistoryList: Dispatch<React.SetStateAction<HistoryData[]>>
}

export const TradeHistory = ({ historyList, setHistoryList }: TradeHistoryProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const tradePool = useRootStore((state) => state.tradePool)
  const allPoolParams = useRootStore((state) => state.allPoolParams)
  const { account, chainId } = useWeb3React()

  const getTradeHistory = useCallback(async () => {
    try {
      const quantosRequest = await fetch(QUANTO_API + `?chainId=${chainId}&offset=0&limit=` + allPoolParams.length)
      // console.log('quantosRequest', quantosRequest)
      const quantos = await quantosRequest.json()
      // console.log('quantos', quantos)
      if (quantos.code == 200) {
        const target = quantos.data.find((quanto: Quanto) => quanto?.tradingT === tradePool?.tradingT)
        // console.log('target', target)
        const historyRequest = await fetch(
          TRADE_HISTORY_API + `?chainId=${chainId}&trader=${account}&indexId=${target.indexId}&offset=0&limit=100`
        )
        console.log(
          'fetching',
          TRADE_HISTORY_API + `?chainId=${chainId}&trader=${account}&indexId=${target.indexId}&offset=0&limit=100`
        )
        // console.log('historyRequest', historyRequest)
        const history = await historyRequest.json()
        if (history.code === 200) {
          const data: HistoryData[] = history.data
          setHistoryList(
            data.filter(
              (item: HistoryData) => new BigNumber(item.tradeInitialPosToken).isGreaterThan(0) && !item.marketOpen
            )
          )
        }
      }
    } catch (e) {
      console.error('get user trade history failed!', e)
    }
  }, [tradePool, allPoolParams, account, chainId])

  useEffect(() => {
    if (tradePool && account) {
      getTradeHistory().then()
    }
  }, [tradePool, account, chainId])

  return (
    <div css={isMobile ? historyOverflow : ''}>
      <div
        className="history-layout"
        css={css`
          color: #617168;
          border-top: ${theme.splitLine.primary};
        `}
      >
        <span>{t`Date`}</span>
        <span>{t`Pair`}</span>
        <span>{t`Type`}</span>
        <span>{t`Price`}</span>
        <span>{t`Leverage`}</span>
        <span>{t`Coll`}</span>
        <span>{'PnL'}</span>
        <span>%</span>
      </div>
      {historyList.length === 0 && account && <div className="no-data">{t`No trade history`}</div>}
      {!account && <div className="no-data">{t`Connect Wallet`}</div>}
      {historyList.length > 0 &&
        account &&
        historyList.map((history, index) => {
          return <HistoryItem key={tradePool.tradingT + index} history={history} />
        })}
    </div>
  )
}
