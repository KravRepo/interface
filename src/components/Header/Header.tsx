/** @jsxImportSource @emotion/react */
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { Trans } from '@lingui/macro'
import { header, router, UnSupport } from './sytle'
import { align } from '../../globalStyle'
import { ReactComponent as KravDarkLogo } from '../../assets/imgs/darkModel/krav_logo_dark.svg'
import { ReactComponent as KravLogo } from '../../assets/imgs/krav_logo.svg'
import { css } from '@emotion/react'
import { ConnectWalletDialog } from '../../components/Dialog/ConnectWallet'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useRootStore } from '../../store/root'
import { NavLink, useLocation } from 'react-router-dom'
import { getConnection } from '../../connectors'
import { ConnectionType } from '../../connectors/type'
import { useFactory } from '../../hook/hookV8/useFactory'
import { useUserPosition } from '../../hook/hookV8/useUserPosition'
import { getAddChainParameters } from '../../connectors/chain'
import { TEST_CHAIN_ID } from '../../constant/chain'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'
import { useSetThemeContext } from '../../theme/appTheme'
import DehazeIcon from '@mui/icons-material/Dehaze'
import { NavMenu } from './mobile/NavMenu'
import { WalletButton } from './WalletButton'

export const Header = () => {
  const setWalletDialogVisibility = useRootStore((store) => store.setWalletDialogVisibility)
  const walletDialogVisibility = useRootStore((store) => store.walletDialogVisibility)
  const { account, chainId, connector, provider } = useWeb3React()
  const [dataInterval, setDataInterval] = useState<null | NodeJS.Timer>(null)
  const [ethBalance, setEthBalance] = useState(new BigNumber(0))
  const [openMobileNav, setOpenMobileNav] = useState(false)

  const setAccount = useRootStore((store) => store.setAccount)
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const setLoadingData = useRootStore((store) => store.setLoadingData)
  const disconnectWallet = useRootStore((store) => store.disconnectWallet)
  const setDisconnectWallet = useRootStore((store) => store.setDisconnectWallet)
  const { pathname } = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
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
      <NavMenu isOpen={openMobileNav} setIsOpen={() => setOpenMobileNav(false)} />
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
                margin-right: ${isMobile ? '0' : '73px'};
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
          {!isMobile && (
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
          )}
        </div>
        <div css={align}>
          <WalletButton
            chainId={chainId}
            connector={connector}
            connection={connection}
            ethBalance={ethBalance}
            toggleTheme={toggleTheme}
            account={account}
          />
          {isMobile && <DehazeIcon onClick={() => setOpenMobileNav(true)} height="24" width="24" />}
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
