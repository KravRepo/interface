/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as echarts from 'echarts'

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
          name: 'BTC Price',
          type: 'line',
          showSymbol: false,
          data: chartData,
          smooth: true,
          endLabel: {
            show: true,
            backgroundColor: 'red',
            padding: [4, 8, 4, 8],
            color: '#fff',
            borderRadius: 2,
          },
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

  const updateCharts = useCallback(
    (data: number) => {
      if (secondCharts) {
        const newData = chartData
        const nowStr = new Date().toLocaleString()
        newData.push([nowStr, data])
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
    },
    [secondCharts]
  )

  const connectWs = useCallback(
    (url: string) => {
      setTimeout(() => {
        const ws1D = new WebSocket(url)
        ws1D.onmessage = function (msg) {
          if (msg.data) {
            new Response(msg.data).json().then((res) => {
              updateCharts(Number(res.k.c))
            })
          }
        }
      }, 2000)
    },
    [updateCharts]
  )

  useEffect(() => {
    const ws1D = new WebSocket('wss://wss.krav.trade:8800/')
    ws1D.onmessage = function (msg) {
      if (msg.data && secondCharts) {
        new Response(msg.data).json().then((res) => {
          updateCharts(Number(res.k.c))
        })
      }
    }
    ws1D.onclose = function () {
      setTimeout(() => connectWs('wss://wss.krav.trade:8800/'), 2000)
    }
  }, [secondCharts])

  useEffect(() => {
    if (secondChartRef.current) {
      if (secondCharts === null) {
        const charts = echarts.init(secondChartRef.current, undefined, { renderer: 'svg' })
        charts.setOption(SecondChartOptions)
        setSecondCharts(charts)
        window.addEventListener('resize', () => {
          charts?.resize()
        })
      }
      secondCharts?.setOption(SecondChartOptions)
      window.addEventListener('resize', () => {
        secondCharts?.resize()
      })
    }
    return () => {
      secondCharts?.dispose()
      setSecondCharts(null)
    }
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
