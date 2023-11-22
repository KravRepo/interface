import { useEffect, useMemo, useRef } from 'react'
import { useTheme } from '@mui/material'
import { useRootStore } from '../../../store/root'
import { TradeMode } from '../../../store/TradeSlice'
import { widget } from '../../../charting_library'
import { useDatafeed } from './utils/useDatafeed'
// import { widget } from

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)')
  const results = regex.exec(window.location.search)
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

const disabledFeatures = [
  'volume_force_overlay',
  'show_logo_on_all_charts',
  'caption_buttons_text_if_possible',
  'create_volume_indicator_by_default',
  'header_compare',
  'compare_symbol',
  'display_market_status',
  'header_interval_dialog_button',
  'show_interval_dialog_on_key_press',
  'header_symbol_search',
  'popup_hints',
  'header_in_fullscreen_mode',
  'use_localstorage_for_settings',
  'right_bar_stays_on_scroll',
  'symbol_info',
  'timeframes_toolbar',
  'left_toolbar',
]

export const TVChartContainer = ({ symbol }: { symbol: string }) => {
  const chartContainerRef = useRef<HTMLDivElement>({} as HTMLDivElement)
  const { datafeed } = useDatafeed(symbol)
  const theme = useTheme()
  const tradeModel = useRootStore((store) => store.tradeModel)

  const defaultProps = useMemo(() => {
    return {
      symbol: symbol === 'NDX100' ? 'NDX:100' : 'COIN',
      interval: '1',
      datafeedUrl: 'https://demo_feed.tradingview.com',
      libraryPath: '/charting_library/',
      chartsStorageUrl: 'https://saveload.tradingview.com',
      chartsStorageApiVersion: '1.1',
      clientId: 'tradingview.com',
      userId: 'public_user_id',
      fullscreen: false,
      autosize: true,
      studiesOverrides: {},
    }
  }, [symbol])

  useEffect(() => {
    const widgetOptions = {
      symbol: defaultProps.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: datafeed,
      // datafeed: new window.Datafeeds.UDFCompatibleDatafeed(defaultProps.datafeedUrl),
      interval: defaultProps.interval,
      container: chartContainerRef.current,
      library_path: defaultProps.libraryPath,
      theme: theme.palette.mode === 'dark' ? 'Dark' : 'Light',
      locale: getLanguageFromURL() || 'en',
      disabled_features: disabledFeatures,
      enabled_features: ['study_templates', 'iframe_loading_compatibility_mode', 'hide_left_toolbar_by_default'],
      charts_storage_url: defaultProps.chartsStorageUrl,
      charts_storage_api_version: defaultProps.chartsStorageApiVersion,
      client_id: defaultProps.clientId,
      user_id: defaultProps.userId,
      fullscreen: defaultProps.fullscreen,
      autosize: defaultProps.autosize,
      studies_overrides: defaultProps.studiesOverrides,
      overrides: {
        'mainSeriesProperties.style': tradeModel === TradeMode.DEGEN ? 3 : 1,
      },
    }
    // console.log('widget', widget)
    // console.log('window', window.TradingView.widget)
    // const tvWidget = new window.TradingView.widget(widgetOptions as any)
    const tvWidget = new widget(widgetOptions as any)

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {})
    })

    return () => {
      tvWidget.remove()
    }
  }, [defaultProps, theme, tradeModel])

  return (
    <div
      ref={chartContainerRef}
      style={{
        height: '475px',
        width: '100%',
      }}
      className={'TVChartContainer'}
    />
  )
}
