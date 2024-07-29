/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import React, { Dispatch, useState } from 'react'
import { useRootStore } from '../../../store/root'
import { useWeb3React } from '@web3-react/core'
import { HistoryItem } from './HistoryItem'
import { useMediaQuery, useTheme } from '@mui/material'
import { historyOverflow } from './style'
import { t } from '@lingui/macro'
import { useTradeHistory } from '../../../hook/hookV8/useGetTradeHistory'
import PaginationView from '../../Pagination'

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
  const { account } = useWeb3React()
  const [page, setPage] = useState(1)
  const { historyList: historyListNew, totalPage } = useTradeHistory(page, false)

  // const getTradeHistory = useCallback(async () => {
  //   try {
  //     const quantosRequest = await fetch(QUANTO_API + `?chainId=${chainId}&offset=0&limit=` + allPoolParams.length)
  //     // console.log('quantosRequest', quantosRequest)
  //     const quantos = await quantosRequest.json()
  //     // console.log('quantos', quantos)
  //     if (quantos.code == 200) {
  //       const target = quantos.data.find((quanto: Quanto) => quanto?.tradingT === tradePool?.tradingT)
  //       // console.log('target', target)
  //       const historyRequest = await fetch(
  //         TRADE_HISTORY_API + `?chainId=${chainId}&trader=${account}&indexId=${target.indexId}&offset=0&limit=100`
  //       )
  //       console.log(
  //         'fetching',
  //         TRADE_HISTORY_API + `?chainId=${chainId}&trader=${account}&indexId=${target.indexId}&offset=0&limit=100`
  //       )
  //       // console.log('historyRequest', historyRequest)
  //       const history = await historyRequest.json()
  //       if (history.code === 200) {
  //         let data: HistoryData[] = history.data
  //         data = data.filter(
  //           (item: HistoryData, index: number, self: HistoryData[]) =>
  //             index ===
  //             self.findIndex(
  //               (t) =>
  //                 t.tradePairIndex === item.tradePairIndex &&
  //                 t.limitOrderType === item.limitOrderType &&
  //                 t.tradeOpenPrice === item.tradeOpenPrice &&
  //                 t.price === item.price &&
  //                 t.tradeInitialPosToken === item.tradeInitialPosToken &&
  //                 t.tradeLeverage === item.tradeLeverage &&
  //                 t.percentProfit === item.percentProfit
  //             )
  //         )
  //         setHistoryList(
  //           data.filter(
  //             (item: HistoryData) =>
  //               new BigNumber(item.tradeInitialPosToken).isGreaterThan(0) &&
  //               item.tradeTrader.toLowerCase() === account?.toLowerCase() &&
  //               !item.marketOpen
  //           )
  //         )
  //       }
  //     }
  //   } catch (e) {
  //     console.error('get user trade history failed!', e)
  //   }
  // }, [chainId, allPoolParams.length, account, tradePool?.tradingT, setHistoryList])

  // useEffect(() => {
  //   if (tradePool && account) {
  //     getTradeHistory().then()
  //   }
  // }, [tradePool, account, chainId, getTradeHistory])

  return (
    <div css={isMobile ? historyOverflow : ''}>
      <div
        className="history-layout"
        css={css`
          color: #617168;
          border-top: ${theme.splitLine.primary};
        `}
      >
        <span>{`Date Closed`}</span>
        <span>{`Time Closed`}</span>
        <span>{t`Pair`}</span>
        <span>{t`Type`}</span>
        <span>{`Entry Price`}</span>
        <span>{`Exit Price`}</span>
        <span>{t`Leverage`}</span>
        <span>{`Collateral`}</span>
        <span>{'PnL'}</span>
        <span>%</span>
      </div>
      {historyListNew.length === 0 && account && <div className="no-data">{t`No trade history`}</div>}
      {!account && <div className="no-data">{t`Connect Wallet`}</div>}
      {historyListNew.length > 0 &&
        account &&
        historyListNew.map((history, index) => {
          return <HistoryItem key={tradePool.tradingT + index} history={history} pool={tradePool} />
        })}
      <div
        css={css`
          padding: 20px;
        `}
      >
        {account && totalPage > 1 && (
          <PaginationView
            count={totalPage}
            page={page}
            onChange={(_, p) => {
              setPage(p)
            }}
          />
        )}
      </div>
    </div>
  )
}
