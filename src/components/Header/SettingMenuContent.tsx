/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { align } from '../../globalStyle'
import { ReactComponent as KarvIcon } from '../../assets/imgs/tokens/KRAV.svg'
import { Link, Tooltip, useTheme } from '@mui/material'
import { ReactComponent as CopyDarkIcon } from '../../assets/imgs/darkModel/copy_icon_dark.svg'
import { ReactComponent as CopyIcon } from '../../assets/imgs/copy_icon.svg'
import { ReactComponent as DisconnectIconDark1 } from '../../assets/imgs/darkModel/disconnect_icon_1_dark.svg'
import { ReactComponent as DisconnectIcon1 } from '../../assets/imgs/disconnect_icon_1.svg'
import { CHAINS } from '../../connectors/chain'
import { ReactComponent as OpenDarkIcon } from '../../assets/imgs/darkModel/open_browser_dark.svg'
import { ReactComponent as OpenIcon } from '../../assets/imgs/open_browser.svg'
import { getBigNumberStr } from '../../utils'
import { ReactComponent as DisconnectDarkIcon2 } from '../../assets/imgs/darkModel/disconnect_icon_2_dark.svg'
import { ReactComponent as DisconnectIcon2 } from '../../assets/imgs/disconnect_icon_2.svg'
import { ReactComponent as ThemeIconLight } from '../../assets/imgs/model_icon.svg'
import { ReactComponent as ThemeIconDark } from '../../assets/imgs/darkModel/model_icon_dark.svg'
import { KravModeSwitch } from '../KravUIKit/KravModeSwitch'
import BigNumber from 'bignumber.js'
import { CONTRACT_CONFIG } from '../../constant/chain'

export type SettingMenuContentProps = {
  toggleTheme: () => void
  account: string
  openTooltip: boolean
  useCopyAddress: () => Promise<void>
  disconnect: () => Promise<void>
  handleSettingClose: () => void
  ethBalance: BigNumber
  chainId: number | undefined
}

export const SettingMenuContent = ({
  toggleTheme,
  account,
  openTooltip,
  useCopyAddress,
  disconnect,
  ethBalance,
  handleSettingClose,
  chainId,
}: SettingMenuContentProps) => {
  const theme = useTheme()
  return (
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
            <Tooltip placement="top" sx={{ color: '#009B72' }} open={openTooltip} title="Copied to clipboard!">
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
              <Link sx={{ marginLeft: '16px' }} href={chainId ? CHAINS[chainId].blockExplorerUrls?.[0] : ''}>
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
            {getBigNumberStr(ethBalance, 4)} {chainId ? CONTRACT_CONFIG[chainId]?.nativeToken : ''}
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
        <KravModeSwitch checked={true} onClick={toggleTheme} />
      </div>
    </div>
  )
}
