/** @jsxImportSource @emotion/react */
import { Button, Dialog, DialogContent } from '@mui/material'
import { dialogContent } from './sytle'
import React, { Dispatch } from 'react'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import KARVSearchTextField from '../KravUIKit/KarvSearchTextField'
import { useRootStore } from '../../store/root'
import { ReactComponent as DAIIcon } from '../../assets/imgs/tokens/dai.svg'
import { ReactComponent as EtherIcon } from '../../assets/imgs/tokens/Ehter.svg'
import { ReactComponent as USDCoinIcon } from '../../assets/imgs/tokens/USDCoin.svg'
import { ReactComponent as TetherIcon } from '../../assets/imgs/tokens/Tehter.svg'
import { css } from '@emotion/react'
import { NavLink } from 'react-router-dom'
import { SelectTokenItem } from './SelectTokenItem'

type SelectTokenProps = {
  isOpen: boolean
  setIsOpen: Dispatch<React.SetStateAction<boolean>>
}

export const SelectToken = ({ isOpen, setIsOpen }: SelectTokenProps) => {
  const allPoolParams = useRootStore((state) => state.allPoolParams)
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
            <KARVSearchTextField
              placeholder="Search name or paste address"
              adornment={'start'}
              sx={{ height: '40px', width: '100%' }}
            />
            <div
              css={css`
                padding-top: 16px;
                display: flex;
              `}
            >
              <Button
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #DADADA',
                  borderRadius: '100px',
                  padding: '4px 10px 4px 6px',
                  mr: '12px',
                }}
              >
                <EtherIcon height="24" width="24" />
                <span
                  css={css`
                    color: #000;
                    margin-left: 6px;
                  `}
                >
                  ETH
                </span>
              </Button>
              <Button
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #DADADA',
                  borderRadius: '100px',
                  padding: '4px 10px 4px 6px',
                  mr: '12px',
                }}
              >
                <DAIIcon height="24" width="24" />{' '}
                <span
                  css={css`
                    color: #000;
                    margin-left: 6px;
                  `}
                >
                  DAI
                </span>
              </Button>
              <Button
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #DADADA',
                  borderRadius: '100px',
                  padding: '4px 10px 4px 6px',
                  mr: '12px',
                }}
              >
                <USDCoinIcon height="24" width="24" />{' '}
                <span
                  css={css`
                    color: #000;
                    margin-left: 6px;
                  `}
                >
                  USDC
                </span>
              </Button>
              <Button
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #DADADA',
                  borderRadius: '100px',
                  padding: '4px 10px 4px 6px',
                }}
              >
                <TetherIcon height="24" width="24" />{' '}
                <span
                  css={css`
                    color: #000;
                    margin-left: 6px;
                  `}
                >
                  USDT
                </span>
              </Button>
            </div>
          </div>
          <div className="select-token-list">
            {allPoolParams.length > 0 &&
              allPoolParams.map((pool) => {
                return <SelectTokenItem pool={pool} setIsOpen={setIsOpen} key={pool.tokenT} />
              })}
          </div>

          <div
            css={css`
              padding: 24px 64px;
              text-align: center;
            `}
          >
            <span>Can not find the target asset you want to trade? Come &nbsp;</span>
            <NavLink to={'/liquidity'}>
              <span>create </span>
            </NavLink>
            <span>one!</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
