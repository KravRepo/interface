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
        `,
      ]}
    >
      <span>Token Exchange</span>
      <div>
        <span>Exchange ratio :</span>
        <span>1 XXA→2.5 XXB</span>
      </div>
    </div>
  )
}
