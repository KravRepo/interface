/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useTheme } from '@mui/material'
import { Anchor } from '../TradeRight/AltcoinCard'

const data = {
  price: '$0.1562',
  change1h: '0.2%',
  change24h: '7.0%',
  change7d: '9.3%',
  volume24h: '$1,461,798,631',
  marketCap: '$22,549,928,057',
}

export default function CoinInfo() {
  const theme = useTheme()

  return (
    <table
      css={css`
        font-size: 12px;
        border-spacing: 20px 5px;
        text-align: right;
        width: 100%;
        padding: 10px 30px 10px 20px;
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
        <td>24h Volume</td>
        <td>Market Cap</td>
      </tr>
      <tr
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
        <td>{data.volume24h}</td>
        <td>{data.marketCap}</td>
      </tr>
    </table>
  )
}
