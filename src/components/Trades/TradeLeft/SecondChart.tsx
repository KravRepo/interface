/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as echarts from 'echarts'

// type ChartData = {
//   value: any
// }

export const SecondChart = () => {
  const theme = useTheme()
  const [secondCharts, setSecondCharts] = useState<null | echarts.ECharts>(null)
  const [chartData, setChartData] = useState([] as any[])
  const secondChartRef = useRef(null)
  const SecondChartOptions = useMemo(() => {
    return {
      backgroundColor: theme.background.primary,
      tooltip: {
        trigger: 'axis',
        // formatter: function (params: any) {
        //   params = params[0]
        //   console.log('params', params)
        //   const date = new Date(params.name)
        //   return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1]
        // },
        axisPointer: {
          animation: true,
        },
      },
      grid: {
        left: '18px',
        right: '16px',
        top: '26px',
        bottom: '16px',
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        min: function (value: any) {
          return value.min - 1
        },
        max: function (value: any) {
          return value.max + 1
        },
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false,
        },
        position: 'right',
      },
      series: [
        {
          name: 'Fake Data',
          type: 'line',
          showSymbol: false,
          data: chartData,
          smooth: true,
          lineStyle: {
            color: '#DB4C40',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(219, 149, 64, 0.50)',
              },
              {
                offset: 1,
                color: 'rgba(219, 76, 64, 0.00)',
              },
            ]),
          },
        },
      ],
    }
  }, [theme])

  useEffect(() => {
    const ws1D = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1s')
    ws1D.onmessage = function (msg) {
      if (msg.data && secondCharts) {
        const data = JSON.parse(msg.data)
        const newData = chartData
        const nowStr = new Date().toLocaleString()
        newData.push([nowStr, Number(data.k.c)])
        setChartData(newData)
        secondCharts.setOption({
          series: [
            {
              data: newData,
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(219, 149, 64, 0.50)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(219, 76, 64, 0.00)',
                  },
                ]),
              },
            },
          ],
        })
      }
    }
  }, [secondCharts])

  useEffect(() => {
    if (secondChartRef.current) {
      if (secondCharts === null) {
        const charts = echarts.init(secondChartRef.current, undefined, { renderer: 'svg' })
        charts.setOption(SecondChartOptions)
        setSecondCharts(charts)
        window.addEventListener('resize', () => {
          setTimeout(() => {
            charts?.resize()
          }, 1000)
        })
      }
      secondCharts?.setOption(SecondChartOptions)
      window.addEventListener('resize', () => {
        setTimeout(() => {
          secondCharts?.resize()
        }, 1000)
      })
    }
    // return () => {
    //   secondCharts?.dispose()
    //   setSecondCharts(null)
    // }
  }, [secondChartRef.current, theme])
  return (
    <div
      css={css`
        height: 481px;
        border-radius: 8px;
        overflow: hidden;
      `}
      ref={secondChartRef}
    />
  )
}
