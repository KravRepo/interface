/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ReactComponent as KravDarkLogo } from '../../assets/imgs/darkModel/krav_logo_dark.svg'
import { ReactComponent as KravLogo } from '../../assets/imgs/krav_logo.svg'
import { Link, useTheme } from '@mui/material'
import { ReactComponent as Twitter } from '../../assets/imgs/twitter.svg'
import { ReactComponent as Medium } from '../../assets/imgs/medium.svg'
import TelegramIcon from '@mui/icons-material/Telegram'

export const Copyright = () => {
  const theme = useTheme()
  return (
    <div
      css={css`
        margin-left: 26px;
      `}
    >
      {theme.palette.mode === 'dark' ? (
        <KravDarkLogo
          height="22"
          width="91"
          css={css`
            margin-top: 27px;
            margin-right: -4px;
          `}
        />
      ) : (
        <KravLogo
          height="22"
          width="91"
          css={css`
            margin-top: 27px;
            margin-right: -4px;
          `}
        />
      )}

      <div className="social">
        {/*<Discord*/}
        {/*  height="24"*/}
        {/*  width="24"*/}
        {/*  css={css`*/}
        {/*    padding: 2px;*/}
        {/*    margin-right: 16px;*/}
        {/*  `}*/}
        {/*/>*/}
        <Link underline="none" sx={{ color: theme.text.primary }} href="https://twitter.com/kravtrade">
          <Twitter
            height="24"
            width="24"
            css={css`
              padding: 2px;
              margin-right: 16px;
            `}
          />
        </Link>
        <Link underline="none" sx={{ color: theme.text.primary }} href="https://medium.com/kravtrade">
          <Medium
            className="medium"
            height="24"
            width="24"
            css={css`
              margin-right: 16px;
            `}
          />
        </Link>
        <Link underline="none" sx={{ color: theme.text.primary }} href="https://t.me/kravtrade">
          <TelegramIcon
            className="medium"
            height="24"
            width="24"
            sx={{ color: '#757575' }}
            css={css`
              margin-right: 16px;
            `}
          />
        </Link>

        {/*<Github height="24" width="24" />*/}
        <div
          css={css`
            color: ${theme.text.primary};
          `}
        >
          Copyright © 2023 KRAV. All rights reserved
        </div>
      </div>
    </div>
  )
}
