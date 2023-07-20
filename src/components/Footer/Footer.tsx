/** @jsxImportSource @emotion/react */
import { footer, doc } from './style'
import { ReactComponent as KravLogo } from 'assets/imgs/krav_logo.svg'
import { ReactComponent as Twitter } from 'assets/imgs/twitter.svg'
import { ReactComponent as Medium } from 'assets/imgs/medium.svg'
import { ReactComponent as Github } from 'assets/imgs/github.svg'
import { ReactComponent as Discord } from 'assets/imgs/discord.svg'
import { css } from '@emotion/react'

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
            <Discord
              height="24"
              width="24"
              css={css`
                padding: 2px;
                margin-right: 16px;
              `}
            />
            <Twitter
              height="24"
              width="24"
              css={css`
                padding: 2px;
                margin-right: 16px;
              `}
            />
            <Medium
              height="24"
              width="24"
              css={css`
                margin-right: 16px;
              `}
            />
            <Github height="24" width="24" />
            <div>Copyright © 2023 KRAV. All rights reserved</div>
          </div>
        </div>
        <div css={doc}>
          <p>Functions</p>
          <p>Trade</p>
          <p>Earn</p>
          <p>Buy</p>
          <p>Referrals</p>
        </div>
        <div css={doc}>
          <p>Developers</p>
          <p>Documentation</p>
          <p>Github</p>
          <p>Blog</p>
        </div>
        <div css={doc}>
          <p>Support</p>
          <p>Telegram</p>
          <p>Discord</p>
          <p>Twitter</p>
        </div>
      </div>
    </div>
  )
}
