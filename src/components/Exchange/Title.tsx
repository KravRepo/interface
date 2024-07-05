/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { title } from './style'
import { useMediaQuery, useTheme } from '@mui/material'
import { t } from '@lingui/macro'

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
      <span>{t`Token Exchange`}</span>
      <div>
        <span>{t`Exchange ratio :`}</span>
        <span>{t`1 KRAV → Coming Soon`}</span>
      </div>
    </div>
  )
}
