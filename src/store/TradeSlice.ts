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

export enum TradeMode {
  PRO,
  DEGEN,
  BASIC,
}

export interface TradeSlice {
  tradePool: PoolParams
  setTradePool: (tradePool: PoolParams) => void
  tradeModel: TradeMode
  setTradeModel: (tradeModel: TradeMode) => void
  isOpenSelectToken: boolean
  setIsOpenSelectToken: (isOpenSelectToken: boolean) => void
  tradePairIndex: number
  setTradePairIndex: (tradePairIndex: number) => void
  openTradeCard: boolean
  setOpenTradeCard: (openTradeCard: boolean) => void
}

export const createTradeSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  TradeSlice
> = (set) => ({
  tradePool: {} as PoolParams,
  tradeModel: TradeMode.DEGEN,
  isOpenSelectToken: false,
  tradePairIndex: 0,
  openTradeCard: false,
  setTradePool(tradePool) {
    set({ tradePool: tradePool })
  },
  setTradeModel(tradeModel: TradeMode) {
    set({ tradeModel: tradeModel })
  },
  setIsOpenSelectToken(isOpenSelectToken: boolean) {
    set({ isOpenSelectToken: isOpenSelectToken })
  },
  setTradePairIndex(tradePairIndex: number) {
    set({ tradePairIndex: tradePairIndex })
  },
  setOpenTradeCard(openTradeCard: boolean) {
    set({ openTradeCard: openTradeCard })
  },
})
