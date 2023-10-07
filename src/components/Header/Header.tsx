/** @jsxImportSource @emotion/react */
import { Box, Button, Link, Menu, MenuItem, Switch, Tooltip, useTheme } from '@mui/material'
import { Trans } from '@lingui/macro'
import { header, headerBtn, router, setting, UnSupport } from './sytle'
import { align } from '../../globalStyle'
import { ReactComponent as Base } from '../../assets/imgs/chain_base.svg'
import { ReactComponent as EthIcon } from '../../assets/imgs/tokens/Ehter.svg'
import { ReactComponent as AccountIcon } from '../../assets/imgs/account_logo.svg'
import { ReactComponent as KarvIcon } from '../../assets/imgs/tokens/KRAV.svg'
import { ReactComponent as CopyIcon } from '../../assets/imgs/copy_icon.svg'
import { ReactComponent as OpenIcon } from '../../assets/imgs/open_browser.svg'
import { ReactComponent as CopyDarkIcon } from '../../assets/imgs/darkModel/copy_icon_dark.svg'
import { ReactComponent as OpenDarkIcon } from '../../assets/imgs/darkModel/open_browser_dark.svg'
import { ReactComponent as DisconnectIconDark1 } from '../../assets/imgs/darkModel/disconnect_icon_1_dark.svg'
import { ReactComponent as DisconnectIcon1 } from '../../assets/imgs/disconnect_icon_1.svg'
import { ReactComponent as DisconnectIcon2 } from '../../assets/imgs/disconnect_icon_2.svg'
import { ReactComponent as DisconnectDarkIcon2 } from '../../assets/imgs/darkModel/disconnect_icon_2_dark.svg'
import { ReactComponent as ThemeIconLight } from '../../assets/imgs/model_icon.svg'
import { ReactComponent as ThemeIconDark } from '../../assets/imgs/darkModel/model_icon_dark.svg'
import { ReactComponent as KravDarkLogo } from '../../assets/imgs/darkModel/krav_logo_dark.svg'
import SwitchDarkIcon from '../../assets/imgs/darkModel/theme_Switch_dark_icon.svg'
import SwitchIcon from '../../assets/imgs/theme_icon_light.svg'
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
import { styled } from '@mui/material/styles'
import { useSetThemeContext } from '../../theme/appTheme'

const ModeSwitch = styled(Switch)(({ theme }) => ({
  width: 50,
  height: 28,
  padding: 0,
  borderRadius: '18px',
  '& .MuiSwitch-switchBase': {
    margin: '2px 0 0 0',
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url(${theme.palette.mode === 'dark' ? SwitchDarkIcon : SwitchIcon})`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#0F1114' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#ffffff',
    width: 24,
    height: 24,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#0F1114' : '#aab4be',
    borderRadius: 20 / 2,
  },
}))

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
  const theme = useTheme()
  const getUserPosition = useUserPosition()
  const getFactory = useFactory()
  const toggleTheme = useSetThemeContext()
  const connection = useMemo(() => {
    return getConnection(ConnectionType.INJECTED)
  }, [chainId])

  const routerActive = useMemo(() => {
    return css`
      background: ${theme.palette.mode === 'dark' ? '#4b4b4b' : 'black'};
      color: white;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    `
  }, [theme])

  const routerColor = useMemo(() => {
    return css`
      color: ${theme.text.primary};
      :hover {
        color: rgb(117, 117, 117);
      },
    `
  }, [theme])

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
            background: ${isHomePath ? theme.background.fourth : ''};
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
            <NavLink style={{ height: '22px' }} to={'/trade'}>
              {theme.palette.mode === 'dark' ? (
                <KravDarkLogo height="22" width="91" />
              ) : (
                <KravLogo height="22" width="91" />
              )}
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
            <NavLink to={'/trade'} css={[router, routerColor, isTradePath ? routerActive : '']}>
              <Trans>Trade</Trans>
            </NavLink>
            <NavLink to={'/liquidity'} css={[router, routerColor, pathname === '/liquidity' ? routerActive : '']}>
              <Trans>Liquidity</Trans>
            </NavLink>
            <NavLink to={'/portfolio'} css={[router, routerColor, isHomePath ? routerActive : '']}>
              <Trans>Portfolio</Trans>
            </NavLink>
            <NavLink to={'/statistics'} css={[router, routerColor, pathname === '/statistics' ? routerActive : '']}>
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
            {/*<MenuItem sx={{ width: '100%' }} onClick={handleNetWorkClose}>*/}
            {/*  <div*/}
            {/*    css={css`*/}
            {/*      width: 100%;*/}
            {/*      display: flex;*/}
            {/*      align-items: center;*/}
            {/*      justify-content: space-between;*/}
            {/*    `}*/}
            {/*  >*/}
            {/*    <div css={align}>*/}
            {/*      <EthIcon height="24" width="24" style={{ marginRight: '12px', borderRadius: '50%' }} />*/}
            {/*      <span*/}
            {/*        css={css`*/}
            {/*          color: ${theme.text.primary};*/}
            {/*        `}*/}
            {/*      >*/}
            {/*        Ethereum*/}
            {/*      </span>*/}
            {/*    </div>*/}
            {/*    <DoneOutlinedIcon sx={{ color: theme.palette.mode === 'dark' ? '#dedede' : '' }} />*/}
            {/*  </div>*/}
            {/*</MenuItem>*/}
            <MenuItem sx={{ width: '100%' }} onClick={handleNetWorkClose}>
              <div
                css={css`
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                `}
              >
                <div css={align}>
                  <Base height="24" width="24" style={{ marginRight: '12px', borderRadius: '50%' }} />
                  <span
                    css={css`
                      color: ${theme.text.primary};
                    `}
                  >
                    Base
                  </span>
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
          {account ? (
            <>
              <KRAVButton
                sx={{
                  width: 'auto',
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
                  '& .MuiMenu-list': {
                    padding: 0,
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
                    color: ${theme.text.primary};
                    background: ${theme.background.primary};
                  `}
                >
                  <div
                    className="userInfo"
                    css={css`
                      border-bottom: ${theme.splitLine.primary};
                    `}
                  >
                    <div>
                      <div css={align}>
                        <KarvIcon
                          css={css`
                            border-radius: 50%;
                            background: white;
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
                          {theme.palette.mode === 'dark' ? (
                            <CopyDarkIcon onClick={useCopyAddress} />
                          ) : (
                            <CopyIcon onClick={useCopyAddress} />
                          )}
                        </Tooltip>
                        <Tooltip placement="top" title="disconnect">
                          {theme.palette.mode === 'dark' ? (
                            <DisconnectIconDark1
                              onClick={async () => {
                                handleSettingClose()
                                await disconnect()
                              }}
                            />
                          ) : (
                            <DisconnectIcon1
                              onClick={async () => {
                                handleSettingClose()
                                await disconnect()
                              }}
                            />
                          )}
                        </Tooltip>
                        <Tooltip placement="top" title="view on browser">
                          <Link
                            sx={{ marginLeft: '16px' }}
                            href={chainId ? CHAINS[chainId].blockExplorerUrls?.[0] : ''}
                          >
                            {theme.palette.mode === 'dark' ? (
                              <OpenDarkIcon onClick={handleSettingClose} />
                            ) : (
                              <OpenIcon onClick={handleSettingClose} />
                            )}
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
                    css={css`
                      border-bottom: ${theme.splitLine.primary};
                    `}
                    onClick={async () => {
                      handleSettingClose()
                      await disconnect()
                    }}
                  >
                    {theme.palette.mode === 'dark' ? <DisconnectDarkIcon2 /> : <DisconnectIcon2 />}
                    Disconnect
                  </div>
                  <div
                    className="action"
                    css={css`
                      justify-content: space-between;
                    `}
                  >
                    <div css={align}>
                      {theme.palette.mode === 'light' ? <ThemeIconLight /> : <ThemeIconDark />}
                      <span
                        css={css`
                          margin-left: 12px;
                        `}
                      >
                        {theme.palette.mode === 'light' ? 'Light Mode' : 'Dark Mode'}
                      </span>
                    </div>
                    <ModeSwitch checked={true} onClick={toggleTheme} />
                  </div>
                </div>
              </Menu>
            </>
          ) : (
            <KRAVButton
              sx={{
                mx: '9px',
                borderRadius: '4px',
                textTransform: 'none',
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
