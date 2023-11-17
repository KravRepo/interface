import { StateCreator } from 'zustand'
import { RootStore } from './root'
import BigNumber from 'bignumber.js'
import { UseAllLimitOrders } from '../hook/hookV8/useGetUserAllLimitOrders'
import { UseAllOpenTrades } from '../hook/hookV8/useGetUserAllOpenTrades'
import { Tuple, TupleLimitOrder } from '../components/Trades/type'

export enum ApprovalMethod {
  APPROVE = 'Transaction',
  PERMIT = 'Signed message',
}

export interface WalletSlice {
  account: string
  DAIBalance: BigNumber
  setAccount: (account: string | undefined) => void
  setDAIBalance: (DAIBalance: BigNumber) => void
  BTCPrice: BigNumber
  setBTCPrice: (DAIBalance: BigNumber) => void
  isBTCRise: boolean
  setIsBTCRise: (isBTCRise: boolean) => void
  userOpenTradeList: Tuple[] | []
  setUserOpenTradeList: (userOpenTradeList: Tuple[]) => void
  userAllOpenTradeList: UseAllOpenTrades[] | []
  setUserAllOpenTradeList: (userAllOpenTradeList: UseAllOpenTrades[] | []) => void
  userOpenLimitList: TupleLimitOrder[] | []
  setUserOpenLimitList: (userOpenLimitList: TupleLimitOrder[]) => void
  userAllOpenLimitList: UseAllLimitOrders[] | []
  setUserAllOpenLimitList: (userAllOpenLimitList: UseAllLimitOrders[] | []) => void
  loadingData: boolean
  setLoadingData: (loadingData: boolean) => void
  walletDialogVisibility: boolean
  setWalletDialogVisibility: (walletDialogVisibility: boolean) => void
  disconnectWallet: boolean
  setDisconnectWallet: (disconnectWallet: boolean) => void
  userPoolLength: number
  setUserPoolLength: (userPoolLength: number) => void
}

// const getWalletPreferences = () => {
//   const walletPreference = localStorage.getItem('walletApprovalPreferences');
//   if (walletPreference) {
//     return JSON.parse(walletPreference);
//   } else {
//     return {};
//   }
// };

export const createWalletSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  WalletSlice
> = (set) => ({
  account: '',
  DAIBalance: new BigNumber(0),
  BTCPrice: new BigNumber(0),
  isBTCRise: false,
  userOpenTradeList: [],
  userOpenLimitList: [],
  loadingData: true,
  walletDialogVisibility: false,
  disconnectWallet: false,
  userAllOpenTradeList: [],
  userPoolLength: 0,
  userAllOpenLimitList: [],
  setAccount(account) {
    set({ account: account || '' })
  },
  setDAIBalance(DAIBalance) {
    set({ DAIBalance: DAIBalance })
  },
  setBTCPrice(BTCPrice) {
    set({ BTCPrice: BTCPrice })
  },
  setIsBTCRise(isBTCRise) {
    set({ isBTCRise: isBTCRise })
  },
  setUserOpenTradeList(userOpenTradeList) {
    set({ userOpenTradeList: userOpenTradeList })
  },
  setUserOpenLimitList(userOpenLimitList) {
    set({ userOpenLimitList: userOpenLimitList })
  },
  setLoadingData(loadingData) {
    set({ loadingData: loadingData })
  },
  setWalletDialogVisibility(walletDialogVisibility) {
    set({ walletDialogVisibility: walletDialogVisibility })
  },
  setDisconnectWallet(disconnectWallet) {
    set({ disconnectWallet: disconnectWallet })
  },
  setUserAllOpenTradeList(userAllOpenTradeList) {
    set({ userAllOpenTradeList: userAllOpenTradeList })
  },
  setUserPoolLength(userPoolLength) {
    set({ userPoolLength: userPoolLength })
  },
  setUserAllOpenLimitList(userAllOpenLimitList) {
    set({ userAllOpenLimitList: userAllOpenLimitList })
  },
})
