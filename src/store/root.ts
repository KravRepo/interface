import { createWalletSlice, WalletSlice } from './walletSlice'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { create } from 'zustand'
import { createTransactionSlice, TransactionSlice } from './TransactionSlice'
import { createFactorySlice, FactorySlice } from './FactorySlice'
import { createTradeSlice, TradeSlice } from './TradeSlice'

export type RootStore = WalletSlice & TransactionSlice & FactorySlice & TradeSlice

export const useRootStore = create<RootStore>()(
  subscribeWithSelector(
    devtools((...args) => {
      return {
        ...createWalletSlice(...args),
        ...createTransactionSlice(...args),
        ...createFactorySlice(...args),
        ...createTradeSlice(...args),
      }
    })
  )
)
