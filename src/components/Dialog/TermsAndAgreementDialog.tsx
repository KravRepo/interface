import * as React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import text from '../../constant/TermsAndAgreement'
import KRAVButton from '../KravUIKit/KravButton'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useLocation } from 'react-router-dom'

export default function TermsAndAgreementDialog() {
  const [open, setOpen] = React.useState(false)
  const [agree, setAgree] = React.useState(false)
  const { pathname } = useLocation()
  console.log({ pathname })

  const handleClose = (e: any, reason: any) => {
    if (reason && reason === 'backdropClick') return
    setOpen(false)
  }

  const handleFullWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const text = document.getElementById('terms-of-agreement')
    // if (!text) return
    // if (text.scrollTop < text.scrollHeight - text.clientHeight) {
    //   return
    // }
    const checked = event.target.checked
    if (checked) {
      localStorage.setItem('KRAV_AGREEMENT', 'true')
    } else {
      localStorage.setItem('KRAV_AGREEMENT', 'false')
    }

    setAgree(event.target.checked)
  }

  React.useEffect(() => {
    const agree = localStorage.getItem('KRAV_AGREEMENT')
    if (agree !== 'true' && (pathname === '/trade' || pathname === '/liquidity')) {
      setOpen(true)
    }
  }, [pathname])

  return (
    <React.Fragment>
      <Dialog
        maxWidth={'sm'}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: (theme) => theme.background.primary,
          },
        }}
        disableEscapeKeyDown
        sx={{
          '& .c8': {
            paddingBottom: '8pt',
            lineHeight: 1.08,
            orphans: 2,
            widows: 2,
            textAlign: 'justify',
          },
          '& .c9': {
            fontWeight: 700,
          },
          '& .c0': {
            verticalAlign: 'baseline',
            fontStyle: 'normal',
          },
          '& ol': {
            paddingLeft: '10px',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: 'GT-Flexa-Bold-Trial',
            textAlign: 'center',
          }}
        >
          KRAV - Terms of Service
        </DialogTitle>
        <DialogContent sx={{ px: 0 }}>
          <DialogContentText
            id="terms-of-agreement"
            component={'div'}
            dangerouslySetInnerHTML={{ __html: text }}
            sx={{
              fontSize: 12,
              maxHeight: { xs: '400px', md: '500px' },
              overflow: 'auto',
              overflowX: 'hidden',
              background: 'transparent',
              mx: 0,
              padding: { xs: '20px', md: '24px' },
              borderRadius: '5px',
            }}
          ></DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
            }}
          >
            <FormControlLabel
              sx={{
                mt: 2,
                '& .MuiFormControlLabel-label': { fontSize: 14 },
              }}
              control={<Checkbox checked={agree} onChange={handleFullWidthChange} />}
              label="I Agree"
              labelPlacement="end"
            />
            {/* <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <InputLabel htmlFor="agree">Agree</InputLabel>
              <CheckBox onClick={handleFullWidthChange} />
            </FormControl> */}
          </Box>
          {agree && (
            <DialogActions>
              <KRAVButton onClick={handleClose as any}> Close</KRAVButton>
            </DialogActions>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
