/** @jsxImportSource @emotion/react */
import { Snackbar, useMediaQuery, useTheme } from '@mui/material'
import { useRootStore } from '../../store/root'
import { ReactComponent as Success } from '../../assets/imgs/success_icon.svg'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { useMemo } from 'react'
import { snackbar } from './sytle'
import { css } from '@emotion/react'

export const SuccessSnackbar = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const successSnackbarInfo = useRootStore((state) => state.successSnackbarInfo)
  const setSuccessSnackbarInfo = useRootStore((state) => state.setSuccessSnackbarInfo)
  const handleClose = () => {
    setSuccessSnackbarInfo({
      snackbarVisibility: false,
      title: '',
      content: '',
    })
  }
  const currentTime = useMemo(() => {
    const now = new Date()
    return now.toLocaleString()
  }, [successSnackbarInfo])

  return (
    <>
      {!isMobile && (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={successSnackbarInfo.snackbarVisibility}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <div
            css={[
              snackbar,
              css`
                background: ${theme.background.primary};
                color: ${theme.text.primary};
              `,
            ]}
          >
            <div className="snackbar-title">
              <div>
                <Success />
                <span>{successSnackbarInfo.title} Success</span>
              </div>
              <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
            </div>
            <div>{successSnackbarInfo.content}</div>
            <div className="snackbar-time">{currentTime}</div>
          </div>
        </Snackbar>
      )}
    </>
  )
}
