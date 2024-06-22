import { StateCreator } from 'zustand'
import { RootStore } from './root'
import { PoolParams } from './FactorySlice'
import { msg } from '@lingui/macro'

export enum TransactionState {
  START = 'Start transaction',
  CHECK_APPROVE = 'Check approve',
  APPROVE = 'Approve...',
  INTERACTION = 'Executing...',
  START_OPEN_TRADE = 'Start open trade',
  APPROVE_SUCCESS = 'Approve success',
  OPEN_TRADE_SUCCESS = 'Open trade success',
  ADD_LIQUIDITY = 'Add liquidity...',
  CREAT_POOL = 'Creat pool...',
  STAKE = 'Stake...',
  REMOVE_LIQUIDITY = 'Remove liquidity...',
  REDEEM_LIQUIDITY = 'Remeem Liquidity...',
  CLAIM_LP_REWARD = 'Claim LP reward...',
  CANCEL_LIMIT_ORDER = 'Cancel limit order...',
  CANCEL_MARKET_ORDER = 'Cancel market order...',
  CLAIM_ORDER = 'Claim position',
  FAUCET_TEST_TOKEN = 'faucet token...',
  STAKE_KRAV = 'Stake Krav',
  WITHDRAW_KRAV = 'Withdraw Krav',
  CLAIM_KRAV_REWARD = 'Claim Krav reward',
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
  NONE = 'NONE',
  WALLET = 'WALLET',
  OPEN_TRADE = 'OPEN_TRADE',
  ADD_LIQUIDITY = 'ADD_LIQUIDITY',
  CREATE = 'CREATE',
  REMOVE_LIQUIDITY = 'REMOVE_LIQUIDITY',
  REDEEM_LIQUIDITY = 'REDEEM_LIQUIDITY',
  CANCEL_LIMIT_ORDER = 'CANCEL_LIMIT_ORDER',
  CANCEL_MARKET_ORDER = 'CANCEL_MARKET_ORDER',
  UPDATE_SL_ORDER = 'UPDATE_SL_ORDER',
  UPDATE_TP_ORDER = 'UPDATE_TP_ORDER',
  CLAIM_ORDER = 'CLAIM_ORDER',
  APPROVE = 'APPROVE',
  ADDRESS_CHECK = 'ADDRESS_CHECK',
  CLAIM_LP_REWARD = 'CLAIM_LP_REWARD',
  FAUCET_TEST_TOKEN = 'FAUCET_TEST_TOKEN',
  STAKE_KRAV = 'STAKE_KRAV',
  WITHDRAW_KRAV = 'WITHDRAW_KRAV',
  CLAIM_KRAV_REWARD = 'CLAIM_KRAV_REWARD',
  LOCK_KRAV = 'LOCK_KRAV',
  INCREASE_AMOUNT = 'INCREASE_AMOUNT',
  INCREASE_UNLOCK_TIME = 'INCREASE_UNLOCK_TIME',
  CLAIM_LOCK_REWARD = 'CLAIM_LOCK_REWARD',
  CLAIM_LIQUIDITY_PROVIDER_REWARDS = 'CLAIM_LIQUIDITY_PROVIDER_REWARDS',
  CLAIM_TRADING_REWARDS = 'CLAIM_TRADING_REWARDS',
  CLAIM_REFERRAL_REWARD = 'CLAIM_REFERRAL_REWARD',
  UNLOCK = 'UNLOCK',
}

export const TransactionActionMsg = {
  [TransactionAction.NONE]: msg``,
  [TransactionAction.WALLET]: msg`wallet`,
  [TransactionAction.OPEN_TRADE]: msg`Open trade`,
  [TransactionAction.ADD_LIQUIDITY]: msg`Added liquidity`,
  [TransactionAction.CREATE]: msg`Create pool`,
  [TransactionAction.REMOVE_LIQUIDITY]: msg`Removed liquidity`,
  [TransactionAction.REDEEM_LIQUIDITY]: msg`Redeem liquidity`,
  [TransactionAction.CANCEL_LIMIT_ORDER]: msg`Limit order canceled`,
  [TransactionAction.CANCEL_MARKET_ORDER]: msg`Market order closed`,
  [TransactionAction.UPDATE_SL_ORDER]: msg`Updated stop loss`,
  [TransactionAction.UPDATE_TP_ORDER]: msg`Updated take profit`,
  [TransactionAction.CLAIM_ORDER]: msg`Claim position`,
  [TransactionAction.APPROVE]: msg`Approve`,
  [TransactionAction.ADDRESS_CHECK]: msg`Token address check`,
  [TransactionAction.CLAIM_LP_REWARD]: msg`Claim lp reward`,
  [TransactionAction.FAUCET_TEST_TOKEN]: msg`Faucet token`,
  [TransactionAction.STAKE_KRAV]: msg`Staked Krav`,
  [TransactionAction.WITHDRAW_KRAV]: msg`Withdraw Krav`,
  [TransactionAction.CLAIM_KRAV_REWARD]: msg`claim Krav reward`,
  [TransactionAction.LOCK_KRAV]: msg`Locked Krav`,
  [TransactionAction.INCREASE_AMOUNT]: msg`Increase locked Krav amount`,
  [TransactionAction.INCREASE_UNLOCK_TIME]: msg`Increase unlock time`,
  [TransactionAction.CLAIM_LOCK_REWARD]: msg`Claim locked Reward`,
  [TransactionAction.CLAIM_LIQUIDITY_PROVIDER_REWARDS]: msg`Claim liquidity provider rewards`,
  [TransactionAction.CLAIM_TRADING_REWARDS]: msg`Claim trading rewards`,
  [TransactionAction.CLAIM_REFERRAL_REWARD]: msg`Claim referral reward`,
  [TransactionAction.UNLOCK]: msg`Unlock`,
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
