/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent, useTheme } from '@mui/material'
import { dialogContent } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { useRootStore } from '../../store/root'
import { css } from '@emotion/react'
import { NavLink } from 'react-router-dom'
import { SelectTokenItem } from './SelectTokenItem'

type SelectTokenProps = {
  isOpen: boolean
  setIsOpen: (isOpenSelectToken: boolean) => void
}

export const SelectToken = ({ isOpen, setIsOpen }: SelectTokenProps) => {
  const theme = useTheme()
  const allPoolParams = useRootStore((state) => state.allPoolParams)
  return (
    <Dialog
      sx={{
        '.MuiDialog-paper': {
          width: '440px',
          borderRadius: '8px',
          background: theme.background.primary,
        },
      }}
      open={isOpen}
    >
      <DialogContent sx={{ padding: 0, color: theme.text.primary }}>
        <div css={dialogContent}>
          <div
            className="select-token-header"
            css={css`
              border-bottom: ${theme.splitLine.primary};
            `}
          >
            <div>
              <span>Select a token</span>
              <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
            </div>
          </div>
          <div
            className="select-token-list"
            css={css`
              border-bottom: ${theme.splitLine.primary};
              > div {
                :hover {
                  background: ${theme.palette.mode === 'dark' ? '#4B4B4B' : '#f6f6f6'};
                }
              }
            `}
          >
            {allPoolParams.length > 0 &&
              allPoolParams.map((pool) => {
                return <SelectTokenItem pool={pool} setIsOpen={setIsOpen} key={pool.tradingT} />
              })}
          </div>

          <div
            css={css`
              padding: 24px 64px;
              text-align: center;
            `}
          >
            <span>Can not find the target asset you want to trade? Come &nbsp;</span>
            <NavLink
              to={'/liquidity'}
              css={css`
                color: ${theme.palette.mode === 'dark' ? theme.text.primary : ''};
              `}
            >
              <span>create </span>
            </NavLink>
            <span>one!</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
