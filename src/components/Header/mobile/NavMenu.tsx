/** @jsxImportSource @emotion/react */
import { SwipeableDrawer, useTheme } from '@mui/material'
import { ReactComponent as KravDarkLogo } from '../../../assets/imgs/darkModel/krav_logo_dark.svg'
import { ReactComponent as KravLogo } from '../../../assets/imgs/krav_logo.svg'
import { NavLink } from 'react-router-dom'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { css } from '@emotion/react'
import { Trans } from '@lingui/macro'
import { useMemo } from 'react'
import { align } from '../../../globalStyle'
import { ReactComponent as ThemeIconLight } from '../../../assets/imgs/model_icon.svg'
import { ReactComponent as ThemeIconDark } from '../../../assets/imgs/darkModel/model_icon_dark.svg'
import { KravModeSwitch } from '../../KravUIKit/KravModeSwitch'
import { useSetThemeContext } from '../../../theme/appTheme'

type NavMenuProps = {
  isOpen: boolean
  setIsOpen: () => void
}
export const NavMenu = ({ isOpen, setIsOpen }: NavMenuProps) => {
  const theme = useTheme()
  const toggleTheme = useSetThemeContext()
  const routerColor = useMemo(() => {
    return css`
      color: ${theme.text.primary};
      text-decoration: none;
      font-size: 16px;
      padding-left: 24px;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      line-height: 140%;
      margin-bottom: 20px;
    `
  }, [theme])
  return (
    <SwipeableDrawer anchor={'top'} open={isOpen} onOpen={() => console.log('open')} onClose={setIsOpen}>
      <div
        css={css`
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        `}
      >
        <NavLink style={{ height: '22px' }} to={'/trade'}>
          {theme.palette.mode === 'dark' ? (
            <KravDarkLogo height="22" width="91" />
          ) : (
            <KravLogo height="22" width="91" />
          )}
        </NavLink>
        <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={setIsOpen} />
      </div>
      <div
        css={css`
          > a {
            display: block;
          }
          border-bottom: ${theme.splitLine.primary};
        `}
      >
        <NavLink onClick={setIsOpen} to={'/trade'} css={[routerColor]}>
          <Trans>Trade</Trans>
        </NavLink>
        <NavLink onClick={setIsOpen} to={'/liquidity'} css={[routerColor]}>
          <Trans>Liquidity</Trans>
        </NavLink>
        <NavLink onClick={setIsOpen} to={'/portfolio'} css={[routerColor]}>
          <Trans>Portfolio</Trans>
        </NavLink>
        <NavLink onClick={setIsOpen} to={'/statistics'} css={[routerColor]}>
          <Trans>Statistics</Trans>
        </NavLink>
      </div>
      <div
        className="action"
        css={css`
          justify-content: space-between;
          display: flex;
          padding: 16px;
        `}
      >
        <div css={align}>
          {theme.palette.mode === 'light' ? <ThemeIconLight /> : <ThemeIconDark />}
          <span
            css={css`
              margin-left: 12px;
            `}
          >
            {theme.palette.mode === 'light' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </div>
        <KravModeSwitch checked={true} onClick={toggleTheme} />
      </div>
    </SwipeableDrawer>
  )
}
