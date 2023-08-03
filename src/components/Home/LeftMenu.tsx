/** @jsxImportSource @emotion/react */
import { leftMenu, menuActive } from './style'
import { ReactComponent as DashboardIcon } from '../../assets/imgs/dashboardIcon.svg'
import { ReactComponent as StakingIcon } from '../../assets/imgs/kravStakeIcon.svg'
import { ReactComponent as FarmIcon } from '../../assets/imgs/farm.svg'
import { ReactComponent as ReferralIcon } from '../../assets/imgs/referral.svg'
import KRAVMenuButton from 'components/KravUIKit/KravMenuButton'
import { css } from '@emotion/react'
import { useLocation, useNavigate } from 'react-router-dom'

export const LeftMenu = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (
    <div css={leftMenu}>
      <KRAVMenuButton
        onClick={() => {
          navigate('/')
        }}
        css={pathname === '/' ? menuActive : ''}
      >
        <DashboardIcon />
        <span
          css={css`
            line-height: 24px;
          `}
        >
          Dashboard
        </span>
      </KRAVMenuButton>
      <KRAVMenuButton
        onClick={() => {
          navigate('/dashboard/stake')
        }}
        css={pathname === '/dashboard/stake' ? menuActive : ''}
      >
        <StakingIcon />
        <span
          css={css`
            line-height: 24px;
          `}
        >
          KRAV Staking
        </span>
      </KRAVMenuButton>
      <KRAVMenuButton
        onClick={() => {
          navigate('/dashboard/farm')
        }}
        css={pathname === '/dashboard/farm' ? menuActive : ''}
      >
        <FarmIcon />
        <span
          css={css`
            line-height: 24px;
          `}
        >
          Farm
        </span>
      </KRAVMenuButton>
      <KRAVMenuButton
        onClick={() => {
          navigate('/dashboard/referral')
        }}
        css={pathname === '/dashboard/referral' ? menuActive : ''}
      >
        <ReferralIcon />
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
