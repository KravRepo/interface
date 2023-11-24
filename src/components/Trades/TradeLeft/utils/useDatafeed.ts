import moment from 'moment'
import { useMemo, useRef } from 'react'
import { ONE_WEEK_TIMESTAMP } from '../../../../constant/math'

export const SUPPORTED_RESOLUTIONS = { 1: '1s' }

const configurationData = {
  supported_resolutions: Object.keys(SUPPORTED_RESOLUTIONS),
  supports_marks: false,
  supports_timescale_marks: false,
  supports_time: true,
  reset_cache_timeout: 100,
}

export const useDatafeed = (pair: string) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>()
  const resetCacheRef = useRef<() => void | undefined>()
  const shouldRefetchBars = useRef<boolean>(false)

  const tickerKlineApi = useMemo(() => {
    if (pair === 'NDX100') {
      return 'https://multi-dev.krav.trade/krav/v1/I:NDX/1/minute/'
    } else {
      return 'https://multi-dev.krav.trade/krav/v1/COIN/1/minute/'
    }
  }, [])

  const wssSymbol = useMemo(() => {
    if (pair === 'NDX100') return 'AM'
    else return 'A'
  }, [])

  return useMemo(() => {
    return {
      resetCache: function () {
        shouldRefetchBars.current = true
        resetCacheRef.current?.()
        shouldRefetchBars.current = false
      },
      datafeed: {
        onReady: (callback: any) => {
          setTimeout(() => callback(configurationData))
        },
        resolveSymbol(symbolName: any, onSymbolResolvedCallback: any) {
          const symbolInfo = {
            name: symbolName,
            type: pair === 'NDX100' ? 'stock' : 'indices',
            description: symbolName + ' / USD',
            ticker: symbolName,
            session: '24x7',
            minmov: 1,
            pricescale: 100,
            timezone: 'Etc/UTC',
            has_intraday: true,
            has_daily: true,
            currency_code: 'USD',
            visible_plots_set: 'ohlc',
            data_status: 'streaming',
          }
          setTimeout(() => onSymbolResolvedCallback(symbolInfo))
        },
        // get history k line
        async getBars(
          symbolInfo: any,
          resolution: any,
          periodParams: any,
          onHistoryCallback: any,
          onErrorCallback: (error: string) => void
        ) {
          const { ticker } = symbolInfo
          try {
            if (!ticker) {
              onErrorCallback('Invalid ticker!')
              return
            }
            const now = new Date().toUTCString()
            const lastWeek = new Date().valueOf() - 2 * ONE_WEEK_TIMESTAMP
            const apiDay = moment(now).format('YYYY-MM-DD')
            const lastApiDay = moment(lastWeek).format('YYYY-MM-DD')
            const apiUrls = `${tickerKlineApi}${lastApiDay}/${apiDay}?sort=asc&limit=5000`
            const klineReq = await fetch(apiUrls)
            const klineData = await klineReq.json()
            const bars = klineData.data.results.map((item: any) => {
              return {
                time: item.t,
                open: Number(item.o),
                high: Number(item.h),
                low: Number(item.l),
                close: Number(item.c),
                // volume: Number(item.QuoteVolume),
              }
            })
            const noData = !bars || bars.length === 0
            onHistoryCallback(bars, { noData })
          } catch {
            onErrorCallback('Unable to load historical data!')
          }
        },
        async subscribeBars(
          symbolInfo: any,
          resolution: any,
          onRealtimeCallback: any,
          _subscribeUID: any,
          onResetCacheNeededCallback: () => void
        ) {
          const { ticker } = symbolInfo
          if (!ticker) {
            return
          }
          intervalRef.current && clearInterval(intervalRef.current)
          resetCacheRef.current = onResetCacheNeededCallback
          const ws1D = new WebSocket('wss://sdk-wsapi.krav.trade:8800')
          ws1D.onmessage = async function (msg) {
            try {
              if (msg.data) {
                let data: any
                try {
                  data = await new Response(msg.data).json()
                } catch (e) {
                  data = await new Response(msg.data).text()
                  const dataOBJ = new Function('return' + data)
                  data = dataOBJ()
                }
                if (data.ev === wssSymbol) {
                  const now = new Date().valueOf()
                  const bar = {
                    time: now,
                    open: Number(data.o),
                    high: Number(data.h),
                    low: Number(data.l),
                    close: Number(data.c),
                    // volume: Number(data.k.v),
                  }
                  onRealtimeCallback(bar)
                }
              }
            } catch (e) {
              console.error('wss error')
            }
          }
        },
        unsubscribeBars: () => {},
      },
    }
  }, [tickerKlineApi, wssSymbol])
}
