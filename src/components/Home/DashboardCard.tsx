/** @jsxImportSource @emotion/react */
import { useTheme } from '@mui/material'
import { css } from '@emotion/react'

type DashboardCardProps = {
  title: string
  content: string
}

export const DashboardCard = ({ title, content }: DashboardCardProps) => {
  const theme = useTheme()
  return (
    <div
      className="data-card"
      css={css`
        background: ${theme.background.primary};
      `}
    >
      <span
        className="tabs"
        css={css`
          background: ${theme.palette.mode === 'dark' ? '#2832f5' : '#a4a8fe'};
          color: ${theme.palette.mode === 'dark' ? theme.text.primary : '#fff'};
        `}
      >
        {title}
      </span>
      <p>{content}</p>
    </div>
  )
}
