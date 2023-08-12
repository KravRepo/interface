/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent, useTheme } from '@mui/material'
import { errorDialog } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { useRootStore } from '../../store/root'
import { ReactComponent as ErrorIcon } from '../../assets/imgs/error_icon.svg'
import { ReactComponent as ErrorLogo } from '../../assets/imgs/error_logo.svg'
import { ReactComponent as ErrorDarkLogo } from '../../assets/imgs/darkModel/error_logo_dark.svg'
import KRAVButton from '../KravUIKit/KravButton'
import { TransactionAction } from '../../store/TransactionSlice'

export const ErrorDialog = () => {
  const theme = useTheme()
  const errorContent = useRootStore((store) => store.errorContent)
  const setErrorContent = useRootStore((store) => store.setErrorContent)
  return (
    <Dialog
      sx={{
        '.MuiDialog-paper': {
          width: '440px',
          borderRadius: '8px',
          background: theme.background.primary,
          // backgroundColor: theme.palette.mode === 'dark' ? '#1B1E24' : '',
        },
      }}
      open={errorContent.dialogVisibility}
    >
      <DialogContent sx={{ padding: 0, color: theme.text.primary }}>
        <div css={errorDialog}>
          <div className="error-dialog-title">
            <ErrorIcon />
            <span>Something went wrong... </span>
            <CloseSharpIcon
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                const errorContent = {
                  dialogVisibility: false,
                  action: TransactionAction.NONE,
                }
                setErrorContent(errorContent)
              }}
            />
          </div>
          <div className="error-dialog-content">
            <p>There is a problem with {errorContent.action}.</p>
            {errorContent?.reason && <p>{errorContent.reason}</p>}
            {theme.palette.mode === 'dark' ? <ErrorDarkLogo /> : <ErrorLogo />}
            <KRAVButton
              onClick={() => {
                const errorContent = {
                  dialogVisibility: false,
                  action: TransactionAction.NONE,
                }
                setErrorContent(errorContent)
              }}
            >
              Ok
            </KRAVButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
