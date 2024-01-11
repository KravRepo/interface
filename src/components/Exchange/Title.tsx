/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { title } from './style'
import { useMediaQuery, useTheme } from '@mui/material'

export const Title = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  return (
    <div
      css={[
        title,
        css`
          border-bottom: ${theme.splitLine.primary};
          background: ${theme.background.primary};
          border-radius: 8px 8px 0 0;
          display: ${isMobile ? 'block' : 'flex'};
        `,
      ]}
    >
      <span>Token Exchange</span>
      <div>
        <span>Exchange ratio :</span>
        <span>1 KRAV → 1 ???</span>
      </div>
    </div>
  )
}
