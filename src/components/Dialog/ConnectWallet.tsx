/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent, useTheme } from '@mui/material'
import { useCallback } from 'react'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import MetamaskIcon from '../../assets/imgs/wallet/metamask.svg'
import { dialogContent } from './sytle'
import { useWeb3React } from '@web3-react/core'
import { getAddChainParameters } from '../../connectors/chain'
import { useUpdateError } from '../../hook/hookV8/useUpdateError'
import { TransactionAction } from '../../store/TransactionSlice'
import { DEFAULT_CHAIN } from '../../constant/chain'
import { css } from '@emotion/react'

export type ConnectWalletDialogProp = {
  walletDialogVisibility: boolean
  setWalletDialogVisibility: (walletDialogVisibility: boolean) => void
}

export const ConnectWalletDialog = ({ walletDialogVisibility, setWalletDialogVisibility }: ConnectWalletDialogProp) => {
  const theme = useTheme()
  const { account, connector } = useWeb3React()
  const updateError = useUpdateError()

  const activeConnection = useCallback(
    async (walletName?: string) => {
      try {
        try {
          await connector.activate()
        } catch (e: any) {
          if (e.code === 4001) return
          try {
            await connector.activate(getAddChainParameters(DEFAULT_CHAIN))
          } catch (e) {
            updateError(TransactionAction.WALLET)
          }
        }
      } catch (e) {
        console.error('connect wallet error', e)
      }
    },
    [account]
  )

  return (
    <Dialog
      sx={{
        '.MuiDialog-paper': {
          width: '440px',
          borderRadius: '8px',
          background: theme.background.primary,
          // backgroundColor: theme.palette.mode === 'dark' ? '#1B1E24' : '',
        },
      }}
      open={walletDialogVisibility}
    >
      <DialogContent sx={{ padding: 0, color: theme.text.primary }}>
        <div css={dialogContent}>
          <div className="dialog-header">
            <span>Connect Wallet</span>
            <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => setWalletDialogVisibility(false)} />
          </div>
          <div className="wallet-dialog">
            <div
              css={css`
                border: ${theme.splitLine.primary};
              `}
              onClick={async () => {
                await activeConnection('metamask')
                setWalletDialogVisibility(false)
                // await initUserToken()
                // setInterval(async () => {
                //   await Promise.all([
                //     getBalance(),
                //     getUserOpenTrade(tradePool.storageT, true),
                //     getUserOpenLimitOrders(tradePool.storageT, true),
                //     getUserPositionData(),
                //   ])
                // }, 90000)
              }}
            >
              <img src={MetamaskIcon} height="25" width="25" alt="" />
              <span>MetaMask</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
