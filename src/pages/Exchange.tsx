/** @jsxImportSource @emotion/react */

import { Title } from '../components/Exchange/Title'
import { ExchangeOverview } from '../components/Exchange/ExchangeOverview'
import { ExchangeAction } from '../components/Exchange/ExchangeAction'
import { MintHistory } from '../components/Exchange/MintHistory'
import { css } from '@emotion/react'
import { useMediaQuery, useTheme } from '@mui/material'

export const Exchange = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  return (
    <div
      css={css`
        max-width: 1372px;
        margin: ${isMobile ? '16px' : '12px auto 80px'};
      `}
    >
      <Title />
      <ExchangeOverview />
      <ExchangeAction />
      <MintHistory />
    </div>
  )
}
