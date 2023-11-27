/** @jsxImportSource @emotion/react */
import { headerBtn } from './sytle'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { ReactComponent as Base } from '../../assets/imgs/chain_base.svg'
import { ReactComponent as ARB } from '../../assets/imgs/arbitrum.svg'
import { ReactComponent as BSC } from '../../assets/imgs/bsc.svg'
import { ReactComponent as OP } from '../../assets/imgs/optimism.svg'
import { ReactComponent as Polygon } from '../../assets/imgs/polygon.svg'
import { ReactComponent as ZKEVM } from '../../assets/imgs/zkevm.svg'
import { Button, Menu, MenuItem, useTheme } from '@mui/material'
import { css } from '@emotion/react'
import { align } from '../../globalStyle'
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'
import React, { useMemo, useState } from 'react'
import { ReactComponent as EthIcon } from '../../assets/imgs/tokens/Ehter.svg'
import { useWeb3React } from '@web3-react/core'
import { ChainId } from '../../constant/chain'
import { useConnect } from '../../hook/hookV8/useConnect'

const NetWorkerLogo = () => {
  const { chainId } = useWeb3React()
  switch (chainId) {
    case ChainId.MAINNET:
      return <EthIcon height="24" width="24" style={{ borderRadius: '50%', minWidth: '24px' }} />
    case ChainId.BSC:
      return <BSC height="24" width="24" style={{ borderRadius: '50%', minWidth: '24px' }} />
    case ChainId.OP:
      return <OP height="24" width="24" style={{ borderRadius: '50%', minWidth: '24px' }} />
    case ChainId.POLYGON:
      return <Polygon height="24" width="24" style={{ borderRadius: '50%', minWidth: '24px' }} />
    case ChainId.ARB:
      return <ARB height="24" width="24" style={{ borderRadius: '50%', minWidth: '24px' }} />
    case ChainId.POLYGON_ZK_EVM:
      return <ZKEVM height="24" width="24" style={{ borderRadius: '50%', minWidth: '24px' }} />
    default:
      return <Base height="24" width="24" style={{ borderRadius: '50%', minWidth: '24px' }} />
  }
}

export const NetWorkButton = () => {
  const { chainId } = useWeb3React()
  const theme = useTheme()
  const connect = useConnect()
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

  const handleChangeNetWork = async (chainId: number) => {
    await connect(chainId)
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
        <NetWorkerLogo />
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
        <MenuItem
          sx={{ width: '100%' }}
          onClick={async () => {
            await handleChangeNetWork(ChainId.BASE)
          }}
        >
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
            {chainId === ChainId.BASE && (
              <DoneOutlinedIcon sx={{ color: theme.palette.mode === 'dark' ? '#dedede' : '' }} />
            )}
          </div>
        </MenuItem>
        <MenuItem
          onClick={async () => {
            await handleChangeNetWork(ChainId.MAINNET)
          }}
          sx={{ width: '100%' }}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: space-between;
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
            {chainId === ChainId.MAINNET && (
              <DoneOutlinedIcon sx={{ color: theme.palette.mode === 'dark' ? '#dedede' : '' }} />
            )}
          </div>
        </MenuItem>
        <MenuItem
          sx={{ width: '100%' }}
          onClick={async () => {
            await handleChangeNetWork(ChainId.BSC)
          }}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
            `}
          >
            <div css={align}>
              <BSC height="24" width="24" style={{ marginRight: '12px', borderRadius: '50%' }} />
              <span>BNB Smart Chain Mainnet</span>
            </div>
            {chainId === ChainId.BSC && (
              <DoneOutlinedIcon sx={{ color: theme.palette.mode === 'dark' ? '#dedede' : '' }} />
            )}
          </div>
        </MenuItem>
        <MenuItem
          sx={{ width: '100%' }}
          onClick={async () => {
            await handleChangeNetWork(ChainId.ARB)
          }}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
            `}
          >
            <div css={align}>
              <ARB height="24" width="24" style={{ marginRight: '12px', borderRadius: '50%' }} />
              <span>Arbitrum One</span>
            </div>
            {chainId === ChainId.ARB && (
              <DoneOutlinedIcon sx={{ color: theme.palette.mode === 'dark' ? '#dedede' : '' }} />
            )}
          </div>
        </MenuItem>
        <MenuItem
          sx={{ width: '100%' }}
          onClick={async () => {
            await handleChangeNetWork(ChainId.OP)
          }}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
            `}
          >
            <div css={align}>
              <OP height="24" width="24" style={{ marginRight: '12px', borderRadius: '50%' }} />
              <span>Optimism</span>
            </div>
            {chainId === ChainId.OP && (
              <DoneOutlinedIcon sx={{ color: theme.palette.mode === 'dark' ? '#dedede' : '' }} />
            )}
          </div>
        </MenuItem>
        <MenuItem
          sx={{ width: '100%' }}
          onClick={async () => {
            await handleChangeNetWork(ChainId.POLYGON)
          }}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
            `}
          >
            <div css={align}>
              <Polygon height="24" width="24" style={{ marginRight: '12px', borderRadius: '50%' }} />
              <span>Polygon</span>
            </div>
            {chainId === ChainId.POLYGON && (
              <DoneOutlinedIcon sx={{ color: theme.palette.mode === 'dark' ? '#dedede' : '' }} />
            )}
          </div>
        </MenuItem>
        <MenuItem
          sx={{ width: '100%' }}
          onClick={async () => {
            await handleChangeNetWork(ChainId.POLYGON_ZK_EVM)
          }}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
            `}
          >
            <div css={align}>
              <ZKEVM height="24" width="24" style={{ marginRight: '12px', borderRadius: '50%' }} />
              <span>Polygon zkEVM</span>
            </div>
            {chainId === ChainId.POLYGON_ZK_EVM && (
              <DoneOutlinedIcon sx={{ color: theme.palette.mode === 'dark' ? '#dedede' : '' }} />
            )}
          </div>
        </MenuItem>
      </Menu>
    </>
  )
}
