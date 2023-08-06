/** @jsxImportSource @emotion/react */
import { footer, doc } from './style'
import { ReactComponent as KravLogo } from '../../assets/imgs/krav_logo.svg'
import { ReactComponent as Twitter } from '../../assets/imgs/twitter.svg'
import { ReactComponent as Medium } from '../../assets/imgs/medium.svg'
// import { ReactComponent as Github } from 'assets/imgs/github.svg'
// import { ReactComponent as Discord } from 'assets/imgs/discord.svg'
import { css } from '@emotion/react'
import { Link } from '@mui/material'

import { NavLink } from 'react-router-dom'

export const Footer = () => {
  return (
    <div css={footer}>
      <div className="footer-content">
        <div
          css={css`
            margin-left: 26px;
          `}
        >
          <KravLogo
            height="22"
            width="91"
            css={css`
              margin-top: 27px;
              margin-right: -4px;
            `}
          />
          <div className="social">
            {/*<Discord*/}
            {/*  height="24"*/}
            {/*  width="24"*/}
            {/*  css={css`*/}
            {/*    padding: 2px;*/}
            {/*    margin-right: 16px;*/}
            {/*  `}*/}
            {/*/>*/}
            <Link underline="none" sx={{ color: '#000' }} href="https://twitter.com/kravtrade">
              <Twitter
                height="24"
                width="24"
                css={css`
                  padding: 2px;
                  margin-right: 16px;
                `}
              />
            </Link>
            <Link underline="none" sx={{ color: '#000' }} href="https://medium.com/kravtrade">
              <Medium
                className="medium"
                height="24"
                width="24"
                css={css`
                  margin-right: 16px;
                `}
              />
            </Link>
            {/*<Github height="24" width="24" />*/}
            <div>Copyright © 2023 KRAV. All rights reserved</div>
          </div>
        </div>
        <div css={doc}>
          <p>Functions</p>
          <NavLink to={'/trade'}>
            <p>Trade</p>
          </NavLink>
          <NavLink to={'/liquidity'}>
            <p>Earn</p>
          </NavLink>
          <NavLink to={'/dashboard/referral'}>
            <p>Referrals</p>
          </NavLink>
          {/*<p>Buy</p>*/}
        </div>
        <div css={doc}>
          <p>Developers</p>
          <Link underline="none" sx={{ color: '#000' }} href="https://docs.krav.trade/">
            <p>Documentation</p>
          </Link>

          {/*<p>Github</p>*/}
          {/*<p>Blog</p>*/}
        </div>
        <div css={doc}>
          <p>Support</p>
          <Link underline="none" sx={{ color: '#000' }} href="https://t.me/kravtrade">
            <p>Telegram</p>
          </Link>
          <Link underline="none" sx={{ color: '#000' }} href="https://twitter.com/kravtrade">
            <p>Twitter</p>
          </Link>
          {/*<p>Discord</p>*/}
        </div>
      </div>
    </div>
  )
}
