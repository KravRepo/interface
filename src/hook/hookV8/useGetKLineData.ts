import { ChartData } from '../../components/Trades/TradeLeft/TradingView'
import React, { Dispatch, useCallback } from 'react'
import { K_LINE_API } from '../../constant/chain'

export const useGetKLineData = (
  setData: Dispatch<React.SetStateAction<ChartData[]>>,
  setIsLoadingChartData: Dispatch<React.SetStateAction<boolean>>
) => {
  return useCallback(async () => {
    try {
      const data = await fetch(K_LINE_API)
      const res = await data.json()
      setData(res.data)
      setIsLoadingChartData(false)
    } catch (e) {
      console.log('get k line data failed!', e)
    }
  }, [])
}
