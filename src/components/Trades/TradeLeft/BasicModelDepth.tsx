/** @jsxImportSource @emotion/react */
import * as echarts from 'echarts'
import React, { Dispatch, useEffect, useMemo, useRef, useState } from 'react'
import { css, useTheme } from '@mui/material'
import BigNumber from 'bignumber.js'
import { useRootStore } from '../../../store/root'
import { getReachPrice, getTakeProfit } from '../../../utils/math'

type BasicModelDepthProps = {
  setPriceReaches: Dispatch<React.SetStateAction<BigNumber>>
  setTakeProfit: Dispatch<React.SetStateAction<BigNumber>>
  setTakeProfitPercentage: Dispatch<React.SetStateAction<BigNumber>>
  isBuy: boolean
  leverage: number
  liquidityPrice: BigNumber
  positionSize: BigNumber
  tradeType: number
  limitPrice: string | BigNumber
}

export const BasicModelDepth = ({
  setPriceReaches,
  setTakeProfit,
  setTakeProfitPercentage,
  isBuy,
  leverage,
  liquidityPrice,
  positionSize,
  tradeType,
  limitPrice,
}: BasicModelDepthProps) => {
  const theme = useTheme()
  const [depthCharts, setDepthCharts] = useState<null | echarts.ECharts>(null)
  const currentBTCPrice = useRootStore((state) => state.BTCPrice)
  const tradePool = useRootStore((state) => state.tradePool)
  const depthRef = useRef(null)

  const BTCPrice = useMemo(() => {
    return tradeType === 0 ? currentBTCPrice : new BigNumber(limitPrice)
  }, [tradeType, limitPrice, currentBTCPrice])
  //TODO: fix JPY charts
  const depthOptions = useMemo(() => {
    return {
      // title: {
      //   text: 'Depth',
      // },
      backgroundColor: theme.background.primary,
      tooltip: {
        backgroundColor: theme.background.primary,
        borderWidth: 1,
        borderColor: '#000',
        textStyle: {
          color: 'rgba(255,255,255,0.9)',
        },
        formatter: function (params: any) {
          const takeProfit = params[0].data
          if (takeProfit > 0) {
            const takeProfitPre = getTakeProfit(BTCPrice, new BigNumber(params[0].data), isBuy, leverage, false)
            const takeProfitAmount = positionSize.times(takeProfitPre.div(100))
            setPriceReaches(new BigNumber(params[0].data))
            setTakeProfitPercentage(new BigNumber(takeProfitPre))
            setTakeProfit(takeProfitAmount)
            return `
              <div style='padding-left: 14px; font-weight: 500; color: ${theme.text.primary}'>
              <p style='margin: 0;font-size: 16px'>${leverage} x ${isBuy ? 'Long' : 'Short'}</p>
              <p style='margin: 0;font-size: 12px'>When the price reaches <span style='color: #FF6838'> ${new BigNumber(
                params[0].data
              ).toFixed(2)}</span></p>
           <p style='margin: 0;font-size: 12px'>the profit will be <span style='color: #00C076'>${takeProfitAmount.toFixed(
             2
           )} ${tradePool.symbol}(+${takeProfitPre.toFixed(0)}%)</span></p>
             </div>
            `
          } else {
            setTakeProfit(new BigNumber(0))
            return
          }
        },
        trigger: 'axis',
      },
      legend: {
        show: false,
      },
      grid: {
        left: '0',
        right: '16px',
        top: '26px',
        bottom: '16px',
        containLabel: true,
      },
      xAxis: {
        boundaryGap: false,
        type: 'category',
        data: [
          liquidityPrice.minus(300).toFixed(2),
          liquidityPrice.minus(250).toFixed(2),
          liquidityPrice.minus(200).toFixed(2),
          liquidityPrice.minus(150).toFixed(2),
          liquidityPrice.minus(100).toFixed(2),
          liquidityPrice.toFixed(2),
          liquidityPrice.toFixed(2),
          liquidityPrice.toFixed(2),
          liquidityPrice.toFixed(2),
          BTCPrice.minus(liquidityPrice).isGreaterThan(50) ? liquidityPrice.plus(50).toFixed(2) : BTCPrice.toFixed(2),
          BTCPrice.minus(liquidityPrice).isGreaterThan(50) ? liquidityPrice.plus(50).toFixed(2) : BTCPrice.toFixed(2),
          BTCPrice.minus(liquidityPrice).isGreaterThan(50) ? liquidityPrice.plus(50).toFixed(2) : BTCPrice.toFixed(2),
          BTCPrice.minus(liquidityPrice).isGreaterThan(50) ? liquidityPrice.plus(50).toFixed(2) : BTCPrice.toFixed(2),
          BTCPrice.minus(liquidityPrice).isGreaterThan(50) ? liquidityPrice.plus(50).toFixed(2) : BTCPrice.toFixed(2),
          BTCPrice.toFixed(2),
          getReachPrice(leverage, isBuy, 20, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 25, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 50, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 75, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 100, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 150, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 200, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 250, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 300, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 400, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 500, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 600, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 700, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 800, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).plus(50).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).plus(150).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).plus(250).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).plus(350).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).plus(450).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).plus(550).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).plus(650).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).plus(750).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).plus(850).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).plus(950).toFixed(2),
        ],
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: [
        {
          showSymbol: false,
          name: 'Step Start',
          type: 'line',
          step: 'start',
          label: {
            show: false,
          },
          lineStyle: {
            color: '#009B72',
          },
          areaStyle: {
            color: '#009B72',
            opacity: 0.1,
          },
          markArea: {
            itemStyle: {
              color: '#FBEFC2',
              opacity: 0.25,
            },
            data: [
              [
                {
                  coord: [0, 100000 + getReachPrice(leverage, isBuy, 900, BTCPrice).plus(950).toNumber()],
                },
                {
                  coord: [6, 0],
                },
              ],
            ],
          },
          markLine: {
            lineStyle: {
              color: '#FF6838',
              type: 'solid',
            },

            symbol: ['none', 'none'],
            label: {
              show: true,
              formatter: 'liquidation price',
            },
            data: [{ xAxis: 6 }],
          },
          data: [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            getReachPrice(leverage, isBuy, 20, BTCPrice).toFixed(2),
            getReachPrice(leverage, isBuy, 25, BTCPrice).toFixed(2),
            getReachPrice(leverage, isBuy, 50, BTCPrice).toFixed(2),
            getReachPrice(leverage, isBuy, 75, BTCPrice).toFixed(2),
            getReachPrice(leverage, isBuy, 100, BTCPrice).toFixed(2),
            getReachPrice(leverage, isBuy, 150, BTCPrice).toFixed(2),
            getReachPrice(leverage, isBuy, 200, BTCPrice).toFixed(2),
            getReachPrice(leverage, isBuy, 250, BTCPrice).toFixed(2),
            getReachPrice(leverage, isBuy, 300, BTCPrice).toFixed(2),
            getReachPrice(leverage, isBuy, 400, BTCPrice).toFixed(2),
            getReachPrice(leverage, isBuy, 500, BTCPrice).toFixed(2),
            getReachPrice(leverage, isBuy, 600, BTCPrice).toFixed(2),
            getReachPrice(leverage, isBuy, 700, BTCPrice).toFixed(2),
            getReachPrice(leverage, isBuy, 800, BTCPrice).toFixed(2),
            getReachPrice(leverage, isBuy, 900, BTCPrice).toFixed(2),
            getReachPrice(leverage, isBuy, 900, BTCPrice).plus(50).toFixed(2),
            getReachPrice(leverage, isBuy, 900, BTCPrice).plus(150).toFixed(2),
            getReachPrice(leverage, isBuy, 900, BTCPrice).plus(250).toFixed(2),
            getReachPrice(leverage, isBuy, 900, BTCPrice).plus(350).toFixed(2),
            getReachPrice(leverage, isBuy, 900, BTCPrice).plus(450).toFixed(2),
            getReachPrice(leverage, isBuy, 900, BTCPrice).plus(550).toFixed(2),
            getReachPrice(leverage, isBuy, 900, BTCPrice).plus(650).toFixed(2),
            getReachPrice(leverage, isBuy, 900, BTCPrice).plus(750).toFixed(2),
            getReachPrice(leverage, isBuy, 900, BTCPrice).plus(850).toFixed(2),
            getReachPrice(leverage, isBuy, 900, BTCPrice).plus(950).toFixed(2),
          ],
        },
      ],
    }
  }, [isBuy, liquidityPrice, BTCPrice, theme])

  const shortDepthOptions = useMemo(() => {
    return {
      // title: {
      //   text: 'Depth',
      // },
      backgroundColor: theme.background.primary,
      tooltip: {
        backgroundColor: theme.background.primary,
        borderWidth: 1,
        borderColor: '#000',
        textStyle: {
          color: 'rgba(255,255,255,0.9)',
        },
        formatter: function (params: any) {
          const diffBTCPrice = params[0].data
          const reachesPrice = BTCPrice.plus(new BigNumber(diffBTCPrice).times(-1))
          const takeProfitPre = Number(getTakeProfit(BTCPrice, reachesPrice, isBuy, leverage, false).toFixed(0))
          setTakeProfitPercentage(new BigNumber(takeProfitPre))
          if (takeProfitPre > 0) {
            const takeProfitAmount = positionSize.times(takeProfitPre / 100)
            setPriceReaches(reachesPrice)
            setTakeProfit(takeProfitAmount)
            return `
              <div style='padding-left: 14px; font-weight: 500; color: ${theme.text.primary}'>
              <p style='margin: 0;font-size: 16px'>${leverage} x ${isBuy ? 'Long' : 'Short'}</p>
              <p style='margin: 0;font-size: 12px'>When the price reaches <span style='color: #FF6838'> ${reachesPrice.toFixed(
                2
              )}</span></p>
              <p style='margin: 0;font-size: 12px'>the profit will be <span style='color: #00C076'>${takeProfitAmount.toFixed(
                2
              )} ${tradePool.symbol}(+${takeProfitPre}%)</span></p>
              </div>
            `
          } else {
            setTakeProfit(new BigNumber(0))
            return
          }
        },
        trigger: 'axis',
      },
      legend: {
        show: false,
      },
      grid: {
        left: '0',
        right: '16px',
        top: '26px',
        bottom: '16px',
        containLabel: true,
      },
      xAxis: {
        boundaryGap: false,
        type: 'category',
        data: [
          getReachPrice(leverage, isBuy, 900, BTCPrice).minus(950).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).minus(850).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).minus(750).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).minus(650).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).minus(550).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).minus(450).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).minus(350).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).minus(250).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).minus(150).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).minus(50).toFixed(2),
          getReachPrice(leverage, isBuy, 900, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 800, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 700, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 600, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 500, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 400, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 300, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 250, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 200, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 150, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 100, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 75, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 50, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 25, BTCPrice).toFixed(2),
          getReachPrice(leverage, isBuy, 20, BTCPrice).toFixed(2),
          BTCPrice.toFixed(2),
          BTCPrice.plus(liquidityPrice).isGreaterThan(50) ? liquidityPrice.minus(50).toFixed(2) : BTCPrice.toFixed(2),
          BTCPrice.plus(liquidityPrice).isGreaterThan(50) ? liquidityPrice.minus(50).toFixed(2) : BTCPrice.toFixed(2),
          BTCPrice.plus(liquidityPrice).isGreaterThan(50) ? liquidityPrice.minus(50).toFixed(2) : BTCPrice.toFixed(2),
          BTCPrice.plus(liquidityPrice).isGreaterThan(50) ? liquidityPrice.minus(50).toFixed(2) : BTCPrice.toFixed(2),
          BTCPrice.plus(liquidityPrice).isGreaterThan(50) ? liquidityPrice.minus(50).toFixed(2) : BTCPrice.toFixed(2),
          liquidityPrice.toFixed(2),
          liquidityPrice.toFixed(2),
          liquidityPrice.toFixed(2),
          liquidityPrice.toFixed(2),
          liquidityPrice.minus(100).toFixed(2),
          liquidityPrice.minus(150).toFixed(2),
          liquidityPrice.minus(200).toFixed(2),
          liquidityPrice.minus(250).toFixed(2),
          liquidityPrice.minus(300).toFixed(2),
        ],
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: [
        {
          showSymbol: false,
          name: 'Step Start',
          type: 'line',
          step: 'start',
          label: {
            show: false,
          },
          lineStyle: {
            color: '#DB4C40',
          },
          areaStyle: {
            color: '#DB4C40',
            opacity: 0.1,
          },
          markArea: {
            itemStyle: {
              color: '#FBEFC2',
              opacity: 0.25,
            },
            data: [
              [
                {
                  coord: [
                    33,
                    100000 +
                      getReachPrice(leverage, isBuy, 900, BTCPrice)
                        .minus(950)
                        .minus(BTCPrice)
                        .absoluteValue()
                        .toNumber(),
                  ],
                },
                {
                  coord: [40, 0],
                },
              ],
            ],
          },
          markLine: {
            lineStyle: {
              color: '#FF6838',
              type: 'solid',
            },

            symbol: ['none', 'none'],
            label: {
              show: true,
              formatter: 'liquidation price',
            },
            data: [{ xAxis: 33 }],
          },
          data: [
            getReachPrice(leverage, isBuy, 900, BTCPrice).minus(950).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 900, BTCPrice).minus(850).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 900, BTCPrice).minus(750).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 900, BTCPrice).minus(650).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 900, BTCPrice).minus(550).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 900, BTCPrice).minus(450).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 900, BTCPrice).minus(350).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 900, BTCPrice).minus(250).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 900, BTCPrice).minus(150).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 900, BTCPrice).minus(50).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 900, BTCPrice).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 800, BTCPrice).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 700, BTCPrice).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 600, BTCPrice).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 500, BTCPrice).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 400, BTCPrice).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 300, BTCPrice).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 250, BTCPrice).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 200, BTCPrice).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 150, BTCPrice).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 100, BTCPrice).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 75, BTCPrice).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 50, BTCPrice).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 25, BTCPrice).minus(BTCPrice).absoluteValue().toNumber(),
            getReachPrice(leverage, isBuy, 20, BTCPrice).minus(BTCPrice).absoluteValue().toNumber(),
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
          ],
        },
      ],
    }
  }, [isBuy, liquidityPrice, BTCPrice])

  useEffect(() => {
    if (depthRef.current) {
      if (depthCharts === null) {
        const charts = echarts.init(depthRef.current, undefined, { renderer: 'svg' })
        charts.setOption(isBuy ? depthOptions : shortDepthOptions)
        setDepthCharts(charts)
        window.addEventListener('resize', () => {
          setTimeout(() => {
            charts?.resize()
          }, 1000)
        })
      }
      depthCharts?.setOption(isBuy ? depthOptions : shortDepthOptions)
      window.addEventListener('resize', () => {
        setTimeout(() => {
          depthCharts?.resize()
        }, 1000)
      })
    }
    return () => {
      depthCharts?.dispose()
      setDepthCharts(null)
    }
  }, [depthRef.current, isBuy, liquidityPrice, BTCPrice, theme])

  return (
    <div
      css={css`
        height: 100%;
        border-radius: 8px;
      `}
      ref={depthRef}
    />
  )
}
