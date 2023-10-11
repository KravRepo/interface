/** @jsxImportSource @emotion/react */
import { home } from '../../components/Home/style'
import { LeftMenu } from '../../components/Home/LeftMenu'
import { useMediaQuery, useTheme } from '@mui/material'
import { css } from '@emotion/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'

const mobileNav = css`
  padding: 14px 0;
  white-space: nowrap;
`

export const HomeLayout = ({ children }: { children: JSX.Element }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const navigate = useNavigate()
  const menuActive = useMemo(() => {
    return css`
      border-bottom: 3px solid #2832f5;
    `
  }, [theme])
  const { pathname } = useLocation()
  return (
    <div
      css={[
        home,
        css`
          background: ${theme.background.fourth};
          display: ${isMobile ? 'block' : 'flex'};
        `,
      ]}
    >
      {!isMobile && <LeftMenu />}
      {isMobile && (
        <div
          css={css` border-bottom: ${theme.splitLine.primary}; gap: 24px;margin-bottom: 24px; padding: 0 16px; display: flex; align-items: center; overflow: auto;  &::-webkit-scrollbar {
            display: none
          },`}
        >
          <div
            css={[pathname === '/portfolio' ? menuActive : '', mobileNav]}
            onClick={() => {
              navigate('/portfolio')
            }}
          >
            Dashboard
          </div>
          <div
            css={[pathname === '/portfolio/stake' ? menuActive : '', mobileNav]}
            onClick={() => {
              navigate('/portfolio/stake')
            }}
          >
            KRAV Staking
          </div>
          <div
            css={[pathname === '/portfolio/farm' ? menuActive : '', mobileNav]}
            onClick={() => {
              navigate('/portfolio/farm')
            }}
          >
            Farm
          </div>
          <div
            css={[pathname === '/portfolio/referral' ? menuActive : '', mobileNav]}
            onClick={() => {
              navigate('/portfolio/referral')
            }}
          >
            Referral
          </div>
        </div>
      )}
      <div className="home-content">{children}</div>
    </div>
  )
}
