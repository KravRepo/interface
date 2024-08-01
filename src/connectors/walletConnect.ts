import { initializeConnector } from '@web3-react/core'
import { WalletConnect } from '@web3-react/walletconnect-v2'
import { URLS } from '../constant/constantV8/chain'

export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect({
      actions,
      options: {
        rpc: URLS,
        chains: [8453],
        projectId: 'ceb65bbcfecec61b5932c3256bf1665a',
        showQrModal: true,
      },

      defaultChainId: 8453,
      onError: () => {
        console.error('wallet connect')
      },
    })
)
