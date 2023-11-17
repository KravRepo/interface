/** @jsxImportSource @emotion/react */
import { Box, useTheme } from '@mui/material'
import { useCallback, useEffect, useMemo } from 'react'
import { css } from '@emotion/react'
import { useRootStore } from '../../../store/root'
import { EXCHANGE_CONFIG } from '../../../constant/exchange'

export const SecondChart = () => {
  const theme = useTheme()
  const tradePairIndex = useRootStore((store) => store.tradePairIndex)
  const BTCPrice = useRootStore((store) => store.BTCPrice)
  const tradingViewSymbol = useMemo(() => {
    return EXCHANGE_CONFIG[tradePairIndex].chartSymbol
  }, [tradePairIndex])
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
        {EXCHANGE_CONFIG[tradePairIndex].symbol !== 'NDX100' && (
          <div
            css={css`
              height: 440px;
            `}
            id="tradingview_2daf6"
          />
        )}
        {EXCHANGE_CONFIG[tradePairIndex].symbol === 'NDX100' && (
          <div
            css={css`
              height: 440px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'GT-Flexa-Bold-Trial';
              font-size: 32px;
            `}
          >
            NDX100&nbsp;:&nbsp;{BTCPrice.toFixed(EXCHANGE_CONFIG[tradePairIndex].fixDecimals)}
          </div>
        )}
      </div>
    </Box>
  )
}
