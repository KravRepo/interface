/** @jsxImportSource @emotion/react */
import { createChart, ISeriesApi } from 'lightweight-charts'
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
  // const theme = useTheme()
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState([] as ChartData[])
  const [tradeChart, setTradeChart] = useState<ISeriesApi<'Candlestick'> | null>(null)
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
        layout: {
          textColor: '#777E90',
          background: {
            color: 'transparent',
          },
        },
        grid: {
          vertLines: {
            visible: false,
          },
          horzLines: {
            visible: false,
          },
        },
      })
      const candlestickSeries = chart.addCandlestickSeries()
      setTradeChart(candlestickSeries)
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

  // useEffect(() => {
  //   if (tradeChart !== null) {
  //     if (theme.palette.mode === 'dark') {
  //       tradeChart.applyOptions({
  //         upColor: '#FF6838',
  //         downColor: '#00C076',
  //         borderDownColor: '#00C076',
  //         borderUpColor: '#FF6838',
  //         wickDownColor: '#00C076',
  //         wickUpColor: '#FF6838',
  //       })
  //     } else {
  //       tradeChart.applyOptions({})
  //     }
  //   }
  // }, [theme])

  useEffect(() => {
    getData().then()
  }, [])

  useEffect(() => {
    const ws1D = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1d')
    ws1D.onmessage = function (msg) {
      if (msg.data && tradeChart) {
        const data = JSON.parse(msg.data)
        const lastDayData = chartData[chartData.length - 1]
        lastDayData.OpenPrice = data.k.o
        lastDayData.ClosePrice = data.k.c
        lastDayData.HighPrice = data.k.h
        lastDayData.LowPrice = data.k.l
        const newData = chartData.slice(0, chartData.length - 1)
        newData.push(lastDayData)
        const formatterData = newData.map((item) => {
          const timeStr = moment(item.OpenTime).format('YYYY-MM-DD')
          return {
            time: timeStr,
            open: Number(item.OpenPrice),
            high: Number(item.HighPrice),
            low: Number(item.LowPrice),
            close: Number(item.ClosePrice),
          }
        })
        tradeChart.setData(formatterData)
      }
    }
  }, [tradeChart])

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
