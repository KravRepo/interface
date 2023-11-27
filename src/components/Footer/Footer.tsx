/** @jsxImportSource @emotion/react */
import { doc, mobileTabs } from './style'
// import { ReactComponent as Github } from 'assets/imgs/github.svg'
// import { ReactComponent as Discord } from 'assets/imgs/discord.svg'
import { css } from '@emotion/react'
import { Link, useMediaQuery, useTheme } from '@mui/material'

import { NavLink } from 'react-router-dom'
import { useMemo, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Copyright } from './Copyright'

export const Footer = () => {
  const theme = useTheme()
  const footer = useMemo(() => {
    return css`
      width: 100%;
      height: 212px;
      background: ${theme.background.primary};
      border-top: ${theme.splitLine.primary};
      margin-top: 40px;
      .footer-content {
        margin: 0 auto;
        height: 100%;
        max-width: 1440px;
        display: grid;
        grid-template-columns: 2.7fr 1fr 1fr 1.1fr;
        font-size: 14px;
        .social {
          margin-top: 83px;
          margin-bottom: 12px;
          svg path:hover {
            fill: ${theme.text.primary};
          }
          .medium:hover path {
            fill: ${theme.text.primary};
          }
        }
        > div {
          border-right: ${theme.splitLine.primary};
        }
        > div:last-of-type {
          border-right: unset;
        }
      }
    `
  }, [theme])
  const hover = useMemo(() => {
    return css`
      > p:first-of-type {
        color: ${theme.text.primary};
      }
      p:hover {
        color: ${theme.text.primary};
      }
    `
  }, [theme])
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [showFun, setShowFun] = useState(false)
  const [showDev, setShowDev] = useState(false)
  const [showSup, setShowSup] = useState(false)

  return (
    <>
      {!isMobile && (
        <div css={footer}>
          <div className="footer-content">
            <Copyright />
            <div css={[doc, hover]}>
              <p>Features</p>
              <NavLink to={'/trade'}>
                <p>Trade</p>
              </NavLink>
              <NavLink to={'/liquidity'}>
                <p>Earn</p>
              </NavLink>
              <NavLink to={'/portfolio/referral'}>
                <p>Referrals</p>
              </NavLink>
              {/*<p>Buy</p>*/}
            </div>
            <div css={[doc, hover]}>
              <p>Developers</p>
              <Link underline="none" sx={{ color: theme.text.primary }} href="https://docs.krav.trade/">
                <p>Documentation</p>
              </Link>

              {/*<p>Github</p>*/}
              {/*<p>Blog</p>*/}
            </div>
            <div css={[doc, hover]}>
              <p>Support</p>
              <Link underline="none" sx={{ color: theme.text.primary }} href="https://t.me/kravtrade">
                <p>Telegram</p>
              </Link>
              <Link underline="none" sx={{ color: theme.text.primary }} href="https://twitter.com/kravtrade">
                <p>Twitter</p>
              </Link>
              {/*<p>Discord</p>*/}
            </div>
          </div>
        </div>
      )}
      {isMobile && (
        <div
          css={css`
            background: ${theme.background.primary};
            margin-top: 40px;
            padding-top: 24px;
          `}
        >
          <div
            css={[
              mobileTabs,
              css`
                border-bottom: ${theme.splitLine.primary};
              `,
            ]}
          >
            <p onClick={() => setShowFun(!showFun)}>
              <span>Features</span>
              <KeyboardArrowDownIcon />
            </p>
            {showFun && (
              <div
                css={css`
                  > a {
                    text-decoration: none;
                    > p {
                      color: ${theme.text.primary};
                    }
                  }
                `}
              >
                <NavLink to={'/trade'}>
                  <p className="link">Trade</p>
                </NavLink>
                <NavLink to={'/liquidity'}>
                  <p className="link">Earn</p>
                </NavLink>
                <NavLink to={'/portfolio/referral'}>
                  <p className="link">Referrals</p>
                </NavLink>
              </div>
            )}
          </div>
          <div
            css={[
              mobileTabs,
              css`
                border-bottom: ${theme.splitLine.primary};
              `,
            ]}
          >
            <p css={css``} onClick={() => setShowDev(!showDev)}>
              <span>Developers</span>
              <KeyboardArrowDownIcon />
            </p>
            {showDev && (
              <>
                <Link underline="none" sx={{ color: theme.text.primary }} href="https://docs.krav.trade/">
                  <p className="link">Documentation</p>
                </Link>
              </>
            )}
          </div>
          <div
            css={[
              mobileTabs,
              css`
                border-bottom: ${theme.splitLine.primary};
              `,
            ]}
          >
            <p onClick={() => setShowSup(!showSup)}>
              <span>Support</span>
              <KeyboardArrowDownIcon />
            </p>
            {showSup && (
              <>
                <Link underline="none" sx={{ color: theme.text.primary }} href="https://t.me/kravtrade">
                  <p>Telegram</p>
                </Link>
                <Link underline="none" sx={{ color: theme.text.primary }} href="https://twitter.com/kravtrade">
                  <p>Twitter</p>
                </Link>
              </>
            )}
          </div>
          <Copyright />
        </div>
      )}
    </>
  )
}
