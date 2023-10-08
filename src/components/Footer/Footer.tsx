/** @jsxImportSource @emotion/react */
// import { doc } from './style'
// import { ReactComponent as KravLogo } from '../../assets/imgs/krav_logo.svg'
// import { ReactComponent as KravDarkLogo } from '../../assets/imgs/darkModel/krav_logo_dark.svg'
import { ReactComponent as Twitter } from '../../assets/imgs/twitter.svg'
import { ReactComponent as TgIcon } from '../../assets/imgs/tg_icon.svg'
// import { ReactComponent as Medium } from '../../assets/imgs/medium.svg'
// import TelegramIcon from '@mui/icons-material/Telegram'
// import { ReactComponent as Github } from 'assets/imgs/github.svg'
// import { ReactComponent as Discord } from 'assets/imgs/discord.svg'
import { css } from '@emotion/react'
import { Link, useTheme } from '@mui/material'

// import { NavLink } from 'react-router-dom'
// import { useMemo } from 'react'
import KRAVButton from '../KravUIKit/KravButton'

// export const Footer = () => {
//   const theme = useTheme()
//   const footer = useMemo(() => {
//     return css`
//       width: 100%;
//       height: 212px;
//       background: ${theme.background.primary};
//       border-top: ${theme.splitLine.primary};
//       margin-top: 40px;
//       .footer-content {
//         margin: 0 auto;
//         height: 100%;
//         max-width: 1440px;
//         display: grid;
//         grid-template-columns: 2.7fr 1fr 1fr 1.1fr;
//         font-size: 14px;
//         .social {
//           margin-top: 83px;
//           margin-bottom: 12px;
//           svg path:hover {
//             fill: ${theme.text.primary};
//           }
//           .medium:hover path {
//             fill: ${theme.text.primary};
//           }
//         }
//         > div {
//           border-right: ${theme.splitLine.primary};
//         }
//         > div:last-of-type {
//           border-right: unset;
//         }
//       }
//     `
//   }, [theme])
//   const hover = useMemo(() => {
//     return css`
//       > p:first-of-type {
//         color: ${theme.text.primary};
//       }
//       p:hover {
//         color: ${theme.text.primary};
//       }
//     `
//   }, [theme])
//   return (
//     <div css={footer}>
//       <div className="footer-content">
//         <div
//           css={css`
//             margin-left: 26px;
//           `}
//         >
//           {theme.palette.mode === 'dark' ? (
//             <KravDarkLogo
//               height="22"
//               width="91"
//               css={css`
//                 margin-top: 27px;
//                 margin-right: -4px;
//               `}
//             />
//           ) : (
//             <KravLogo
//               height="22"
//               width="91"
//               css={css`
//                 margin-top: 27px;
//                 margin-right: -4px;
//               `}
//             />
//           )}
//
//           <div className="social">
//             {/*<Discord*/}
//             {/*  height="24"*/}
//             {/*  width="24"*/}
//             {/*  css={css`*/}
//             {/*    padding: 2px;*/}
//             {/*    margin-right: 16px;*/}
//             {/*  `}*/}
//             {/*/>*/}
//             <Link underline="none" sx={{ color: theme.text.primary }} href="https://twitter.com/kravtrade">
//               <Twitter
//                 height="24"
//                 width="24"
//                 css={css`
//                   padding: 2px;
//                   margin-right: 16px;
//                 `}
//               />
//             </Link>
//             <Link underline="none" sx={{ color: theme.text.primary }} href="https://medium.com/kravtrade">
//               <Medium
//                 className="medium"
//                 height="24"
//                 width="24"
//                 css={css`
//                   margin-right: 16px;
//                 `}
//               />
//             </Link>
//             <Link underline="none" sx={{ color: theme.text.primary }} href="https://t.me/kravtrade">
//               <TelegramIcon
//                 className="medium"
//                 height="24"
//                 width="24"
//                 sx={{ color: '#757575' }}
//                 css={css`
//                   margin-right: 16px;
//                 `}
//               />
//             </Link>
//
//             {/*<Github height="24" width="24" />*/}
//             <div
//               css={css`
//                 color: ${theme.text.primary};
//               `}
//             >
//               Copyright © 2023 KRAV. All rights reserved
//             </div>
//           </div>
//         </div>
//         <div css={[doc, hover]}>
//           <p>Features</p>
//           <NavLink to={'/trade'}>
//             <p>Trade</p>
//           </NavLink>
//           <NavLink to={'/liquidity'}>
//             <p>Earn</p>
//           </NavLink>
//           <NavLink to={'/portfolio/referral'}>
//             <p>Referrals</p>
//           </NavLink>
//           {/*<p>Buy</p>*/}
//         </div>
//         <div css={[doc, hover]}>
//           <p>Developers</p>
//           <Link underline="none" sx={{ color: theme.text.primary }} href="https://docs.krav.trade/">
//             <p>Documentation</p>
//           </Link>
//
//           {/*<p>Github</p>*/}
//           {/*<p>Blog</p>*/}
//         </div>
//         <div css={[doc, hover]}>
//           <p>Support</p>
//           <Link underline="none" sx={{ color: theme.text.primary }} href="https://t.me/kravtrade">
//             <p>Telegram</p>
//           </Link>
//           <Link underline="none" sx={{ color: theme.text.primary }} href="https://twitter.com/kravtrade">
//             <p>Twitter</p>
//           </Link>
//           {/*<p>Discord</p>*/}
//         </div>
//       </div>
//     </div>
//   )
// }

export const Footer = () => {
  const theme = useTheme()
  return (
    <div
      css={css`
        background: rgba(171, 174, 188, 0.12);
        padding: 40px 64px;
        margin-top: 40px;
        font-family: 'Inter';
        font-size: 16px;
        font-style: normal;
        font-weight: 300;
        line-height: 143%; /* 22.88px */
        letter-spacing: 0.15px;
      `}
    >
      <div
        css={css`
          color: white;
          font-feature-settings: 'clig' off, 'liga' off;
          font-family: 'Inter';
          font-size: 40px;
          font-style: normal;
          font-weight: 500;
          line-height: 116.7%;
          padding-bottom: 6px;
        `}
      >
        Have any questions?
      </div>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #f2f3f8;
        `}
      >
        <div
          css={css`
            opacity: 0.6;
          `}
        >
          You can always contact us by clicking
          <br /> on the buttons below
        </div>
        <div
          css={css`
            display: flex;
            align-items: center;
            gap: 8px;
          `}
        >
          <KRAVButton sx={{ height: '44px' }}>Contact us</KRAVButton>
          <Link underline="none" sx={{ color: theme.text.primary }} href="https://twitter.com/evenodds_xyz">
            <div
              css={css`
                height: 44px;
                width: 58px;
                border-radius: 8px;
                background: #131418;
                display: flex;
                align-items: center;
                justify-content: center;
              `}
            >
              <Twitter />
            </div>
          </Link>
          <Link underline="none" sx={{ color: theme.text.primary }} href="https://t.me/even_odds_bot">
            <div
              css={css`
                height: 44px;
                width: 58px;
                border-radius: 8px;
                background: #131418;
                display: flex;
                align-items: center;
                justify-content: center;
              `}
            >
              <TgIcon />
            </div>
          </Link>
        </div>
      </div>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 40px;
          color: #f2f3f8;
          opacity: 0.6;
        `}
      >
        <span>Betnow © 2023</span>
        <span>All Right Reserved</span>
      </div>
    </div>
  )
}
