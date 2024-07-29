/** @jsxImportSource @emotion/react */
import { useWeb3React } from '@web3-react/core'
import { useState } from 'react'
import { HistoryData } from '../Trades/TradeLeft/TradeHistory'
import { css } from '@emotion/react'
import { HistoryItem } from '../Trades/TradeLeft/HistoryItem'
import { PoolParams } from '../../store/FactorySlice'
import { historyOverflow } from '../Trades/TradeLeft/style'
import { useMediaQuery, useTheme } from '@mui/material'
import { t } from '@lingui/macro'
import PaginationView from '../Pagination'
import { useTradeHistory } from '../../hook/hookV8/useGetTradeHistory'

export type HistoryDataWithPool = {
  pool: PoolParams
  HistoryData: HistoryData[]
}

export const TradeHistory = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  // const [allHistoryData, setAllHistoryData] = useState<HistoryDataWithPool[]>([])
  // const allPoolParams = useRootStore((state) => state.allPoolParams)
  const { account } = useWeb3React()
  const [page, setPage] = useState(1)

  const { totalPage, allHistoryList } = useTradeHistory(page, true)

  // const getTradeHistory = useCallback(async () => {
  //   try {
  //     const quantosRequest = await fetch(QUANTO_API + `?chainId=${chainId}&offset=0&limit=` + allPoolParams.length)
  //     const quantos = await quantosRequest.json()

  //     const res: any[] = []
  //     quantos.data.map(async (quanto: Quanto) => {
  //       const historyRequest = await fetch(
  //         TRADE_HISTORY_API + `?chainId=${chainId}&trader=${account}&indexId=${quanto.indexId}&offset=0&limit=100`
  //       )
  //       const history = await historyRequest.json()
  //       // remove duplicates from history. only check equivalence between pair, type, entry price, exit price, leverage, collateral, pnl, and %
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
  //         const filterData = data.filter(
  //           (item: HistoryData) =>
  //             new BigNumber(item.tradeInitialPosToken).isGreaterThan(0) &&
  //             item.tradeTrader.toLowerCase() === account?.toLowerCase() &&
  //             !item.marketOpen
  //         )
  //         if (data.length > 0) {
  //           res.push({
  //             pool: allPoolParams[quanto.id],
  //             HistoryData: filterData,
  //           })
  //         }
  //       }
  //     })
  //     setAllHistoryData(res)
  //   } catch (e) {
  //     console.error('get user trade history failed!', e)
  //   }
  // }, [allPoolParams, account, chainId])

  // useEffect(() => {
  //   if (allPoolParams.length > 0 && account) {
  //     getTradeHistory().then()
  //   }
  // }, [allPoolParams, account, chainId, getTradeHistory])

  return (
    <div css={isMobile ? historyOverflow : ''}>
      <div
        className="history-layout"
        css={css`
          color: #617168;
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
        <span>{`PnL`}</span>
        <span>%</span>
      </div>
      {allHistoryList.length === 0 && <div className="no-data">{t`No trade history`}</div>}
      {allHistoryList.length > 0 &&
        allHistoryList.map((history, index) => {
          return history.HistoryData.sort(
            (a, b) => new Date(b.createTime).getMilliseconds() - new Date(a.createTime).getMilliseconds()
          ).map((data) => {
            return <HistoryItem key={data.id} history={data} pool={history.pool} />
          })
        })}
      <div style={{ padding: '20px' }}>
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
