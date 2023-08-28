import { Dialog } from '@mui/material'
import { SettingMenuContent, SettingMenuContentProps } from '../SettingMenuContent'

type SettingMenuProps = SettingMenuContentProps & {
  open: boolean
}
export const SettingMenu = ({
  open,
  toggleTheme,
  account,
  openTooltip,
  useCopyAddress,
  handleSettingClose,
  ethBalance,
  disconnect,
  chainId,
}: SettingMenuProps) => {
  return (
    <Dialog open={open} fullScreen>
      <SettingMenuContent
        toggleTheme={toggleTheme}
        account={account}
        openTooltip={openTooltip}
        useCopyAddress={useCopyAddress}
        disconnect={disconnect}
        handleSettingClose={handleSettingClose}
        ethBalance={ethBalance}
        chainId={chainId}
      />
    </Dialog>
  )
}
