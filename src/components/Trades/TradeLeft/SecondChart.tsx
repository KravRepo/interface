/** @jsxImportSource @emotion/react */
import { Box, useTheme } from '@mui/material'
import { useCallback, useEffect, useMemo } from 'react'
import { css } from '@emotion/react'
import { useRootStore } from '../../../store/root'
import { TVChartContainer } from './TVChartContainer'

export const SecondChart = () => {
  const theme = useTheme()
  const tradePairIndex = useRootStore((store) => store.tradePairIndex)
  const pairConfig = useRootStore((store) => store.pairConfig)
  const tradingViewSymbol = useMemo(() => {
    return pairConfig[tradePairIndex].chartSymbol
  }, [tradePairIndex, pairConfig])
  const createWidget = useCallback(() => {
    if (document.getElementById('tradingview_2daf6') && 'TradingView' in window) {
      new window.TradingView.widget({
        autosize: true,
        symbol: tradingViewSymbol,
        interval: '1',
        timezone: 'Etc/UTC',
        theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
        style: '3',
        locale: 'en',
        enable_publishing: false,
        hide_top_toolbar: true,
        hide_legend: true,
        save_image: false,
        hide_volume: true,
        container_id: 'tradingview_2daf6',
      })
    }
  }, [theme, tradingViewSymbol])
  useEffect(() => {
    new Promise((resolve) => {
      const script = document.createElement('script')
      script.id = 'tradingview-widget-loading-script'
      script.src = 'https://s3.tradingview.com/tv.js'
      script.type = 'text/javascript'
      script.onload = resolve
      document.head.appendChild(script)
    }).then(() => createWidget())
  }, [createWidget])
  return (
    <Box>
      <div className="tradingview-widget-container">
        {!pairConfig[tradePairIndex].useDataFeed && (
          <div
            css={css`
              height: 440px;
            `}
            id="tradingview_2daf6"
          />
        )}
        {pairConfig[tradePairIndex].useDataFeed && (
          <div
            css={css`
              height: 440px;
              display: flex;
              width: 100%;
              align-items: center;
              justify-content: center;
              font-family: 'GT-Flexa-Bold-Trial';
              font-size: 32px;
            `}
          >
            <TVChartContainer symbol={pairConfig[tradePairIndex].symbol} />
          </div>
        )}
      </div>
    </Box>
  )
}
