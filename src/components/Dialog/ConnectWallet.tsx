/** @jsxImportSource @emotion/react */
import { CircularProgress, Dialog, DialogContent, useTheme } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import MetamaskIcon from '../../assets/imgs/wallet/metamask.svg'
import WalletConnectIcon from '../../assets/imgs/wallet/walletconnect.png'
import { dialogContent } from './sytle'
// import { getAddChainParameters } from '../../connectors/chain'
// import { useUpdateError } from '../../hook/hookV8/useUpdateError'
// import { TransactionAction } from '../../store/TransactionSlice'
// import { DEFAULT_CHAIN } from '../../constant/chain'
import { css } from '@emotion/react'
import useConnectors from '../../hook/web3/useConnectors'
import { Connector } from '@web3-react/types'
import { WalletConnectQR } from '../../hook/web3/WalletConnect'

// const QRCodeWrapper = styled('div')`
//   height: 110px;
//   width: 110px;
//   margin: 20px;
//   path {
//     fill: ${'#ffffff'};
//   }
// `

export type ConnectWalletDialogProp = {
  walletDialogVisibility: boolean
  setWalletDialogVisibility: (walletDialogVisibility: boolean) => void
}

export const ConnectWalletDialog = ({ walletDialogVisibility, setWalletDialogVisibility }: ConnectWalletDialogProp) => {
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  // const updateError = useUpdateError()

  const connectors = useConnectors()
  const onActivate = useCallback(async (connector: Connector) => {
    try {
      await connector.activate()
    } catch (error) {}
  }, [])

  // const activeConnection = useCallback(
  //   async (walletName?: string) => {
  //     try {
  //       try {
  //         await connector.activate()
  //       } catch (e: any) {
  //         if (e.code === 4001) return
  //         try {
  //           await connector.activate(getAddChainParameters(DEFAULT_CHAIN))
  //         } catch (e) {
  //           updateError(TransactionAction.WALLET)
  //         }
  //       }
  //     } catch (e) {
  //       console.error('connect wallet error', e)
  //     }
  //   },
  //   [connector, updateError]
  // )

  return (
    <Dialog
      sx={{
        '.MuiDialog-paper': {
          width: '440px',
          borderRadius: '8px',
          background: theme.background.second,
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
              onClick={() => {
                if (connectors?.metaMask) {
                  onActivate(connectors?.metaMask)
                  setWalletDialogVisibility(false)
                }
              }}
            >
              <img src={MetamaskIcon} height="25" width="25" alt="" />
              <span>MetaMask</span>
            </div>
            {/* <div
              css={css`
                border: ${theme.splitLine.primary};
              `}
              onClick={async () => {
                await activeConnection('wallet-connect')
                setWalletDialogVisibility(false)
              }}
            >
              <img src={WalletConnectIcon} height="25" width="25" alt="" style={{ marginRight: '10px' }} />
            </div> */}
            <WalletConnectButton
              walletName="WalletConnect"
              logoSrc={WalletConnectIcon}
              walletConnectQR={connectors?.walletConnectQR}
              loading={loading}
              onClick={async () => {
                if (connectors?.walletConnect) {
                  setLoading(true)
                  await onActivate(connectors?.walletConnect)
                  setLoading(false)
                  setWalletDialogVisibility(false)
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
  loading,
}: any & { walletConnectQR: WalletConnectQR }) {
  const [svg, setSvg] = useState(walletConnect.svg)
  const theme = useTheme()

  useEffect(() => {
    if (!svg) walletConnect.activate()

    walletConnect.events.on(WalletConnectQR.SVG_AVAILABLE, setSvg)
    return () => {
      walletConnect.events.off(WalletConnectQR.SVG_AVAILABLE, setSvg)
    }
  }, [svg, walletConnect])

  return (
    <>
      <div
        css={css`
          border: ${theme.splitLine.primary};
        `}
        onClick={onClick}
      >
        <div>
          <div
            css={css`
              display: flex;
              gap: 16px;
              align-items: center;
            `}
          >
            <img
              src={logoSrc}
              alt={walletName}
              width={26}
              css={css`
                flex-shrink: 0;
                height: 26px;
              `}
            />
            <p>{walletName}</p>
            {loading && <CircularProgress color="primary" size="26px" />}
          </div>
        </div>
      </div>
      {/* {svg && (
        <div>
          <p
            css={css`
              font-size: 12px;
            `}
          >
            Scan to connect your wallet. Works with most wallets.
          </p>
          <QRCodeWrapper dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
      )} */}
    </>
  )
}
