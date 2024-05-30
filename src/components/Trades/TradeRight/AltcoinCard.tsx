/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useTheme } from '@mui/material'
import { useRootStore } from '../../../store/root'
import ArrowDropUp from '@mui/icons-material/ArrowDropUp'
import { ArrowDropDown } from '@mui/icons-material'
import { TradeMode } from '../../../store/TradeSlice'

const data = {
  price: '$0.1562',
  change1h: '0.2%',
  change24h: '7.0%',
  change7d: '9.3%',
  volume24h: '$1,461,798,631',
  marketCap: '$22,549,928,057',
}

export const Anchor = ({ changeInString }: { changeInString?: number | string }) => {
  if (changeInString === undefined) return <>-</>
  if ((changeInString + '').includes('-')) {
    return (
      <div className="down">
        <ArrowDropDown />
        {changeInString}%
      </div>
    )
  } else {
    return (
      <div className="up">
        <ArrowDropUp />
        {changeInString}%
      </div>
    )
  }
}

export const AltcoinCard = () => {
  const theme = useTheme()

  const { tradePool, tradeModel } = useRootStore((state) => ({
    tradePool: state.tradePool,
    tradeModel: state.tradeModel,
  }))

  if (!tradePool || tradeModel === TradeMode.BASIC) return null

  return (
    <div
      css={[
        css`
          padding: 15px 10px;
          background: ${theme.background.second};
          margin-top: 20px;
          display: grid;
          gap: 10px;
          border-radius: 8px;
          color: ${theme.text.primary};
          font-size: 14px;
        `,
      ]}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          font-weight: bold;
          gap: 10px;
        `}
      >
        <img
          css={css`
            border-radius: 50%;
            background: ${theme.palette.mode === 'dark' ? '#fff' : ''};
          `}
          src={tradePool?.logoSource}
          height="20"
          width="20"
        />
        <span>{tradePool?.symbol}</span>
      </div>
      <table
        css={css`
          font-size: 12px;
        `}
      >
        <tr
          css={css`
            color: #757575;
          `}
        >
          <td>Price</td>
          <td>1h</td>
          <td>24h</td>
          <td>7d</td>
        </tr>
        <tr
          css={css`
            td > div {
              display: flex;
              align-items: center;
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
          <td>{data.price}</td>
          <td className="up">
            <Anchor changeInString={data.change1h} />
          </td>
          <td className="up">
            <Anchor changeInString={data.change24h} />
          </td>
          <td className="up">
            <Anchor changeInString={data.change7d} />
          </td>
        </tr>
      </table>
      <table
        css={css`
          font-size: 12px;
        `}
      >
        <tr
          css={css`
            color: #757575;
          `}
        >
          <td>24h Volume</td>
          <td>Market Cap</td>
        </tr>
        <tr>
          <td>{data.volume24h}</td>
          <td>{data.marketCap}</td>
        </tr>
      </table>
    </div>
  )
}

export default AltcoinCard
