/** @jsxImportSource @emotion/react */
import { useRootStore } from '../../store/root'
import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import { QUANTO_API, TEST_CHAIN_ID, TRADE_HISTORY_API } from '../../constant/chain'
import BigNumber from 'bignumber.js'
import { HistoryData, Quanto } from '../Trades/TradeLeft/TradeHistory'
import { css } from '@emotion/react'
import { HistoryItem } from '../Trades/TradeLeft/HistoryItem'
import { PoolParams } from '../../store/FactorySlice'

export type HistoryDataWithPool = {
  pool: PoolParams
  HistoryData: HistoryData[]
}

export const TradeHistory = () => {
  const [allHistoryData, setAllHistoryData] = useState<HistoryDataWithPool[]>([])
  const allPoolParams = useRootStore((state) => state.allPoolParams)
  const { account } = useWeb3React()

  const getTradeHistory = useCallback(async () => {
    try {
      const quantosRequest = await fetch(
        QUANTO_API + `?chainId=${TEST_CHAIN_ID}&offset=0&limit=` + allPoolParams.length
      )
      const quantos = await quantosRequest.json()
      const res: any[] = []
      quantos.data.map(async (quanto: Quanto) => {
        const historyRequest = await fetch(
          TRADE_HISTORY_API + `?chainId=${TEST_CHAIN_ID}&trader=${account}&indexId=${quanto.indexId}&offset=0&limit=100`
        )
        const history = await historyRequest.json()
        if (history.code === 200) {
          const data: HistoryData[] = history.data
          const filterData = data.filter((item: HistoryData) =>
            new BigNumber(item.tradeInitialPosToken).isGreaterThan(0)
          )
          console.log('filterData', filterData)
          if (data.length > 0) {
            res.push({
              pool: allPoolParams[quanto.id],
              HistoryData: filterData,
            })
          }
        }
      })
      console.log('history', res)
      setAllHistoryData(res)
    } catch (e) {
      console.error('get user trade history failed!', e)
    }
  }, [allPoolParams, account])

  useEffect(() => {
    if (allPoolParams.length > 0 && account) {
      getTradeHistory().then()
    }
  }, [allPoolParams, account])

  return (
    <div>
      <div
        className="history-layout"
        css={css`
          color: #617168;
        `}
      >
        <span>Date</span>
        <span>Pair</span>
        <span>Type</span>
        <span>Price</span>
        <span>Leverage</span>
        <span>Coll</span>
        <span>PnL</span>
        <span>%</span>
      </div>
      {allHistoryData.length === 0 && <div className="no-data">No trade history</div>}
      {allHistoryData.length > 0 &&
        allHistoryData.map((history, index) => {
          return history.HistoryData.map((data) => {
            return <HistoryItem key={data.id} history={data} pool={history.pool} />
          })
        })}
    </div>
  )
}
