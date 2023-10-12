/** @jsxImportSource @emotion/react */
import { align } from '../../globalStyle'
import { NetWorkButton } from './NetworkButton'
import KRAVButton from '../KravUIKit/KravButton'
import { headerBtn, setting } from './sytle'
import { css } from '@emotion/react'
import { ReactComponent as AccountIcon } from '../../assets/imgs/account_logo.svg'
import { Menu, useMediaQuery, useTheme } from '@mui/material'
import { SettingMenuContent } from './SettingMenuContent'
import { Trans } from '@lingui/macro'
import React, { useCallback, useMemo, useState } from 'react'
import { Connection } from '../../connectors/type'
import { Connector } from '@web3-react/types'
import { useRootStore } from '../../store/root'
import BigNumber from 'bignumber.js'

type WalletButtonProps = {
  account: string | undefined
  chainId: number | undefined
  ethBalance: BigNumber
  toggleTheme: () => void
  connection: Connection | undefined
  connector: Connector
}

export const WalletButton = ({
  account,
  connection,
  connector,
  chainId,
  ethBalance,
  toggleTheme,
}: WalletButtonProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [settingAnchorEl, setSettingAnchorEl] = useState<null | HTMLElement>(null)
  const [openTooltip, setOpenTooltip] = useState(false)
  const setDisconnectWallet = useRootStore((store) => store.setDisconnectWallet)
  const setWalletDialogVisibility = useRootStore((store) => store.setWalletDialogVisibility)
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
    console.log('copy address!')
    try {
      console.log('account', account)
      if (account) {
        await navigator.clipboard.writeText(account)
        console.log('readText', await navigator.clipboard.readText())
        console.log('read', await navigator.clipboard.read())
        setOpenTooltip(true)
        setTimeout(() => {
          setOpenTooltip(false)
          setSettingAnchorEl(null)
        }, 3000)
      }
    } catch (e) {
      console.log('clipboard error', e)
    }
  }, [account])

  const disconnect = useCallback(async () => {
    if (connection && connector) {
      await connector.resetState()
      await connection.connector.resetState()
      console.log('setDisconnect')
      setDisconnectWallet(true)
    }
  }, [connector])
  return (
    <div css={align}>
      <NetWorkButton />
      {account ? (
        <div css={align}>
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
                minWidth: isMobile ? 200 : 440,
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
            <SettingMenuContent
              account={account}
              chainId={chainId}
              disconnect={disconnect}
              ethBalance={ethBalance}
              handleSettingClose={handleSettingClose}
              openTooltip={openTooltip}
              toggleTheme={toggleTheme}
              useCopyAddress={useCopyAddress}
            />
          </Menu>
        </div>
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
  )
}
