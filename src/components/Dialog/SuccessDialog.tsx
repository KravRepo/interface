/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent, useMediaQuery, useTheme } from '@mui/material'
import { errorDialog } from './sytle'
import { ReactComponent as SuccessIcon } from '../../assets/imgs/success_icon.svg'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { TransactionAction, TransactionActionMsg } from '../../store/TransactionSlice'
import { ReactComponent as SuccessLogo } from '../../assets/imgs/success_logo.svg'
import { ReactComponent as SuccessDarkLogo } from '../../assets/imgs/darkModel/success_logo_dark.svg'
import KRAVButton from '../KravUIKit/KravButton'
import { useRootStore } from '../../store/root'
import { css } from '@emotion/react'
import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const SuccessDialog = () => {
  const theme = useTheme()
  const { i18n } = useLingui()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const successContent = useRootStore((state) => state.successContent)
  const setSuccessContent = useRootStore((state) => state.setSuccessContent)
  return (
    <Dialog
      sx={{
        '.MuiDialog-paper': {
          width: '440px',
          borderRadius: '8px',
          background: theme.background.primary,
        },
      }}
      open={successContent.dialogVisibility}
    >
      <DialogContent sx={{ padding: 0, color: theme.text.primary }}>
        <div css={errorDialog}>
          <div className="error-dialog-title">
            <SuccessIcon
              css={css`
                margin-left: ${isMobile ? '0' : '60px'};
              `}
            />
            <span
              css={css`
                font-size: ${isMobile ? '18px' : '20px'};
              `}
            >
              <Trans>Сongratulations!</Trans>{' '}
            </span>
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
            {successContent.action === TransactionAction.NONE ? (
              <></>
            ) : successContent.action === TransactionAction.REMOVE_LIQUIDITY ? (
              <p style={{ textAlign: 'center' }}>
                <Trans> Withdraw request confirmed</Trans>
                <br />
                <Trans>Please wait 24 hours to remove liquidity</Trans>
              </p>
            ) : (
              <p>
                {i18n._(TransactionActionMsg[successContent.action])} <Trans>successfully.</Trans>
              </p>
            )}
            {theme.palette.mode === 'dark' ? <SuccessDarkLogo /> : <SuccessLogo />}
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
