/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent, useTheme } from '@mui/material'
import { dialogContent } from './sytle'
import { css } from '@emotion/react'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { align } from '../../globalStyle'
import { useRootStore } from '../../store/root'

type PairInfo = {
  symbol: string
  pairIndex: number
  logoSource: any
}

export const SelectPair = ({
  isOpen,
  setIsOpen,
  allPairInfo,
}: {
  isOpen: boolean
  setIsOpen: () => void
  allPairInfo: PairInfo[]
}) => {
  const theme = useTheme()
  const setTradePairIndex = useRootStore((store) => store.setTradePairIndex)
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
            {allPairInfo.length > 0 &&
              allPairInfo.map((pair) => {
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
                        src={pair.logoSource}
                        height="40"
                        width="40"
                      />
                      <div
                        css={css`
                          margin-left: 12px;
                        `}
                      >
                        <p>{pair.symbol}</p>
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
