/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent } from '@mui/material'
import { errorDialog } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { useRootStore } from '../../store/root'
import { css } from '@emotion/react'
import { TransactionState } from '../../store/TransactionSlice'
import { ReactComponent as PendingIcon } from '../../assets/imgs/pending_icon.svg'
import { ReactComponent as ApproveIcon } from '../../assets/imgs/approve_icon.svg'
import { ReactComponent as InteractionIcon } from '../../assets/imgs/interaction_logo.svg'
import KRAVButton from '../KravUIKit/KravButton'

export const TransactionDialog = () => {
  const transactionState = useRootStore((state) => state.transactionState)
  const transactionDialogVisibility = useRootStore((state) => state.transactionDialogVisibility)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  return (
    <Dialog
      sx={{
        '.MuiDialog-paper': {
          width: '440px',
          borderRadius: '8px',
          background: '#fff',
          // backgroundColor: theme.palette.mode === 'dark' ? '#1B1E24' : '',
        },
      }}
      open={transactionDialogVisibility}
    >
      {transactionState === TransactionState.APPROVE && (
        <DialogContent sx={{ padding: 0, color: '#000' }}>
          <div css={errorDialog}>
            <div className="error-dialog-title">
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
                Please manually interact with your wallet. Ease enable Krav to access your tokens.
              </p>
              <ApproveIcon className="flash" />
              <KRAVButton disabled={true}>Awaiting...</KRAVButton>
            </div>
          </div>
        </DialogContent>
      )}
      {transactionState === TransactionState.INTERACTION && (
        <DialogContent sx={{ padding: 0, color: '#000' }}>
          <div css={errorDialog}>
            <div className="error-dialog-title">
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
              <InteractionIcon className="flash" />
              <KRAVButton disabled={true}>Awaiting...</KRAVButton>
            </div>
          </div>
        </DialogContent>
      )}
      {transactionState !== TransactionState.APPROVE && transactionState !== TransactionState.INTERACTION && (
        <DialogContent sx={{ padding: 0, color: '#000' }}>
          <div css={errorDialog}>
            <div className="error-dialog-title">
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
              <PendingIcon className="flash" />
              <KRAVButton disabled={true}>Awaiting...</KRAVButton>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
