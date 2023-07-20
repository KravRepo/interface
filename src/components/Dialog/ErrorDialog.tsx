/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent } from '@mui/material'
import { dialogContent } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { useRootStore } from '../../store/root'

export const ErrorDialog = () => {
  const errorContent = useRootStore((store) => store.errorContent)
  const setErrorContent = useRootStore((store) => store.setErrorContent)
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
      open={errorContent.dialogVisibility}
    >
      <DialogContent sx={{ padding: 0, color: '#000' }}>
        <div css={dialogContent}>
          <div className="dialog-header">
            <span>Error</span>
            <CloseSharpIcon
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                const errorContent = {
                  dialogVisibility: false,
                  error: '',
                }
                setErrorContent(errorContent)
              }}
            />
          </div>
          <div className="error-dialog">{errorContent.error}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
