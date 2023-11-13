/** @jsxImportSource @emotion/react */
import { Dispatch, SetStateAction } from 'react'
import { Dialog, DialogContent } from '@mui/material'
import { dialogContent } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { align } from '../../globalStyle'
import { useFaucet } from '../../hook/hookV8/useFaucet'
import KRAVButton from '../KravUIKit/KravButton'

type FaucetDialogProps = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}
export const FaucetDialog = ({ isOpen, setIsOpen }: FaucetDialogProps) => {
  const getFaucet = useFaucet()
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
      open={isOpen}
    >
      <DialogContent sx={{ padding: 0, color: '#000' }}>
        <div css={dialogContent}>
          <div className="select-token-header">
            <div>
              <span>Faucet</span>
              <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
            </div>
          </div>
          <div className="select-token-list">
            {/*<div*/}
            {/*  onClick={async () => {*/}
            {/*    await getFaucet('0x8b99c4DE6f3D396a9d4BBcAF9fA138F5393299FE')*/}
            {/*    setIsOpen(false)*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <div css={align}>*/}
            {/*    <DAIIcon height="40" width="40" />*/}
            {/*    <div*/}
            {/*      css={css`*/}
            {/*        margin-left: 12px;*/}
            {/*      `}*/}
            {/*    >*/}
            {/*      <p>KRAV</p>*/}
            {/*      <p className="grey">Krav</p>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
            <KRAVButton
              onClick={async () => {
                await getFaucet()
                setIsOpen(false)
              }}
            >
              <div css={align}>Faucet</div>
            </KRAVButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
