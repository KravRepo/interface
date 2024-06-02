/** @jsxImportSource @emotion/react */
import * as React from 'react'
import DialogContent from '@mui/material/DialogContent'
import { useLocation } from 'react-router-dom'
import { IconButton, css, useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export default function TermsAndAgreementDialog() {
  const [open, setOpen] = React.useState(false)
  const { pathname } = useLocation()
  const theme = useTheme()

  const handleClose = (e: any) => {
    setOpen(false)
    localStorage.setItem('KRAV_POPUP', 'true')
  }

  React.useEffect(() => {
    const agree = localStorage.getItem('KRAV_POPUP')
    if (agree !== 'true' && pathname === '/trade') {
      setOpen(true)
    }
  }, [pathname])

  return (
    <>
      {open && (
        <div
          css={css`
            background-color: ${theme.background.third};
            display: ${open ? 'block' : 'none'};
            color: #ffffff;
            z-index: 2;
            box-shadow: 0px 0px 10px #121212;
            border-radius: 5px;
          `}
        >
          <div
            css={css`
              position: relative;
            `}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 6,
                top: 6,
              }}
            >
              <CloseIcon sx={{ height: 14, width: 14 }} />
            </IconButton>
            <DialogContent sx={{ p: '14px 24px 14px 14px', fontSize: '12px' }}>
              <b>Note:</b> Liquidations are never based on the collateral token&apos;s price - only BTC price movements
              in USDT. Happy Trading!
            </DialogContent>
          </div>
        </div>
      )}
    </>
  )
}
