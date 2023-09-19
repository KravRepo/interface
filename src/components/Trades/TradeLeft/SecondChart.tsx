/** @jsxImportSource @emotion/react */
import { Box, useTheme } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { css } from '@emotion/react'

export const SecondChart = () => {
  const theme = useTheme()
  const createWidget = useCallback(() => {
    if (document.getElementById('tradingview_2daf6') && 'TradingView' in window) {
      new window.TradingView.widget({
        autosize: true,
        symbol: 'BINANCE:BTCUSDT',
        interval: '1',
        timezone: 'Etc/UTC',
        theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
        style: '2',
        locale: 'en',
        enable_publishing: false,
        hide_top_toolbar: true,
        hide_legend: true,
        save_image: false,
        hide_volume: true,
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
  }, [createWidget])
  return (
    <Box
      sx={{ mt: '12px', borderRadius: '8px', height: '481px', padding: '18px', background: theme.background.primary }}
    >
      <div className="tradingview-widget-container">
        <div
          css={css`
            height: 440px;
          `}
          id="tradingview_2daf6"
        />
      </div>
    </Box>
  )
}
