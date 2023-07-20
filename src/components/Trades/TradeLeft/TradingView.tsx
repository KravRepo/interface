/** @jsxImportSource @emotion/react */
import { createChart } from 'lightweight-charts'
import { useEffect, useState } from 'react'
import { useRef } from 'react'
import moment from 'moment'
import { css } from '@emotion/react'
import { useGetKLineData } from '../../../hook/hookV8/useGetKLineData'
import { Skeleton } from '@mui/material'

export type ChartData = {
  ClosePrice: string
  CloseTime: number
  HighPrice: string
  Ignore: string
  LowPrice: string
  OpenPrice: string
  OpenTime: number
  QuoteVolume: string
  TakerBuyBase: string
  TakerBuyQuote: string
  TradeCount: number
  Volume: string
}

export const TradingView = () => {
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState([] as ChartData[])
  const [isLoadingChartData, setIsLoadingChartData] = useState(true)
  const getData = useGetKLineData(setChartData, setIsLoadingChartData)

  useEffect(() => {
    const chartDom = chartRef.current as HTMLElement | null
    let handleResize: () => void
    if (chartDom && chartData.length > 0) {
      const chart = createChart(chartDom, {
        localization: {
          locale: 'en',
        },
      })
      const candlestickSeries = chart.addCandlestickSeries()
      const formatterData = chartData.map((item) => {
        const timeStr = moment(item.OpenTime).format('YYYY-MM-DD')
        return {
          time: timeStr,
          open: Number(item.OpenPrice),
          high: Number(item.HighPrice),
          low: Number(item.LowPrice),
          close: Number(item.ClosePrice),
        }
      })
      candlestickSeries.setData(formatterData)
      handleResize = () => {
        chart.applyOptions({ width: chartDom.clientWidth })
      }
      window.addEventListener('resize', handleResize)
    }
  }, [chartRef.current, chartData])

  useEffect(() => {
    getData().then()
  }, [])

  return (
    <>
      {isLoadingChartData && (
        <div>
          <Skeleton sx={{ height: '440px', borderRadius: '8px' }} animation="wave" variant="rectangular" />
        </div>
      )}
      {!isLoadingChartData && (
        <div
          ref={chartRef}
          css={css`
            position: absolute;
            width: calc(100% - 36px);
          `}
          style={{ height: '440px', overflow: 'hidden' }}
        />
      )}
    </>
  )
}
