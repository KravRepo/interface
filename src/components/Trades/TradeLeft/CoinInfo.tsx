/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Tooltip, useMediaQuery, useTheme } from '@mui/material'
import { Anchor } from '../TradeRight/AltcoinCard'
import { PoolParams } from '../../../store/FactorySlice'
import { align } from '../../../globalStyle'
import { useRootStore } from '../../../store/root'
import { useEffect, useState, useMemo } from 'react'
import { useGetMarketStats } from '../../../hook/hookV8/useGetMarketStats'
import { Trans, msg } from '@lingui/macro'
import { useLingui } from '@lingui/react'

interface PriceData {
  '24h_change': number
  '24h_volume': number
  market_cap: number
  price: number
  usd_24h_change: number
  usd_24h_vol: number
  usd_market_cap: number
}

const PriceDataTitle = {
  Price: msg`Price`,
  '24h Change': msg`24h Change`,
  '24h Volume': msg`24h Volume`,
  'Funding Rate (S)': msg`Funding Rate (S)`,
  'Funding Rate (L)': msg`Funding Rate (L)`,
  'Market Cap': msg`Market Cap`,
}

export default function CoinInfo({ isBTC, pool }: { isBTC?: boolean; pool?: PoolParams }) {
  const theme = useTheme()
  const [btcPriceData, setBtcPriceData] = useState<PriceData | null>(null)
  const [poolPriceData, setPoolPriceData] = useState<PriceData | null>(null)
  const [isBtcLoading, setIsBtcLoading] = useState<boolean>(true)
  const [isPoolLoading, setIsPoolLoading] = useState<boolean>(true)
  const [retryCount, setRetryCount] = useState<number>(0)

  const { i18n } = useLingui()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const btcUrl = `https://krav-oracle.onrender.com/btc`
  const poolUrl = pool ? `https://v1-api.krav.trade/krav/v1/price/${pool.tokenT?.toLowerCase()}` : ''

  const { BTCPrice, isBTCRise, tradePairIndex, pairConfig } = useRootStore((state) => ({
    BTCPrice: state.BTCPrice,
    isBTCRise: state.isBTCRise,
    tradePairIndex: state.tradePairIndex,
    pairConfig: state.pairConfig,
  }))

  const { openDaiLong, openDaiShort } = useGetMarketStats(
    pool?.storageT as any,
    pool?.decimals as any,
    pool?.pairInfoT as any,
    0
  )

  const tradePair = useMemo(() => {
    return pairConfig[tradePairIndex]
  }, [tradePairIndex, pairConfig])

  useEffect(() => {
    if (isBTC) {
      const fetchBtcData = async () => {
        setIsBtcLoading(true)
        try {
          const response = await fetch(btcUrl, {
            mode: 'cors',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`)
          }

          const data = await response.json()
          const fetchedData = data.bitcoin

          if (!fetchedData) {
            throw new Error('Fetched data is undefined')
          }

          setBtcPriceData(fetchedData)
        } catch (error) {
          // console.log('Error fetching BTC data:', error)
          if (retryCount < 10) {
            setRetryCount(retryCount + 1)
          } else {
            setBtcPriceData(null)
          }
        } finally {
          setIsBtcLoading(false)
        }
      }

      fetchBtcData()
    }
  }, [isBTC, btcUrl, retryCount])

  useEffect(() => {
    if (!isBTC && pool) {
      if (!pool.tokenT) {
        setIsPoolLoading(false)
        setPoolPriceData(null)
        return
      }
      const fetchPoolData = async () => {
        setIsPoolLoading(true)
        try {
          const response = await fetch(poolUrl, {
            mode: 'cors',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error(`Network response error: ${response.statusText}`)
          }

          const data = await response.json()
          const fetchedData = data?.data?.[pool.tokenT?.toLowerCase() || '']

          if (!fetchedData) {
            throw new Error('Fetched data is undefined')
          }

          setPoolPriceData(fetchedData)
        } catch (error) {
          // console.log('Error fetching pool data:', error)
          if (retryCount < 10) {
            setRetryCount(retryCount + 1)
          } else {
            setPoolPriceData(null)
          }
        } finally {
          setIsPoolLoading(false)
        }
      }

      fetchPoolData()
    }
  }, [isBTC, pool, poolUrl, retryCount])

  const data = useMemo(() => {
    const priceData = isBTC ? btcPriceData : poolPriceData
    return {
      ['Price']: {
        content: isBTC
          ? '$' + BTCPrice?.toFormat(2, 3) ?? '-'
          : priceData
          ? '$' + priceData.price?.toLocaleString('en-US', { maximumFractionDigits: 2 })
          : '-',
      },
      ...(isMobile
        ? {}
        : {
            ['24h Change']: {
              content: (
                <Anchor
                  changeInString={(priceData ? priceData[isBTC ? 'usd_24h_change' : '24h_change'] : 0).toFixed(2)}
                />
              ),
            },
            ['24h Volume']: {
              content:
                '$' +
                  (priceData ? priceData[isBTC ? 'usd_24h_vol' : '24h_volume'] : 0)?.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                  }) || '-',
            },
            ['Market Cap']: {
              content:
                '$' +
                  (priceData ? priceData[isBTC ? 'usd_market_cap' : 'market_cap'] : 0)?.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                  }) || '-',
            },
            ...(isBTC
              ? {}
              : {
                  ['Funding Rate (L)']: {
                    tooltip: 'Funding rate (long) hourly rate, charged per block on the position size.',
                    content: (
                      <p
                        style={{
                          color:
                            openDaiShort &&
                            openDaiLong &&
                            !openDaiLong.isEqualTo(0) &&
                            !isNaN(
                              parseFloat(
                                openDaiShort.minus(openDaiLong).times(0.000002).div(openDaiLong).times(1800).toString()
                              )
                            )
                              ? openDaiShort
                                  .minus(openDaiLong)
                                  .times(0.000002)
                                  .div(openDaiLong)
                                  .times(1800)
                                  .isLessThan(0)
                                ? '#f53c58'
                                : '#13ba7b'
                              : '',
                        }}
                      >
                        {openDaiLong?.isEqualTo(0)
                          ? 'no longs open'
                          : openDaiShort && openDaiLong && !openDaiLong.isEqualTo(0)
                          ? openDaiShort.minus(openDaiLong).times(0.000002).div(openDaiLong).times(1800).toFixed(3) +
                            '%'
                          : '-'}
                      </p>
                    ),
                  },
                  ['Funding Rate (S)']: {
                    tooltip: 'Funding rate (short) hourly rate, charged per block on the position size.',
                    content: (
                      <p
                        style={{
                          color:
                            openDaiShort &&
                            openDaiLong &&
                            !openDaiShort.isEqualTo(0) &&
                            !isNaN(
                              parseFloat(
                                openDaiShort.minus(openDaiLong).times(0.000002).div(openDaiLong).times(1800).toString()
                              )
                            )
                              ? openDaiLong
                                  .minus(openDaiShort)
                                  .times(0.000002)
                                  .div(openDaiShort)
                                  .times(1800)
                                  .isLessThan(0)
                                ? '#f53c58'
                                : '#13ba7b'
                              : '',
                        }}
                      >
                        {openDaiShort?.isEqualTo(0)
                          ? 'no shorts open'
                          : openDaiShort && openDaiLong
                          ? openDaiLong.minus(openDaiShort).times(0.000002).div(openDaiShort).times(1800).toFixed(3) +
                            '%'
                          : 'no shorts open'}
                      </p>
                    ),
                  },
                }),
          }),
    } as { [key: string]: { content: any; tooltip?: string } }
  }, [isBTC, btcPriceData, poolPriceData, BTCPrice, isMobile, openDaiShort, openDaiLong])

  if (isBTC && isBtcLoading) {
    return (
      <div>
        <Trans>Loading BTC data...</Trans>
      </div>
    )
  }

  if (!isBTC && isPoolLoading) {
    return (
      <div>
        <Trans>Loading pool data...</Trans>
      </div>
    )
  }

  return (
    <div
      css={[
        css`
          display: grid;
          align-items: center;
          max-width: 800px;
          width: max-content;
          gap: 10px;
          grid-template-columns: 100px 120px 100px 100px 150px 150px 125px 125px;
          @media screen and (max-width: 960px) {
            flex-wrap: wrap;
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
          }
          .up {
            color: ${theme.palette.success.main};
          }
          .down {
            color: ${theme.palette.error.main};
          }
        `,
      ]}
    >
      <div
        css={css`
          @media screen and (max-width: 960px) {
            grid-column-start: 1;
          }
        `}
      >
        {isBTC ? i18n._(msg`Market`) : i18n._(msg`Collateral`)}
      </div>
      <div
        className="symbol"
        css={[
          align,
          css`
            justify-content: flex-start;
            margin-right: 10px;
            @media screen and (max-width: 960px) {
              grid-column-start: span 5;
            }
            ${theme.breakpoints.down('sm')} {
              grid-column-start: 2;
            }
          `,
        ]}
      >
        <img
          css={css`
            border-radius: 50%;
            background: ${theme.palette.mode === 'dark' ? '#fff' : ''};
            margin-right: 5px;
            font-weight: 800;
          `}
          src={isBTC ? tradePair.logoSource.default : pool?.logoSource}
          height="15"
          width="15"
          alt={`${pool?.symbol} logo`}
        />
        {isBTC ? tradePair.titleSymbol : pool?.symbol}
      </div>
      {Object.keys(data).map((key) => {
        const i = data?.[key as keyof typeof PriceDataTitle]
        if (!i) return
        return (
          <Tooltip
            key={key}
            title={i.tooltip}
            sx={{
              cursor: 'default',
            }}
            slotProps={{
              tooltip: {
                sx: {
                  cursor: 'default',
                  backgroundColor: theme.background.third,
                },
              },
            }}
          >
            <div
              css={css`
                display: flex;
                flex-direction: column;
                justify-content: center;
              `}
            >
              <span
                css={css`
                  font-size: 12px;
                  margin-bottom: 5px;
                  line-height: 1.4;
                  white-space: nowrap;
                  cursor: default;
                `}
              >
                {i18n._(PriceDataTitle[key as keyof typeof PriceDataTitle])}
              </span>

              <span
                css={css`
                  font-size: 14px;
                  line-height: 1.4;
                  color: ${isBTC && key === 'Price' ? (isBTCRise ? '#009b72' : '#db4c40') : '#fff'};
                  cursor: default;
                  div {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    svg {
                      margin: -10px 0px -10px -5px;
                    }
                  }
                `}
              >
                {i?.content}
              </span>
            </div>
          </Tooltip>
        )
      })}
    </div>
  )
}
