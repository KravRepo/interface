/** @jsxImportSource @emotion/react */
import { useTheme } from '@mui/material'
import { css } from '@emotion/react'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { useRootStore } from '../../../store/root'
import { useGetMarketStats } from '../../../hook/hookV8/useGetMarketStats'

export default function TradeDetails({ positionSizeDai, leverage }: { leverage: number; positionSizeDai: BigNumber }) {
  const theme = useTheme()

  const {
    tradePool,

    tradePairIndex,
  } = useRootStore((state) => ({
    tradePool: state.tradePool,
    tradePairIndex: state.tradePairIndex,
  }))

  const { openDaiLong, openDaiShort } = useGetMarketStats(
    tradePool?.storageT || '',
    tradePool?.decimals || 18,
    tradePool.pairInfoT || '',
    tradePairIndex
  )

  const data = useMemo(() => {
    return {
      ['Net Exposure']: positionSizeDai && leverage ? positionSizeDai.multipliedBy(leverage + '').toFormat(2, 3) : '-',
      ['Open Interest (L/S)']: <Bar openLong={openDaiLong} openShort={openDaiShort} />,
      ['Price Impact']: <>$65,272.61</>,
      ['Entry Price']: <>$65,272.61</>,
      ['Liquidation Price']: <>$24,509,624.32</>,
      ['Funding Rate']: '-',
    }
  }, [positionSizeDai, leverage, openDaiLong, openDaiShort])

  return (
    <div
      css={css`
        padding: 15px 10px;
        background: ${theme.background.second};
        margin-top: 20px;
        display: grid;
        gap: 10px;
        border-radius: 8px;
        color: ${theme.text.primary};
        font-size: 14px;
      `}
    >
      {Object.keys(data).map((key) => {
        return (
          <div
            key={key}
            css={css`
              display: flex;
              justify-content: space-between;
            `}
          >
            <div
              css={css`
                color: #757575;
              `}
            >
              {key}
            </div>
            <div>{data[key as keyof typeof data]}</div>
          </div>
        )
      })}
    </div>
  )
}

function Bar({ openLong, openShort }: { openLong: BigNumber | undefined; openShort: BigNumber | undefined }) {
  const theme = useTheme()

  const data = useMemo(() => {
    if (!openLong || !openShort) return undefined
    const total = openLong.plus(openShort)

    return {
      longPercent: openLong.dividedBy(total).multipliedBy('100').toFixed(3),
      shortPercent: openShort.dividedBy(total).multipliedBy('100').toFixed(3),
      long: openLong.toFixed(2),
      short: openShort.toFixed(2),
    }
  }, [openLong, openShort])

  if (!openLong || !openShort) return <>-</>
  return (
    <div
      css={css`
        width: 102px;
        border-radius: 5px;
        height: 20px;
        display: flex;
        align-items: center;
        position: relative;
        :hover:after {
          content: 'L:${data?.long ?? '-'} / S:${data?.short ?? '-'}';
          position: absolute;
          width: max-content;
          font-size: 12px;
          top: 0;
          background: ${theme.background.third};
          transform: translate(-50%, -110%);
          border-radius: 5px;
          padding: 5px;
        }
      `}
    >
      <div
        css={css`
          width: ${data?.longPercent ?? 50}%;
          background-color: #13ba7b40;
          height: 100%;
          color: #13ba7b;
          border-radius: ${data?.shortPercent === '0' ? '5px' : '5px 0 0 5px'};
          display: flex;
          justify-content: center;
        `}
      >
        {data?.longPercent ?? '-'}%
      </div>{' '}
      <div
        css={css`
          width: ${data?.shortPercent ?? 50}%;
          background-color: #f53c5840;
          height: 100%;
          color: #f53c58;
          border-radius: ${data?.shortPercent === '0' ? '5px' : '0 5px 5px 0'};
          display: flex;
          justify-content: center;
          overflow: hidden;
        `}
      >
        {data?.shortPercent ?? '-'}%
      </div>
    </div>
  )
}
