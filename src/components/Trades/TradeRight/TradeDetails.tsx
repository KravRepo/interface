/** @jsxImportSource @emotion/react */
import { useTheme } from '@mui/material'
import { css } from '@emotion/react'

const data = {
  ['Net Exposure']: 'BTC/USD [BTC-USDC]',
  ['Open Interest']: <Bar />,
  ['Price Impact']: <>$65,272.61</>,
  ['Entry Price']: <>$65,272.61</>,
  ['Liquidation Price']: <>$24,509,624.32</>,
  ['Funding Rate']: '-',
}

export default function TradeDetails() {
  const theme = useTheme()
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

function Bar() {
  return (
    <div
      css={css`
        width: 102px;
        border-radius: 5px;
        height: 20px;
        display: flex;
        align-items: center;
      `}
    >
      <div
        css={css`
          width: ${51}%;
          background-color: #13ba7b40;
          height: 100%;
          color: #13ba7b;
          border-radius: 5px 0 0 5px;
          display: flex;
          justify-content: center;
        `}
      >
        51%
      </div>{' '}
      <div
        css={css`
          width: ${49}%;
          background-color: #f53c5840;
          height: 100%;
          color: #f53c58;
          border-radius: 0 5px 5px 0;
          display: flex;
          justify-content: center;
        `}
      >
        49%
      </div>
    </div>
  )
}
