/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useTheme } from '@mui/material'
import { Anchor } from '../TradeRight/AltcoinCard'
import { PoolParams } from '../../../store/FactorySlice'
import { align } from '../../../globalStyle'
import { useEffect, useState } from 'react'

interface PriceData {
  '24h_change': number
  '24h_volume': number
  market_cap: number
  price: number
  usd_24h_change: number
  usd_24h_vol: number
  usd_market_cap: number
}

export default function CoinInfo({ isBTC, pool }: { isBTC?: boolean; pool?: PoolParams }) {
  const theme = useTheme()
  const [btcPriceData, setBtcPriceData] = useState<PriceData | null>(null)
  const [poolPriceData, setPoolPriceData] = useState<PriceData | null>(null)
  const [isBtcLoading, setIsBtcLoading] = useState<boolean>(true)
  const [isPoolLoading, setIsPoolLoading] = useState<boolean>(true)
  const [retryCount, setRetryCount] = useState<number>(0)

  const btcUrl = `https://krav-oracle.onrender.com/btc`
  const poolUrl = pool ? `https://api.krav.trade/krav/v1/price/${pool.tokenT?.toLowerCase()}` : ''

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
          console.log('Error fetching BTC data:', error)
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
          console.log('Error fetching pool data:', error)
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

  if (isBTC && isBtcLoading) {
    return <div>Loading BTC data...</div>
  }

  if (!isBTC && isPoolLoading) {
    return <div>Loading pool data...</div>
  }

  const priceData = isBTC ? btcPriceData : poolPriceData

  return (
    <div css={[align]}>
      {pool && (
        <div css={[align]}>
          <img
            css={css`
              border-radius: 50%;
              background: ${theme.palette.mode === 'dark' ? '#fff' : ''};
              margin-left: 10px;
              margin-right: 5px;
            `}
            src={pool.logoSource}
            height="15"
            width="15"
            alt={`${pool.symbol} logo`}
          />
          {pool.symbol}
        </div>
      )}
      <table
        css={css`
          font-size: 12px;
          border-spacing: 20px 2px;
          text-align: right;
          width: 100%;
          padding: 10px;
        `}
      >
        <thead
          css={css`
            color: #757575;
            td {
              white-space: nowrap;
            }
          `}
        >
          <tr>
            {!isBTC && <td>Price</td>}
            <td>24h</td>
            <td>24h Volume</td>
            <td>Market Cap</td>
            {!isBTC && <td>Funding Rate</td>}
          </tr>
        </thead>
        <tbody
          css={css`
            td > div {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              > svg {
                margin: -10px 0px -10px -5px;
              }
            }
            .up {
              color: ${theme.palette.success.main};
            }
            .down {
              color: ${theme.palette.error.main};
            }
          `}
        >
          <tr>
            {!isBTC && (
              <td>{priceData ? '$' + priceData.price?.toLocaleString('en-US', { maximumFractionDigits: 5 }) : '-'}</td>
            )}
            <td>
              <Anchor changeInString={(priceData ? priceData[isBTC ? 'usd_24h_change' : '24h_change'] : 0).toFixed(2)} />
            </td>
            <td>
              {'$' + (priceData ? priceData[isBTC ? 'usd_24h_vol' : '24h_volume'] : 0)?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '-'}
            </td>
            <td>
              {'$' + (priceData ? priceData[isBTC ? 'usd_market_cap' : 'market_cap'] : 0)?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '-'}
            </td>
            {!isBTC && <td>{pool?.fundingFeePerBlockP ? pool.fundingFeePerBlockP.toFixed() : '-'}</td>}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
