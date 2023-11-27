/** @jsxImportSource @emotion/react */
import { leftMenu } from './style'
import { ReactComponent as DashboardIcon } from '../../assets/imgs/dashboardIcon.svg'
import { ReactComponent as StakingIcon } from '../../assets/imgs/kravStakeIcon.svg'
import { ReactComponent as FarmIcon } from '../../assets/imgs/farm.svg'
import { ReactComponent as ReferralIcon } from '../../assets/imgs/referral.svg'
import { ReactComponent as DashboardDarkIcon } from '../../assets/imgs/darkModel/dashboard_icon_dark.svg'
import { ReactComponent as StakingDarkIcon } from '../../assets/imgs/darkModel/krav_stake_icon_dark.svg'
import { ReactComponent as FarmDarkIcon } from '../../assets/imgs/darkModel/farm_icon_dark.svg'
import { ReactComponent as ReferralDarkIcon } from '../../assets/imgs/darkModel/referral_icon_dark.svg'
import KRAVMenuButton from '../../components/KravUIKit/KravMenuButton'
import { css } from '@emotion/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material'
import { useMemo } from 'react'

export const LeftMenu = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { pathname } = useLocation()
  const menuActive = useMemo(() => {
    return css`
      background: ${theme.palette.mode === 'dark' ? '#2832f5' : '#f6f6f6'};
    `
  }, [theme])

  return (
    <div
      css={[
        leftMenu,
        css`
          border-right: ${theme.splitLine.primary};
        `,
      ]}
    >
      <KRAVMenuButton
        sx={{ color: theme.text.primary }}
        onClick={() => {
          navigate('/portfolio')
        }}
        css={pathname === '/portfolio' ? menuActive : ''}
      >
        {theme.palette.mode === 'dark' ? <DashboardDarkIcon /> : <DashboardIcon />}
        <span
          css={css`
            line-height: 24px;
          `}
        >
          Dashboard
        </span>
      </KRAVMenuButton>
      <KRAVMenuButton
        sx={{ color: theme.text.primary }}
        onClick={() => {
          navigate('/portfolio/stake')
        }}
        css={pathname === '/portfolio/stake' ? menuActive : ''}
      >
        {theme.palette.mode === 'dark' ? <StakingDarkIcon /> : <StakingIcon />}

        <span
          css={css`
            line-height: 24px;
          `}
        >
          KRAV Staking
        </span>
      </KRAVMenuButton>
      <KRAVMenuButton
        sx={{ color: theme.text.primary }}
        onClick={() => {
          navigate('/portfolio/farm')
        }}
        css={pathname === '/portfolio/farm' ? menuActive : ''}
      >
        {theme.palette.mode === 'dark' ? <FarmDarkIcon /> : <FarmIcon />}
        <span
          css={css`
            line-height: 24px;
          `}
        >
          Farm
        </span>
      </KRAVMenuButton>
      <KRAVMenuButton
        sx={{ color: theme.text.primary }}
        onClick={() => {
          navigate('/portfolio/referral')
        }}
        css={pathname === '/portfolio/referral' ? menuActive : ''}
      >
        {theme.palette.mode === 'dark' ? <ReferralDarkIcon /> : <ReferralIcon />}

        <span
          css={css`
            line-height: 24px;
          `}
        >
          Referral
        </span>
      </KRAVMenuButton>
    </div>
  )
}
