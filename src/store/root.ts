import { createWalletSlice, WalletSlice } from './walletSlice'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { create, StoreApi, UseBoundStore } from 'zustand'
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

export type Store<T> = UseBoundStore<StoreApi<T>>

const storeResetFns = new Set<() => void>()

export const resetAllStores = () => {
  storeResetFns.forEach((resetFn) => {
    resetFn()
  })
}

const initialState: RootStore | any = useRootStore.getState()
// delete initialState.expectChainId

storeResetFns.add(() => {
  useRootStore.setState(initialState, true)
})
