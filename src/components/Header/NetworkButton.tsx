/** @jsxImportSource @emotion/react */
import { headerBtn } from './sytle'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { ReactComponent as Base } from '../../assets/imgs/chain_base.svg'
import { Button, Link, Menu, MenuItem, useTheme } from '@mui/material'
import { css } from '@emotion/react'
import { align } from '../../globalStyle'
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'
import React, { useMemo, useState } from 'react'
import { ReactComponent as EthIcon } from '../../assets/imgs/tokens/Ehter.svg'

export const NetWorkButton = () => {
  const theme = useTheme()
  const [netWorkAnchorEl, setNetWorkAnchorEl] = useState<null | HTMLElement>(null)
  const networkOpen = useMemo(() => {
    return Boolean(netWorkAnchorEl)
  }, [netWorkAnchorEl])
  const handleNetWorkClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNetWorkAnchorEl(event.currentTarget)
  }
  const handleNetWorkClose = () => {
    setNetWorkAnchorEl(null)
  }
  return (
    <>
      <Button
        css={headerBtn}
        sx={{
          color: '#000',
          borderRadius: '4px',
          border: theme.palette.mode === 'dark' ? '1px solid #4B4B4B' : '1px solid #DADADA',
          textTransform: 'none',
          minWidth: '60px',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? '#4B4B4B' : '#DADADA',
          },
        }}
        endIcon={
          networkOpen ? (
            <KeyboardArrowUpIcon sx={{ color: theme.palette.mode === 'dark' ? '#dedede' : '' }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ color: theme.palette.mode === 'dark' ? '#dedede' : '' }} />
          )
        }
        id="network-button"
        aria-controls={networkOpen ? 'network-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={networkOpen ? 'true' : undefined}
        onClick={handleNetWorkClick}
      >
        <Base height="24" width="24" style={{ borderRadius: '50%', minWidth: '24px' }} />
      </Button>
      <Menu
        sx={{
          '& .MuiPaper-root': {
            minWidth: 220,
          },
        }}
        id="network-menu"
        anchorEl={netWorkAnchorEl}
        open={networkOpen}
        onClose={handleNetWorkClose}
        MenuListProps={{
          'aria-labelledby': 'network-button',
        }}
      >
        <MenuItem sx={{ width: '100%' }} onClick={handleNetWorkClose}>
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
            `}
          >
            <div css={align}>
              <Base height="24" width="24" style={{ marginRight: '12px', borderRadius: '50%' }} />
              <span>Base</span>
            </div>
            <DoneOutlinedIcon sx={{ color: theme.palette.mode === 'dark' ? '#dedede' : '' }} />
          </div>
        </MenuItem>
        <MenuItem sx={{ width: '100%' }} onClick={handleNetWorkClose}>
          <Link underline="none" href="https://eth.krav.trade/">
            <div
              css={css`
                width: 100%;
              `}
            >
              <div css={align}>
                <EthIcon height="24" width="24" style={{ marginRight: '12px', borderRadius: '50%' }} />
                <span
                  css={css`
                    color: ${theme.text.primary};
                  `}
                >
                  Ethereum
                </span>
              </div>
            </div>
          </Link>
        </MenuItem>
      </Menu>
    </>
  )
}
