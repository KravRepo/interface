/** @jsxImportSource @emotion/react */
import { Button, Link } from '@mui/material'
import { Trans } from '@lingui/macro'
import { header, headerBtn, notifyBtn, router, routerActive } from './sytle'
import { align } from 'globalStyle'
import { ReactComponent as Binance } from 'assets/imgs/tokens/asset_BNB.svg'
import { ReactComponent as Notify } from 'assets/imgs/notify.svg'
import { ReactComponent as KravLogo } from 'assets/imgs/krav_logo.svg'
import { css } from '@emotion/react'
import { ConnectWalletDialog } from 'components/Dialog/ConnectWallet'
import { useEffect, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useRootStore } from '../../store/root'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import { NavLink, useLocation } from 'react-router-dom'
import { FaucetDialog } from 'components/Dialog/FaucetDialog'
import { getConnection } from '../../connectors'
import { ConnectionType } from '../../connectors/type'
import { useFactory } from '../../hook/hookV8/useFactory'
import { useUserPosition } from '../../hook/hookV8/useUserPosition'

export const Header = () => {
  const setWalletDialogVisibility = useRootStore((store) => store.setWalletDialogVisibility)
  const walletDialogVisibility = useRootStore((store) => store.walletDialogVisibility)
  const [openFaucet, setOpenFaucet] = useState(false)
  const { account, chainId, connector } = useWeb3React()
  const [dataInterval, setDataInterval] = useState<null | NodeJS.Timer>(null)

  // const match = useMatch("/messages");
  const setAccount = useRootStore((store) => store.setAccount)
  const DAIBalance = useRootStore((store) => store.DAIBalance)
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const setLoadingData = useRootStore((store) => store.setLoadingData)
  const { pathname } = useLocation()

  const getUserPosition = useUserPosition()
  const getFactory = useFactory()
  const connection = useMemo(() => {
    return getConnection(ConnectionType.INJECTED)
  }, [])

  const isHomePath = useMemo(() => {
    const pathList = ['/', '/dashboard/stake', '/dashboard/farm', '/dashboard/referral']
    return pathList.includes(pathname)
  }, [pathname])

  const isTradePath = useMemo(() => {
    return pathname.includes('/trade')
  }, [pathname])

  useEffect(() => {
    setTimeout(async () => {
      if (connection) {
        try {
          await connection.connector.activate(chainId !== 97 ? 97 : undefined)
          await connector.activate()
          await getFactory()
          setLoadingData(false)
          setAccount(account)
        } catch (e) {}
      }
    }, 200)
  }, [connection, account])

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

  return (
    <>
      <FaucetDialog isOpen={openFaucet} setIsOpen={setOpenFaucet} />
      <header css={header}>
        <div css={align}>
          <div
            css={[
              align,
              css`
                margin-right: 73px;
              `,
            ]}
          >
            <KravLogo height="22" width="91" />
          </div>
          <div>
            <NavLink to={'/'} css={[router, isHomePath ? routerActive : '']}>
              <Trans>DashBoard</Trans>
            </NavLink>
            <NavLink to={'/trade'} css={[router, isTradePath ? routerActive : '']}>
              <Trans>Trade</Trans>
            </NavLink>
            <NavLink to={'/liquidity'} css={[router, pathname === '/liquidity' ? routerActive : '']}>
              <Trans>Liquidity</Trans>
            </NavLink>
            <Link underline={'none'} css={router}>
              <Trans>Statistics</Trans>
            </Link>
          </div>
        </div>
        <div css={align}>
          {account && !DAIBalance.isGreaterThan(0) && (
            <div
              onClick={() => setOpenFaucet(true)}
              css={css`
                border-radius: 4px;
                border: 1px solid #dadada;
                margin-right: 9px;
                height: 40px;
                display: flex;
                align-items: center;
                padding: 0 16px 0 14px;
                cursor: pointer;
              `}
            >
              <WaterDropIcon />
              <span>Faucet</span>
            </div>
          )}

          <Button
            css={headerBtn}
            sx={{
              color: '#000',
              borderRadius: '4px',
              border: '1px solid #DADADA',
              textTransform: 'none',
            }}
          >
            <Binance height="14" width="14" style={{ marginRight: 5 }} />
            <Trans>BNB chain testnet</Trans>
          </Button>
          {account ? (
            <Button
              sx={{ color: '#fff', background: '#000000', mx: '9px', borderRadius: '4px', textTransform: 'none' }}
              css={headerBtn}
            >
              {account.substr(0, 4)}
              ...
              {account.substr(account.length - 2, 2)}
            </Button>
          ) : (
            <Button
              sx={{
                color: '#fff',
                background: '#000000',
                mx: '9px',
                borderRadius: '4px',
                textTransform: 'none',
                '&:hover': {
                  background: '#000000',
                },
              }}
              css={headerBtn}
              onClick={() => setWalletDialogVisibility(true)}
            >
              <Trans>Connect Wallet</Trans>
            </Button>
          )}

          <div css={notifyBtn}>
            <Notify />
          </div>
        </div>
        <ConnectWalletDialog
          walletDialogVisibility={walletDialogVisibility}
          setWalletDialogVisibility={setWalletDialogVisibility}
        />
      </header>
    </>
  )
}
