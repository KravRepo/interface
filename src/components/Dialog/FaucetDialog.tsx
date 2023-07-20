/** @jsxImportSource @emotion/react */
import { Dispatch, SetStateAction } from 'react'
import { useRootStore } from '../../store/root'
import { Dialog, DialogContent } from '@mui/material'
import { dialogContent } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { css } from '@emotion/react'
import { ReactComponent as DAIIcon } from '../../assets/imgs/tokens/dai.svg'
import { align } from '../../globalStyle'
import { useFaucet } from '../../hook/hookV8/useFaucet'

type FaucetDialogProps = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}
export const FaucetDialog = ({ isOpen, setIsOpen }: FaucetDialogProps) => {
  const allPoolParams = useRootStore((state) => state.allPoolParams)
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
              <span>Select a token</span>
              <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
            </div>
          </div>
          <div className="select-token-list">
            {allPoolParams.length > 0 &&
              allPoolParams.map((pool) => {
                return (
                  <div
                    key={pool.tokenT}
                    onClick={async () => {
                      await getFaucet(pool.tokenT)
                      setIsOpen(false)
                    }}
                  >
                    <div css={align}>
                      <DAIIcon height="40" width="40" />
                      <div
                        css={css`
                          margin-left: 12px;
                        `}
                      >
                        <p>{pool.symbol}</p>
                        <p className="grey">{pool.symbol}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
