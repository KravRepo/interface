/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { bottomCard } from '../style'
import { useTheme } from '@mui/material'

export const DashboardTradeRight = () => {
  const theme = useTheme()

  return (
    <div
      css={[
        bottomCard,
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
          margin-bottom: 12px;
          font-size: 1.2em;
          font-weight: bold;
        `}
      >
        <img src="path-to-icon.png" alt="Arbitrum Logo" style={{ marginRight: 8 }} />
        Arbitrum ARB
      </div>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.9em;
          font-weight: bold;
        `}
      >
        <div
          css={css`
            color: #757575;
          `}
        >
          Price
        </div>
        <div
          css={css`
            color: #757575;
          `}
        >
          1h
        </div>
        <div
          css={css`
            color: #757575;
          `}
        >
          24h
        </div>
        <div
          css={css`
            color: #757575;
          `}
        >
          7d
        </div>
      </div>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 1.2em;
        `}
      >
        <div>$0.1562</div>
        <div
          css={css`
            color: ${theme.palette.success.main};
          `}
        >
          ▲ 0.2%
        </div>
        <div
          css={css`
            color: ${theme.palette.success.main};
          `}
        >
          ▲ 7.0%
        </div>
        <div
          css={css`
            color: ${theme.palette.success.main};
          `}
        >
          ▲ 9.3%
        </div>
      </div>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        `}
      >
        <div
          css={css`
            color: #757575;
          `}
        >
          24h Volume
        </div>
        <div
          css={css`
            color: #757575;
          `}
        >
          Market Cap
        </div>
      </div>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          font-size: 1.2em;
        `}
      >
        <div>$1,461,798,631</div>
        <div>$22,549,928,057</div>
      </div>
    </div>
  )
}

export default DashboardTradeRight
