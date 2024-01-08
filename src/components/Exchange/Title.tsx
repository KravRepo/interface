/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { title } from './style'
import { useTheme } from '@mui/material'

export const Title = () => {
  const theme = useTheme()
  return (
    <div
      css={[
        title,
        css`
          border-bottom: ${theme.splitLine.primary};
          background: ${theme.background.primary};
          border-radius: 8px 8px 0 0;
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
