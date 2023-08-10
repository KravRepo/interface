/** @jsxImportSource @emotion/react */
import { home } from '../../components/Home/style'
import { LeftMenu } from '../../components/Home/LeftMenu'
import { useTheme } from '@mui/material'
import { css } from '@emotion/react'

export const HomeLayout = ({ children }: { children: JSX.Element }) => {
  const theme = useTheme()
  return (
    <div
      css={[
        home,
        css`
          background: ${theme.background.fourth};
        `,
      ]}
    >
      <LeftMenu />
      <div className="home-content">{children}</div>
    </div>
  )
}
