/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent } from '@mui/material'
import { errorDialog } from './sytle'
import { ReactComponent as SuccessIcon } from '../../assets/imgs/success_icon.svg'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { TransactionAction } from '../../store/TransactionSlice'
import { ReactComponent as SuccessLogo } from '../../assets/imgs/success_logo.svg'
import KRAVButton from '../KravUIKit/KravButton'
import { useRootStore } from '../../store/root'
import { css } from '@emotion/react'

export const SuccessDialog = () => {
  const successContent = useRootStore((state) => state.successContent)
  const setSuccessContent = useRootStore((state) => state.setSuccessContent)
  return (
    <Dialog
      sx={{
        '.MuiDialog-paper': {
          width: '440px',
          borderRadius: '8px',
          background: '#fff',
        },
      }}
      open={successContent.dialogVisibility}
    >
      <DialogContent sx={{ padding: 0, color: '#000' }}>
        <div css={errorDialog}>
          <div className="error-dialog-title">
            <SuccessIcon
              css={css`
                margin-left: 60px;
              `}
            />
            <span>Сongratulations! </span>
            <CloseSharpIcon
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                const errorContent = {
                  dialogVisibility: false,
                  action: TransactionAction.NONE,
                }
                setSuccessContent(errorContent)
              }}
            />
          </div>
          <div className="error-dialog-content">
            <p>{successContent.action} successfully.</p>
            <SuccessLogo />
            <KRAVButton
              onClick={() => {
                const errorContent = {
                  dialogVisibility: false,
                  action: TransactionAction.NONE,
                }
                setSuccessContent(errorContent)
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
