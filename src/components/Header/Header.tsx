/** @jsxImportSource @emotion/react */
import { Box, Button, Link, Menu, MenuItem, Tooltip } from '@mui/material'
import { Trans } from '@lingui/macro'
import { header, headerBtn, router, routerActive, setting, UnSupport } from './sytle'
import { align } from '../../globalStyle'
import { ReactComponent as Base } from '../../assets/imgs/chain_base.svg'
import { ReactComponent as AccountIcon } from '../../assets/imgs/account_logo.svg'
import { ReactComponent as KarvIcon } from '../../assets/imgs/tokens/karv_icon.svg'
import { ReactComponent as CopyIcon } from '../../assets/imgs/copy_icon.svg'
import { ReactComponent as OpenIcon } from '../../assets/imgs/open_browser.svg'
import { ReactComponent as DisconnectIcon1 } from '../../assets/imgs/disconnect_icon_1.svg'
import { ReactComponent as DisconnectIcon2 } from '../../assets/imgs/disconnect_icon_2.svg'
// import { ReactComponent as Notify } from 'assets/imgs/notify.svg'
import { ReactComponent as KravLogo } from '../../assets/imgs/krav_logo.svg'
import { css } from '@emotion/react'
import { ConnectWalletDialog } from '../../components/Dialog/ConnectWallet'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useRootStore } from '../../store/root'
import { NavLink, useLocation } from 'react-router-dom'
import { getConnection } from '../../connectors'
import { ConnectionType } from '../../connectors/type'
import { useFactory } from '../../hook/hookV8/useFactory'
import { useUserPosition } from '../../hook/hookV8/useUserPosition'
import { CHAINS, getAddChainParameters } from '../../connectors/chain'
import KRAVButton from '../KravUIKit/KravButton'
import { TEST_CHAIN_ID } from '../../constant/chain'
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { getBigNumberStr } from '../../utils'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'

export const Header = () => {
  const setWalletDialogVisibility = useRootStore((store) => store.setWalletDialogVisibility)
  const walletDialogVisibility = useRootStore((store) => store.walletDialogVisibility)
  const { account, chainId, connector, provider } = useWeb3React()
  const [dataInterval, setDataInterval] = useState<null | NodeJS.Timer>(null)
  const [openTooltip, setOpenTooltip] = useState(false)
  const [ethBalance, setEthBalance] = useState(new BigNumber(0))

  const setAccount = useRootStore((store) => store.setAccount)
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const setLoadingData = useRootStore((store) => store.setLoadingData)
  const disconnectWallet = useRootStore((store) => store.disconnectWallet)
  const setDisconnectWallet = useRootStore((store) => store.setDisconnectWallet)
  const { pathname } = useLocation()

  const getUserPosition = useUserPosition()
  const getFactory = useFactory()
  const connection = useMemo(() => {
    return getConnection(ConnectionType.INJECTED)
  }, [chainId])

  const isHomePath = useMemo(() => {
    const pathList = ['/portfolio', '/portfolio/stake', '/portfolio/farm', '/portfolio/referral', '/portfolio/reward']
    return pathList.includes(pathname)
  }, [pathname])

  const isTradePath = useMemo(() => {
    return pathname.includes('/trade')
  }, [pathname])

  const updateFactory = useCallback(async () => {
    await getFactory()
    setLoadingData(false)
    setAccount(account)
  }, [])

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

  const [settingAnchorEl, setSettingAnchorEl] = useState<null | HTMLElement>(null)
  const settingOpen = useMemo(() => {
    return Boolean(settingAnchorEl)
  }, [settingAnchorEl])
  const handleSettingClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSettingAnchorEl(event.currentTarget)
  }
  const handleSettingClose = () => {
    setSettingAnchorEl(null)
  }
  const useCopyAddress = useCallback(async () => {
    try {
      if (account) {
        await navigator.clipboard.writeText(account)
        setOpenTooltip(true)
        setTimeout(() => {
          setOpenTooltip(false)
          setSettingAnchorEl(null)
        }, 3000)
      }
    } catch (e) {}
  }, [account])

  const disconnect = useCallback(async () => {
    if (connection && connector) {
      await connector.resetState()
      await connection.connector.resetState()
      console.log('setDisconnect')
      setDisconnectWallet(true)
    }
  }, [connector])

  useEffect(() => {
    setTimeout(async () => {
      if (connection && !account && !disconnectWallet) {
        try {
          await connection.connector.activate(chainId !== TEST_CHAIN_ID ? TEST_CHAIN_ID : undefined)
          await connector.activate()
          setDisconnectWallet(true)
          await updateFactory()
        } catch (e) {
          try {
            await connection.connector.activate(getAddChainParameters(TEST_CHAIN_ID))
            await connector.activate()
            await updateFactory()
          } catch (e) {}
        }
      }
    }, 200)
  }, [connection, account, chainId, disconnectWallet])

  useEffect(() => {
    if (account && allPoolParams.length > 0) {
      setTimeout(() => {
        getUserPosition().then()
      }, 1000)
      if (!dataInterval) {
        const res = setInterval(async () => {
          console.log('update user data')
          await getUserPosition()
        }, 10000)
        setDataInterval(res)
      }
    }
    return () => {
      clearInterval(dataInterval as NodeJS.Timer)
      setDataInterval(null)
    }
  }, [account, allPoolParams])

  useEffect(() => {
    if (account && provider) {
      provider.getBalance(account).then((res) => {
        setEthBalance(eXDecimals(res._hex, 18))
      })
      setInterval(() => {
        provider.getBalance(account).then((res) => {
          setEthBalance(eXDecimals(res._hex, 18))
        })
      }, 15000)
    }
  }, [account, provider])

  return (
    <>
      <header
        css={[
          header,
          css`
            background: ${isHomePath ? '#fff' : ''};
          `,
        ]}
      >
        <div css={align}>
          <div
            css={[
              align,
              css`
                margin-right: 73px;
              `,
            ]}
          >
            <NavLink to={'/trade'}>
              <KravLogo height="22" width="91" />
            </NavLink>
          </div>
          <Box
            sx={{
              '& a:hover': {
                background: 'none',
                boxShadow: 'none',
                color: '#757575',
              },
              '& a.active:hover': {
                background: '#000000',
                color: '#fff',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              },
            }}
          >
            <NavLink to={'/trade'} css={[router, isTradePath ? routerActive : '']}>
              <Trans>Trade</Trans>
            </NavLink>
            <NavLink to={'/liquidity'} css={[router, pathname === '/liquidity' ? routerActive : '']}>
              <Trans>Liquidity</Trans>
            </NavLink>
            <NavLink to={'/portfolio'} css={[router, isHomePath ? routerActive : '']}>
              <Trans>Portfolio</Trans>
            </NavLink>
            <NavLink to={'/statistics'} css={[router, pathname === '/statistics' ? routerActive : '']}>
              <Trans>Statistics</Trans>
            </NavLink>
          </Box>
        </div>
        <div css={align}>
          {/*<Button*/}
          {/*  css={headerBtn}*/}
          {/*  sx={{*/}
          {/*    color: '#000',*/}
          {/*    borderRadius: '4px',*/}
          {/*    border: '1px solid #DADADA',*/}
          {/*    textTransform: 'none',*/}
          {/*    minWidth: '172px',*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <Base height="14" width="14" style={{ marginRight: 5, borderRadius: '50%' }} />*/}
          {/*  <Trans>Base</Trans>*/}
          {/*</Button>*/}
          <Button
            css={headerBtn}
            sx={{
              color: '#000',
              borderRadius: '4px',
              border: '1px solid #DADADA',
              textTransform: 'none',
              minWidth: '60px',
              '&:hover': {
                backgroundColor: '#DADADA',
              },
            }}
            endIcon={networkOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
                <DoneOutlinedIcon />
              </div>
            </MenuItem>
          </Menu>
          {account ? (
            <>
              <KRAVButton
                sx={{
                  width: 'auto',
                  color: '#fff',
                  background: '#000000',
                  mx: '9px',
                  borderRadius: '4px',
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                }}
                css={headerBtn}
                id="setting-button"
                aria-controls={settingOpen ? 'setting-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={settingOpen ? 'true' : undefined}
                onClick={handleSettingClick}
              >
                <div
                  css={css`
                    border-radius: 50%;
                    background: white;
                    height: 24px;
                    width: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 8px;
                  `}
                >
                  <AccountIcon />
                </div>
                {account.substr(0, 4)}
                ...
                {account.substr(account.length - 2, 2)}
              </KRAVButton>
              <Menu
                css={setting}
                sx={{
                  '& .MuiPaper-root': {
                    minWidth: 440,
                  },
                }}
                id="setting-menu"
                anchorEl={settingAnchorEl}
                open={settingOpen}
                onClose={handleSettingClose}
                MenuListProps={{
                  'aria-labelledby': 'setting-button',
                }}
              >
                <div
                  css={css`
                    width: 100%;
                  `}
                >
                  <div className="userInfo">
                    <div>
                      <div css={align}>
                        <KarvIcon
                          css={css`
                            border-radius: 50%;
                            margin-right: 11px;
                          `}
                        />
                        {account.substr(0, 4)}
                        ...
                        {account.substr(account.length - 2, 2)}
                      </div>
                      <div>
                        <Tooltip
                          placement="top"
                          sx={{ color: '#009B72' }}
                          open={openTooltip}
                          title="Copied to clipboard!"
                        >
                          <CopyIcon onClick={useCopyAddress} />
                        </Tooltip>
                        <Tooltip placement="top" title="disconnect">
                          <DisconnectIcon1
                            onClick={async () => {
                              handleSettingClose()
                              await disconnect()
                            }}
                          />
                        </Tooltip>
                        <Tooltip placement="top" title="view on browser">
                          <Link
                            sx={{ marginLeft: '16px' }}
                            href={chainId ? CHAINS[chainId].blockExplorerUrls?.[0] : ''}
                          >
                            <OpenIcon onClick={handleSettingClose} />
                          </Link>
                        </Tooltip>
                      </div>
                    </div>
                    <div>
                      <p
                        css={css`
                          color: #757575;
                        `}
                      >
                        Total assets
                      </p>
                      <p
                        css={css`
                          color: #2832f5;
                        `}
                      >
                        {getBigNumberStr(ethBalance, 4)} ETH
                      </p>
                    </div>
                  </div>
                  <div
                    className="action"
                    onClick={async () => {
                      handleSettingClose()
                      await disconnect()
                    }}
                  >
                    <DisconnectIcon2 />
                    Disconnect
                  </div>
                </div>
              </Menu>
            </>
          ) : (
            <KRAVButton
              sx={{
                color: '#fff',
                background: '#000000',
                mx: '9px',
                borderRadius: '4px',
                textTransform: 'none',
                '&:hover': {
                  background: '#757575',
                },
              }}
              css={headerBtn}
              onClick={() => setWalletDialogVisibility(true)}
            >
              <Trans>Connect Wallet</Trans>
            </KRAVButton>
          )}
          {/*<div css={notifyBtn}>*/}
          {/*  <Notify />*/}
          {/*</div>*/}
        </div>
        <ConnectWalletDialog
          walletDialogVisibility={walletDialogVisibility}
          setWalletDialogVisibility={setWalletDialogVisibility}
        />
      </header>
      {chainId !== TEST_CHAIN_ID && account && (
        <div css={UnSupport}>
          Unsupported network! &nbsp;
          <span
            onClick={async () => {
              if (connection) {
                try {
                  await connection.connector.activate(chainId !== TEST_CHAIN_ID ? TEST_CHAIN_ID : undefined)
                  await connector.activate()
                } catch (e) {
                  try {
                    await connector.activate(getAddChainParameters(TEST_CHAIN_ID))
                  } catch (e) {}
                }
              }
            }}
          >
            Please change network.
          </span>
        </div>
      )}
    </>
  )
}
