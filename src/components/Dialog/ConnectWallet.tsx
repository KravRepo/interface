/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent } from '@mui/material'
import { useCallback } from 'react'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import MetamaskIcon from '../../assets/imgs/wallet/metamask.svg'
import { dialogContent } from './sytle'
import { getConnection } from '../../connectors'
import { ConnectionType } from '../../connectors/type'
import { useWeb3React } from '@web3-react/core'
import { useRootStore } from 'store/root'
import useEvent from 'hook/hookV8/useEvent'
import { useGetUserAllBalance } from '../../hook/hookV8/useGetBalance'
import { useGetUserOpenTrade } from 'hook/hookV8/useGetUserOpenTrade'
import { useGetUserOpenLimitOrders } from '../../hook/hookV8/useGetUserOpenLimitOrders'
import { useUserPosition } from '../../hook/hookV8/useUserPosition'
import { useFactory } from '../../hook/hookV8/useFactory'
import { getAddChainParameters } from '../../connectors/chain'
import { useUpdateError } from '../../hook/hookV8/useUpdateError'
import { TransactionAction } from '../../store/TransactionSlice'
import { TEST_CHAIN_ID } from '../../constant/chain'
// import { ReactComponent as CoinbaseWalletIcon } from 'assets/imgs/wallet/wallet_coinbase.svg'
// import { ReactComponent as WalletConnectIcon } from 'assets/imgs/wallet/wallet-connect.svg'

export type ConnectWalletDialogProp = {
  walletDialogVisibility: boolean
  setWalletDialogVisibility: (walletDialogVisibility: boolean) => void
}

export const ConnectWalletDialog = ({ walletDialogVisibility, setWalletDialogVisibility }: ConnectWalletDialogProp) => {
  const { connector, account, chainId, provider } = useWeb3React()
  const getBalance = useGetUserAllBalance()
  const tradePool = useRootStore((store) => store.tradePool)
  const setLoadingData = useRootStore((store) => store.setLoadingData)
  const getUserOpenTrade = useGetUserOpenTrade(tradePool.storageT)
  const getUserOpenLimitOrders = useGetUserOpenLimitOrders(tradePool.storageT)
  const getUserPositionData = useUserPosition()
  const getFactory = useFactory()
  const updateError = useUpdateError()

  const initUserToken = useEvent(async () => {
    if (account && provider) {
      await Promise.all([getFactory(), getBalance(), getUserOpenTrade(), getUserOpenLimitOrders()])
      setLoadingData(false)
    }
  })

  const activeConnection = useCallback(
    async (walletName: string) => {
      const connection = getConnection(ConnectionType.INJECTED)!
      try {
        if (walletName === 'metamask') {
          try {
            await connection.connector.activate(chainId !== TEST_CHAIN_ID ? TEST_CHAIN_ID : undefined)
            await connector.activate(chainId !== TEST_CHAIN_ID ? TEST_CHAIN_ID : undefined)
          } catch (e) {
            try {
              await connection.connector.activate(getAddChainParameters(TEST_CHAIN_ID))
            } catch (e) {
              updateError(TransactionAction.WALLET)
            }
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
          background: '#fff',
          // backgroundColor: theme.palette.mode === 'dark' ? '#1B1E24' : '',
        },
      }}
      open={walletDialogVisibility}
    >
      <DialogContent sx={{ padding: 0, color: '#000' }}>
        <div css={dialogContent}>
          <div className="dialog-header">
            <span>Connect Wallet</span>
            <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => setWalletDialogVisibility(false)} />
          </div>
          <div className="wallet-dialog">
            <div
              onClick={async () => {
                await activeConnection('metamask')
                setWalletDialogVisibility(false)
                await initUserToken()
                setInterval(async () => {
                  await Promise.all([getBalance(), getUserOpenTrade(), getUserOpenLimitOrders(), getUserPositionData()])
                }, 90000)
              }}
            >
              <img src={MetamaskIcon} height="25" width="25" alt="" />
              <span>MetaMask</span>
            </div>
            {/*<div onClick={()=> {*/}

            {/*}}>*/}
            {/*  <CoinbaseWalletIcon height="25" width="25" />*/}
            {/*  <span>Coinbase Wallet</span>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*  <WalletConnectIcon height="25" width="25" />*/}
            {/*  <span>Wallet Connect</span>*/}
            {/*</div>*/}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
