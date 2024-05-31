/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useTheme } from '@mui/material'
import { Anchor } from '../TradeRight/AltcoinCard'
import { PoolParams } from '../../../store/FactorySlice'
import { align } from '../../../globalStyle'
import { useState, useEffect } from 'react';

interface PriceData {
  '24h_change': number;
  '24h_volume': number;
  market_cap: number;
  price: number;
}

export default function CoinInfo({ isBTC, pool }: { isBTC?: boolean; pool?: PoolParams }) {
  const theme = useTheme();
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const url = `https://api.krav.trade/krav/v1/price/${isBTC ? '0x321162Cd933E2Be498Cd2267a90534A804051b11' : pool?.tokenT}`;

  useEffect(() => {
    if ((pool == undefined || !pool || pool == null) && !isBTC) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching data from URL:', url);
        const response = await fetch(url, {
          mode: 'cors',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          console.log('Error fetching data:', response.statusText);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        console.log('Data fetched:', data);

        if (isBTC) {
          console.log('Bitcoin data:', data.data['0x321162Cd933E2Be498Cd2267a90534A804051b11']);
          setPriceData(data.data['0x321162Cd933E2Be498Cd2267a90534A804051b11']);
        } else {
          const tokenData = data.data[pool?.tokenT?.toLowerCase() || ''];
          setPriceData(tokenData);
        }
      } catch (error) {
        console.log('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pool, isBTC, url]);

  if (!pool && !isBTC) return null;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!priceData) {
    return <div>No data available</div>;
  }

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
            <td>Price</td>
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
            <td>
              {priceData ? '$' + priceData.price?.toLocaleString('en-US', { maximumFractionDigits: 5 }) : '-'}
            </td>
            <td>
              <Anchor changeInString={priceData?.['24h_change'].toFixed(4)} />
            </td>
            <td>
              {priceData ? priceData?.['24h_volume']?.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '-'}
            </td>
            <td>
              {priceData ? priceData?.['market_cap']?.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '-'}
            </td>
            {!isBTC && <td> -</td>}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
