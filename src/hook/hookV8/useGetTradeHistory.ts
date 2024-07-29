import { useCallback, useEffect, useState } from 'react'
import { TRADE_HISTORY_API } from '../../constant/chain'
import { useWeb3React } from '@web3-react/core'
import { useRootStore } from '../../store/root'
import { HistoryData } from '../../components/Trades/TradeLeft/TradeHistory'
import { PoolParams } from '../../store/FactorySlice'

const PER_PAGE = 10
const PER_PAGE_ALL = 5

export type HistoryDataWithPool = {
  pool: PoolParams
  HistoryData: HistoryData[]
}

export function useTradeHistory(page = 1, isAllPool = false) {
  const [historyList, setHistoryList] = useState<HistoryData[]>([])
  const [allHistoryList, setAllHistoryList] = useState<HistoryDataWithPool[]>([])
  const [totalPage, setTotalPage] = useState(0)
  const { chainId, account } = useWeb3React()
  const allPoolParams = useRootStore((state) => state.allPoolParams)
  const tradePool = useRootStore((state) => state.tradePool)

  const getTradeHistory = useCallback(async () => {
    if (isAllPool === false) {
      try {
        const historyRequest = await fetch(
          TRADE_HISTORY_API +
            `?chainId=${chainId}&marketOpen=${0}&trader=${account}&indexId=${tradePool.quantoIndex}&offset=${
              PER_PAGE * (page - 1)
            }&limit=${PER_PAGE}`
        )
        const history = await historyRequest.json()
        if (history.code === 200) {
          const data: HistoryData[] = history.data
          // data = data.filter(
          //   (item: HistoryData, index: number, self: HistoryData[]) =>
          //     index ===
          //     self.findIndex(
          //       (t) =>
          //         t.tradePairIndex === item.tradePairIndex &&
          //         t.limitOrderType === item.limitOrderType &&
          //         t.tradeOpenPrice === item.tradeOpenPrice &&
          //         t.price === item.price &&
          //         t.tradeInitialPosToken === item.tradeInitialPosToken &&
          //         t.tradeLeverage === item.tradeLeverage &&
          //         t.percentProfit === item.percentProfit
          //     )
          // )
          setTotalPage(Math.ceil(history.total / PER_PAGE))
          setHistoryList(
            data
            // data.filter(
            //   (item: HistoryData) =>
            //     new BigNumber(item.tradeInitialPosToken).isGreaterThan(0) &&
            //     item.tradeTrader.toLowerCase() === account?.toLowerCase() &&
            //     !item.marketOpen
            // )
          )
        }
      } catch (e) {
        console.error('get user trade history error')
      }
      return
    }

    try {
      const res: any[] = []
      let total = 0
      const requests = await Promise.all(
        allPoolParams.map((quanto: PoolParams) => {
          const req = async () => {
            const historyRequest = await fetch(
              TRADE_HISTORY_API +
                `?chainId=${chainId}&trader=${account}&marketOpen=${0}&indexId=${quanto.quantoIndex}&offset=${
                  PER_PAGE_ALL * (page - 1)
                }&limit=${PER_PAGE_ALL}`
            )
            const history = await historyRequest.json()
            return history
          }
          return req()
        })
      )

      requests.map((history: any, idx) => {
        if (history.code === 200) {
          const data: HistoryData[] = history.data
          if (total < history.total) {
            total = history.total
            setTotalPage(total / PER_PAGE_ALL)
          }

          if (data.length > 0) {
            res.push({
              pool: allPoolParams[idx],
              HistoryData: data,
            })
          }
        }
      })

      // allPoolParams.map(async (quanto: PoolParams) => {
      //   const historyRequest = await fetch(
      //     TRADE_HISTORY_API +
      //       `?chainId=${chainId}&trader=${account}&marketOpen=${0}&indexId=${quanto.quantoIndex}&offset=${
      //         PER_PAGE_ALL * (page - 1)
      //       }&limit=${PER_PAGE_ALL}`
      //   )
      //   const history = await historyRequest.json()
      //   // remove duplicates from history. only check equivalence between pair, type, entry price, exit price, leverage, collateral, pnl, and %
      //   if (history.code === 200) {
      //     const data: HistoryData[] = history.data
      //     if (total < history.total) {
      //       total = history.total
      //       setTotalPage(total / PER_PAGE_ALL)
      //     }
      //     // data = data.filter(
      //     //   (item: HistoryData, index: number, self: HistoryData[]) =>
      //     //     index ===
      //     //     self.findIndex(
      //     //       (t) =>
      //     //         t.tradePairIndex === item.tradePairIndex &&
      //     //         t.limitOrderType === item.limitOrderType &&
      //     //         t.tradeOpenPrice === item.tradeOpenPrice &&
      //     //         t.price === item.price &&
      //     //         t.tradeInitialPosToken === item.tradeInitialPosToken &&
      //     //         t.tradeLeverage === item.tradeLeverage &&
      //     //         t.percentProfit === item.percentProfit
      //     //     )
      //     // )
      //     // const filterData = data.filter(
      //     //   (item: HistoryData) =>
      //     //     new BigNumber(item.tradeInitialPosToken).isGreaterThan(0) &&
      //     //     item.tradeTrader.toLowerCase() === account?.toLowerCase() &&
      //     //     !item.marketOpen
      //     // )
      //     if (data.length > 0) {
      //       res.push({
      //         pool: quanto,
      //         HistoryData: data,
      //       })
      //     }
      //   }
      // })
      setAllHistoryList(res)
    } catch (e) {
      console.error('get user all trade history failed!', e)
    }
  }, [isAllPool, tradePool.quantoIndex, chainId, account, page, allPoolParams])

  useEffect(() => {
    if (((typeof tradePool.quantoIndex === 'number' && !isAllPool) || isAllPool) && account) {
      getTradeHistory()
    }
  }, [account, getTradeHistory, isAllPool, tradePool.quantoIndex])

  return { historyList, allHistoryList, totalPage }
}
