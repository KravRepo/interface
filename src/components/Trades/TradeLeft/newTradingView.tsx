/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useCallback, useEffect, useMemo } from 'react'
import { useTheme } from '@mui/material'
import { useRootStore } from '../../../store/root'

export default function TradingViewWidget() {
  const tradePairIndex = useRootStore((store) => store.tradePairIndex)
  const pairConfig = useRootStore((store) => store.pairConfig)
  const tradingViewSymbol = useMemo(() => {
    return pairConfig[tradePairIndex].chartSymbol
  }, [tradePairIndex, pairConfig])
  const theme = useTheme()
  const createWidget = useCallback(() => {
    if (document.getElementById('tradingview_2daf6') && 'TradingView' in window) {
      new window.TradingView.widget({
        autosize: true,
        symbol: tradingViewSymbol,
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
        style: '1',
        locale: 'en',
        enable_publishing: false,
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
