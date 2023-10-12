/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { bottomCard } from '../style'
import { useRootStore } from '../../../store/root'
import { useTheme } from '@mui/material'

export const PositionOverView = () => {
  const theme = useTheme()
  const tradePool = useRootStore((state) => state.tradePool)
  return (
    <div
      css={[
        bottomCard,
        css`
          background: ${theme.background.primary};
          color: ${theme.text.primary};
        `,
      ]}
    >
      <div
        css={css`
          border-bottom: ${theme.splitLine.primary};
        `}
      >
        Contract Specifications
      </div>
      <div
        css={css`
          padding-top: 12px;
        `}
      >
        <p className="card-details">
          <span>Available Liquidity:&nbsp;</span>
          <span>
            {tradePool?.poolCurrentBalance?.toFixed(2)} {tradePool?.symbol}
          </span>
        </p>
      </div>
    </div>
  )
}
