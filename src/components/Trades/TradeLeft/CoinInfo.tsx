/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useTheme } from '@mui/material'
import { Anchor } from '../TradeRight/AltcoinCard'
import { PoolParams } from '../../../store/FactorySlice'
import { align } from '../../../globalStyle'
import { useRootStore } from '../../../store/root'
import { useEffect, useState, useMemo } from 'react'

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

  const {
    BTCPrice, 
    isBTCRise,
    tradePairIndex,
    pairConfig,
  } = useRootStore((state) => ({
    BTCPrice: state.BTCPrice,
    isBTCRise: state.isBTCRise,
    tradePairIndex: state.tradePairIndex,
    pairConfig: state.pairConfig,
  }))

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
    <div css={[align]} style={{maxWidth: '80vw'}}>
        <div className="symbol" css={[align]} style={{
          justifyContent: 'flex-start', 
          minWidth: '100px'
        }}>
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
        <div
          css={css`
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-width: 100px;
          `}
        >
          <span
            css={css`
              font-size: 12px;
              margin-bottom: 5px;
              line-height: 1.4;
            `}
          >
            Price
          </span>
          <span
            css={css`
              font-size: 14px;
              line-height: 1.4;
              color: ${isBTC ? (isBTCRise ? '#009b72' : '#db4c40') : "#fff"};                         
            `}
          >
            {isBTC ? '$' + Number(BTCPrice).toLocaleString('en-US', { maximumFractionDigits: 2 }) : (priceData ? '$' + priceData.price?.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '-')}
          </span>
        </div>               
        <div
          css={css`
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-width: 100px;
          `}
        >
          <span
            css={css`
              font-size: 12px;
              margin-bottom: 5px;
              line-height: 1.4;
            `}
          >
            24h Change
          </span>
          <span
            css={css`
              font-size: 14px;
              line-height: 1.4;
              div {
                display: flex;
                align-items: center;
                justify-content: flex-start;
              svg {
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
            <Anchor changeInString={(priceData ? priceData[isBTC ? 'usd_24h_change' : '24h_change'] : 0).toFixed(2)} />
          </span>
        </div> 
        <div
          css={css`
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-width: 150px;
          `}
        >
          <span
            css={css`
              font-size: 12px;
              margin-bottom: 5px;
              line-height: 1.4;
            `}
          >
            24h Volume
          </span>
          <span
            css={css`
              font-size: 14px;
              line-height: 1.4;
              div {
                display: flex;
                align-items: center;
                justify-content: flex-start;
              svg {
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
            {'$' + (priceData ? priceData[isBTC ? 'usd_24h_vol' : '24h_volume'] : 0)?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '-'}
          </span>
        </div>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-width: 150px;
          `}
        >
          <span
            css={css`
              font-size: 12px;
              margin-bottom: 5px;
              line-height: 1.4;
            `}
          >
            Market Cap
          </span>
          <span
            css={css`
              font-size: 14px;
              line-height: 1.4;
              div {
                display: flex;
                align-items: center;
                justify-content: flex-start;
              svg {
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
            {'$' + (priceData ? priceData[isBTC ? 'usd_market_cap' : 'market_cap'] : 0)?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '-'}
          </span>
        </div>
        {
          !isBTC && (
          <div
            css={css`
              display: flex;
              flex-direction: column;
              justify-content: center;
              min-width: 100px;
              margin-right: 20px;
            `}
          >
            <span
              css={css`
                font-size: 12px;
                margin-bottom: 5px;
                line-height: 1.4;
              `}
            >
              Funding Fee
            </span>
            <span
              css={css`
                font-size: 14px;
                line-height: 1.4;
                div {
                  display: flex;
                  align-items: center;
                  justify-content: flex-start;
                svg {
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
              {pool?.fundingFeePerBlockP ? pool.fundingFeePerBlockP.toFixed() : '-'}
            </span>
          </div>            
          )
        }                                
    </div>
  )
}
