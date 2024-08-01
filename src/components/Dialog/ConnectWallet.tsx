/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent, styled, useTheme } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import MetamaskIcon from '../../assets/imgs/wallet/metamask.svg'
import WalletConnectIcon from '../../assets/imgs/wallet/walletconnect.png'
import { dialogContent } from './sytle'
import { useWeb3React } from '@web3-react/core'
import { getAddChainParameters } from '../../connectors/chain'
import { useUpdateError } from '../../hook/hookV8/useUpdateError'
import { TransactionAction } from '../../store/TransactionSlice'
import { DEFAULT_CHAIN } from '../../constant/chain'
import { css } from '@emotion/react'
import useConnectors from '../../hook/web3/useConnectors'
import { Connector } from '@web3-react/types'
import { WalletConnectQR } from '../../hook/web3/WalletConnect'

const QRCodeWrapper = styled('div')`
  height: 110px;
  width: 110px;
  path {
    fill: ${'#00000000'};
  }
`

export type ConnectWalletDialogProp = {
  walletDialogVisibility: boolean
  setWalletDialogVisibility: (walletDialogVisibility: boolean) => void
}

export const ConnectWalletDialog = ({ walletDialogVisibility, setWalletDialogVisibility }: ConnectWalletDialogProp) => {
  const theme = useTheme()
  const { connector } = useWeb3React()
  const updateError = useUpdateError()

  const connectors = useConnectors()
  const onActivate = useCallback(async (connector: Connector) => {
    try {
      await connector.activate()
    } catch (error) {}
  }, [])

  console.log(999, connector)

  const activeConnection = useCallback(
    async (walletName?: string) => {
      console.log(9991, connector)
      try {
        try {
          const a = await connector.activate()

          console.log(9992, a, connector)
        } catch (e: any) {
          if (e.code === 4001) return
          try {
            await connector.activate(getAddChainParameters(DEFAULT_CHAIN))
            console.log(9993, connector)
          } catch (e) {
            updateError(TransactionAction.WALLET)
          }
        }
      } catch (e) {
        console.error('connect wallet error', e)
      }
    },
    [connector, updateError]
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
            <div
              css={css`
                border: ${theme.splitLine.primary};
              `}
              onClick={async () => {
                await activeConnection('wallet-connect')
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
              <img src={WalletConnectIcon} height="25" width="25" alt="" style={{ marginRight: '10px' }} />
              {/* <w3m-button label="WalletConnect" /> */}
            </div>
            <WalletConnectButton
              walletName="WalletConnect"
              logoSrc={WalletConnectIcon}
              walletConnectQR={connectors?.walletConnectQR}
              onClick={() => {
                if (connectors?.walletConnect) {
                  onActivate(connectors?.walletConnect)
                }
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function WalletConnectButton({
  walletName,
  logoSrc,
  walletConnectQR: walletConnect,
  onClick,
}: any & { walletConnectQR: WalletConnectQR }) {
  const [svg, setSvg] = useState(walletConnect.svg)

  useEffect(() => {
    if (!svg) walletConnect.activate()

    walletConnect.events.on(WalletConnectQR.SVG_AVAILABLE, setSvg)
    return () => {
      walletConnect.events.off(WalletConnectQR.SVG_AVAILABLE, setSvg)
    }
  }, [svg, walletConnect])
  console.log({ svg })

  return (
    <button onClick={onClick}>
      {/* <ButtonContents
        logoSrc={logoSrc}
        walletName={walletName}
        caption={'Scan to connect your wallet. Works with most wallets.'}
      /> */}
      <img src={logoSrc} alt={walletName} width={26} />
      <p>{walletName}</p>
      <p>Scan to connect your wallet. Works with most wallets.</p>
      {svg && <QRCodeWrapper dangerouslySetInnerHTML={{ __html: svg }} />}
    </button>
  )
}
