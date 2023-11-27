/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent, useTheme } from '@mui/material'
import { dialogContent } from './sytle'
import { css } from '@emotion/react'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { align } from '../../globalStyle'
import { useRootStore } from '../../store/root'
import { useMemo } from 'react'

export const SelectPair = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: () => void }) => {
  const theme = useTheme()
  const setTradePairIndex = useRootStore((store) => store.setTradePairIndex)
  const pairConfig = useRootStore((store) => store.pairConfig)
  const pairs = useMemo(() => {
    return Object.keys(pairConfig).map((key) => {
      return pairConfig[Number(key)]
    })
  }, [pairConfig])
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
              padding-bottom: 0 !important;
            `}
          >
            <div>
              <span>Select a pair</span>
              <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => setIsOpen()} />
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
            {pairs.length > 0 &&
              pairs.map((pair) => {
                return (
                  <div
                    key={pair.symbol}
                    onClick={() => {
                      setTradePairIndex(pair.pairIndex)
                      setIsOpen()
                    }}
                  >
                    <div css={align}>
                      <img
                        css={css`
                          border-radius: 50%;
                          background: ${theme.palette.mode === 'dark' ? '#fff' : ''};
                        `}
                        src={pair.logoSource.default}
                        height="40"
                        width="40"
                      />
                      <div
                        css={css`
                          margin-left: 12px;
                        `}
                      >
                        <p>{pair.titleSymbol}</p>
                        <p className="grey">{pair.symbol}</p>
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
