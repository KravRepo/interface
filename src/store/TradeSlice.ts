import { StateCreator } from 'zustand'
import { RootStore } from './root'
import { PoolParams } from './FactorySlice'

export enum TradeTransactionState {
  START = 'START',
  CHECK_APPROVE = 'CHECK_APPROVE',
  APPROVE = 'APPROVE',
  START_OPEN_TRADE = 'START_OPEN_TRADE',
  APPROVE_SUCCESS = 'APPROVE_SUCCESS',
  OPEN_TRADE_SUCCESS = 'OPEN_TRADE_SUCCESS',
}

export interface TradeSlice {
  tradePool: PoolParams
  setTradePool: (tradePool: PoolParams) => void
  isProModel: boolean
  setIsProModel: (isProModel: boolean) => void
  isOpenSelectToken: boolean
  setIsOpenSelectToken: (isOpenSelectToken: boolean) => void
}

export const createTradeSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  TradeSlice
> = (set) => ({
  tradePool: {} as PoolParams,
  isProModel: true,
  isOpenSelectToken: false,

  setTradePool(tradePool) {
    set({ tradePool: tradePool })
  },
  setIsProModel(isProModel: boolean) {
    set({ isProModel: isProModel })
  },
  setIsOpenSelectToken(isOpenSelectToken: boolean) {
    set({ isOpenSelectToken: isOpenSelectToken })
  },
})
