import { StateCreator } from 'zustand'
import { RootStore } from './root'
import { PoolParams } from './FactorySlice'

export enum TransactionState {
  START = 'Start transaction',
  CHECK_APPROVE = 'Check approve',
  APPROVE = 'Approve...',
  START_OPEN_TRADE = 'Start open trade',
  APPROVE_SUCCESS = 'Approve success',
  OPEN_TRADE_SUCCESS = 'Open trade success',
  ADD_LIQUIDITY = 'add liquidity...',
  CREAT_POOL = 'Creat pool...',
  STAKE = 'Stake...',
  REMOVE_LIQUIDITY = 'Remove liquidity...',
}

export enum CreatPoolState {
  CONFIRM = 'CONFIRM',
  CREAT_POOL = 'CREAT_POOL',
  APPROVE = 'APPROVE',
  STAKE = 'STAKE',
}

export type ErrorContent = {
  dialogVisibility: boolean
  error: string
}

export interface TransactionSlice {
  transactionState: TransactionState
  setTransactionState: (TransactionState: TransactionState) => void
  creatPoolState: CreatPoolState
  setCreatPoolState: (creatPoolState: CreatPoolState) => void
  liquidityInfo: PoolParams
  setLiquidityInfo: (liquidityInfo: PoolParams) => void
  errorContent: ErrorContent
  setErrorContent: (ErrorContent: ErrorContent) => void
  transactionDialogVisibility: boolean
  setTransactionDialogVisibility: (transactionDialogVisibility: boolean) => void
}

export const createTransactionSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  TransactionSlice
> = (set) => ({
  transactionState: TransactionState.START,
  liquidityInfo: {} as PoolParams,
  errorContent: {
    dialogVisibility: false,
    error: '',
  },
  transactionDialogVisibility: false,
  setTransactionState(transactionState) {
    set({ transactionState: transactionState })
  },
  creatPoolState: CreatPoolState.CONFIRM,
  setCreatPoolState(creatPoolState) {
    set({ creatPoolState: creatPoolState })
  },
  setLiquidityInfo(liquidityInfo) {
    set({ liquidityInfo: liquidityInfo })
  },
  setErrorContent(errorContent) {
    set({ errorContent: errorContent })
  },
  setTransactionDialogVisibility(transactionDialogVisibility) {
    set({ transactionDialogVisibility: transactionDialogVisibility })
  },
})
