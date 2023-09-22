import { StateCreator } from 'zustand'
import { RootStore } from './root'
import { PoolParams } from './FactorySlice'

export enum TransactionState {
  START = 'Start transaction',
  CHECK_APPROVE = 'Check approve',
  APPROVE = 'Approve...',
  INTERACTION = 'Interaction...',
  START_OPEN_TRADE = 'Start open trade',
  APPROVE_SUCCESS = 'Approve success',
  OPEN_TRADE_SUCCESS = 'Open trade success',
  ADD_LIQUIDITY = 'add liquidity...',
  CREAT_POOL = 'Creat pool...',
  STAKE = 'Stake...',
  REMOVE_LIQUIDITY = 'Remove liquidity...',
  CLAIM_LP_REWARD = 'Claim LP reward...',
  CANCEL_LIMIT_ORDER = 'Cancel limit order...',
  CANCEL_MARKET_ORDER = 'Cancel market order...',
  CLAIM_ORDER = 'Claim position',
  FAUCET_TEST_TOKEN = 'faucet token...',
  STAKE_KRAV = 'stake krav',
  WITHDRAW_KRAV = 'withdraw krav',
  CLAIM_KRAV_REWARD = 'claim krav reward',
  UPDATE_SL_ORDER = 'Update stop loss...',
  UPDATE_TP_ORDER = 'Update take profit...',
  LOCK_KRAV = 'Locking Krav...',
  INCREASE_AMOUNT = 'Increase lock Krav...',
  INCREASE_UNLOCK_TIME = 'Increase lock time...',
  PENDING = 'Pending...',
  CLAIM_REFERRAL_REWARD = 'Claim referral reward...',
  UNLOCK = 'Unlock',
}

export enum CreatPoolState {
  CONFIRM = 'CONFIRM',
  CREAT_POOL = 'CREAT_POOL',
  APPROVE = 'APPROVE',
  STAKE = 'STAKE',
}

export enum TransactionAction {
  NONE = '',
  WALLET = 'wallet',
  OPEN_TRADE = 'Open trade',
  ADD_LIQUIDITY = 'Added liquidity',
  CREATE = 'Create pool',
  REMOVE_LIQUIDITY = 'Removed liquidity',
  CANCEL_LIMIT_ORDER = 'Limit order canceled',
  CANCEL_MARKET_ORDER = 'Market order closed ',
  UPDATE_SL_ORDER = 'Updated stop loss',
  UPDATE_TP_ORDER = 'Updated take profit',
  CLAIM_ORDER = 'Claim position',
  APPROVE = 'Approve',
  ADDRESS_CHECK = 'Token address check',
  CLAIM_LP_REWARD = 'Claim lp reward',
  FAUCET_TEST_TOKEN = 'Faucet token',
  STAKE_KRAV = 'Staked Krav',
  WITHDRAW_KRAV = 'Withdraw Krav',
  CLAIM_KRAV_REWARD = 'claim Krav reward',
  LOCK_KRAV = 'Locked Krav',
  INCREASE_AMOUNT = 'Increase locked Krav amount',
  INCREASE_UNLOCK_TIME = 'Increase unlock time',
  CLAIM_LOCK_REWARD = 'Claim locked Reward',
  CLAIM_LIQUIDITY_PROVIDER_REWARDS = 'Claim liquidity provider rewards',
  CLAIM_TRADING_REWARDS = 'Claim trading rewards',
  CLAIM_REFERRAL_REWARD = 'Claim referral reward',
  UNLOCK = 'Unlock',
}

export type ErrorContent = {
  dialogVisibility: boolean
  action: TransactionAction
  reason?: string
}

export type SuccessContent = {
  dialogVisibility: boolean
  action: TransactionAction
}

export type SuccessSnackbarInfo = {
  snackbarVisibility: boolean
  title: string
  content: string
}

export interface TransactionSlice {
  transactionState: TransactionState
  setTransactionState: (TransactionState: TransactionState) => void
  creatPoolState: CreatPoolState
  setCreatPoolState: (creatPoolState: CreatPoolState) => void
  liquidityInfo: PoolParams
  setLiquidityInfo: (liquidityInfo: PoolParams) => void
  errorContent: ErrorContent
  successContent: SuccessContent
  setSuccessContent: (SuccessContent: SuccessContent) => void
  setErrorContent: (ErrorContent: ErrorContent) => void
  transactionDialogVisibility: boolean
  setTransactionDialogVisibility: (transactionDialogVisibility: boolean) => void
  successSnackbarInfo: SuccessSnackbarInfo
  setSuccessSnackbarInfo: (successSnackbarInfo: SuccessSnackbarInfo) => void
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
    action: TransactionAction.NONE,
  },
  successContent: {
    dialogVisibility: false,
    action: TransactionAction.NONE,
  },
  successSnackbarInfo: {
    snackbarVisibility: false,
    title: '',
    content: '',
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
  setSuccessContent(successContent) {
    set({ successContent: successContent })
  },
  setTransactionDialogVisibility(transactionDialogVisibility) {
    set({ transactionDialogVisibility: transactionDialogVisibility })
  },
  setSuccessSnackbarInfo(successSnackbarInfo) {
    set({ successSnackbarInfo: successSnackbarInfo })
  },
})
