/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent } from '@mui/material'
import { dialogContent } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { useRootStore } from '../../store/root'
import { css } from '@emotion/react'

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
      <DialogContent sx={{ padding: 0, color: '#000' }}>
        <div css={dialogContent}>
          <div className="dialog-header">
            <span>Pending</span>
            <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => setTransactionDialogVisibility(false)} />
          </div>
          <div
            css={css`
              text-align: center;
            `}
          >
            <div className="loader loader-7">
              <div className="line line1" />
              <div className="line line2" />
              <div className="line line3" />
            </div>
            <p
              css={css`
                padding-bottom: 36px;
                font-size: 20px;
              `}
            >
              {transactionState}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
