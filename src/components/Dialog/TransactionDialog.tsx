/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent, useMediaQuery, useTheme } from '@mui/material'
import { errorDialog } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { useRootStore } from '../../store/root'
import { css } from '@emotion/react'
import { TransactionState } from '../../store/TransactionSlice'
import { ReactComponent as PendingIcon } from '../../assets/imgs/pending_icon.svg'
import { ReactComponent as ApproveIcon } from '../../assets/imgs/approve_icon.svg'
import { ReactComponent as InteractionIcon } from '../../assets/imgs/interaction_logo.svg'
import { ReactComponent as PendingDarkIcon } from '../../assets/imgs/darkModel/pending_icon_dark.svg'
import { ReactComponent as ApproveDarkIcon } from '../../assets/imgs/darkModel/approve_icon_dark.svg'
import { ReactComponent as InteractionDarkIcon } from '../../assets/imgs/darkModel/interaction_logo_dark.svg'
import KRAVButton from '../KravUIKit/KravButton'

export const TransactionDialog = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const transactionState = useRootStore((state) => state.transactionState)
  const transactionDialogVisibility = useRootStore((state) => state.transactionDialogVisibility)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  return (
    <Dialog
      sx={{
        '.MuiDialog-paper': {
          maxWidth: '440px',
          // width: isMobile ? 'calc(100vw - 32px)' : '440px',
          borderRadius: '8px',
          background: theme.background.primary,
          // backgroundColor: theme.palette.mode === 'dark' ? '#1B1E24' : '',
        },
      }}
      open={transactionDialogVisibility}
    >
      {transactionState === TransactionState.APPROVE && (
        <DialogContent sx={{ padding: 0, color: theme.text.primary }}>
          <div
            css={[
              errorDialog,
              css`
                background: ${theme.background.primary};
              `,
            ]}
          >
            <div
              className="error-dialog-title"
              css={css`
                border-bottom: ${theme.splitLine.primary};
                font-size: ${isMobile ? '18px' : '20px'};
              `}
            >
              <span
                css={css`
                  padding: 0;
                `}
              >
                Krav requests wallet approval
              </span>
              <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => setTransactionDialogVisibility(false)} />
            </div>
            <div
              className="error-dialog-content"
              css={css`
                text-align: center;
              `}
            >
              <p
                css={css`
                  font-size: 14px;
                `}
              >
                Please manually interact with your wallet. Please enable Krav to access your tokens.
              </p>
              {theme.palette.mode === 'dark' ? (
                <ApproveDarkIcon className="flash" />
              ) : (
                <ApproveIcon className="flash" />
              )}

              <KRAVButton disabled={true}>Awaiting...</KRAVButton>
            </div>
          </div>
        </DialogContent>
      )}
      {transactionState === TransactionState.INTERACTION && (
        <DialogContent sx={{ padding: 0, color: theme.text.primary }}>
          <div
            css={[
              errorDialog,
              css`
                background: ${theme.background.primary};
              `,
            ]}
          >
            <div
              className="error-dialog-title"
              css={css`
                border-bottom: ${theme.splitLine.primary};
                font-size: ${isMobile ? '18px' : '20px'};
              `}
            >
              <span
                css={css`
                  padding: 0;
                `}
              >
                Krav requests wallet interaction
              </span>
              <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => setTransactionDialogVisibility(false)} />
            </div>
            <div
              className="error-dialog-content"
              css={css`
                text-align: center;
              `}
            >
              <p
                css={css`
                  font-size: 14px;
                `}
              >
                Please open your wallet and confirm in the transaction activity to proceed your order.
              </p>
              {theme.palette.mode === 'dark' ? (
                <InteractionDarkIcon className="flash" />
              ) : (
                <InteractionIcon className="flash" />
              )}

              <KRAVButton disabled={true}>Awaiting...</KRAVButton>
            </div>
          </div>
        </DialogContent>
      )}
      {transactionState !== TransactionState.APPROVE && transactionState !== TransactionState.INTERACTION && (
        <DialogContent sx={{ padding: 0, color: theme.text.primary }}>
          <div
            css={[
              errorDialog,
              css`
                background: ${theme.background.primary};
              `,
            ]}
          >
            <div
              className="error-dialog-title"
              css={css`
                border-bottom: ${theme.splitLine.primary};
                font-size: ${isMobile ? '18px' : '20px'};
              `}
            >
              <span>Krav waiting for transaction settlement</span>
              <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => setTransactionDialogVisibility(false)} />
            </div>
            <div
              className="error-dialog-content"
              css={css`
                text-align: center;
              `}
            >
              <p
                css={css`
                  font-size: 14px;
                  padding: 0 12px;
                `}
              >
                Krav is engaging with blockchain transaction, please wait patiently for on-chain transaction settlement.
              </p>
              {theme.palette.mode === 'dark' ? (
                <PendingDarkIcon className="flash" />
              ) : (
                <PendingIcon className="flash" />
              )}

              <KRAVButton disabled={true}>Awaiting...</KRAVButton>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
