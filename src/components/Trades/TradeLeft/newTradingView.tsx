/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useCallback, useEffect } from 'react'
import { useTheme } from '@mui/material'

export default function TradingViewWidget() {
  const theme = useTheme()
  const createWidget = useCallback(() => {
    if (document.getElementById('tradingview_2daf6') && 'TradingView' in window) {
      new window.TradingView.widget({
        autosize: true,
        symbol: 'BINANCE:BTCUSDT',
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
        style: '1',
        locale: 'en',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: 'tradingview_2daf6',
      })
    }
  }, [theme])
  useEffect(() => {
    new Promise((resolve) => {
      const script = document.createElement('script')
      script.id = 'tradingview-widget-loading-script'
      script.src = 'https://s3.tradingview.com/tv.js'
      script.type = 'text/javascript'
      script.onload = resolve
      document.head.appendChild(script)
    }).then(() => createWidget())
  }, [theme])

  return (
    <div className="tradingview-widget-container">
      <div
        id="tradingview_2daf6"
        css={css`
          height: 480px;
        `}
      />
    </div>
  )
}
