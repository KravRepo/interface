import { UserData } from '../hook/hookV8/useUserPosition'
import { StateCreator } from 'zustand'
import { RootStore } from './root'
import BigNumber from 'bignumber.js'
import { DEFAULT_CHAIN } from '../constant/chain'

export type PoolParams = {
  tokenT: string
  storageT: string
  pairInfoT: string
  pairStorageT: string
  apr?: BigNumber
  tradingT: string
  callbackT: string
  rewardT: string
  vaultT: string
  priceAggregatorT: string
  symbol: string
  proportionBTC: number
  decimals: number
  blockNumber: number
  logoSource: any
  utilization: BigNumber
  maxWithdrawP: BigNumber
  accDaiPerDai: BigNumber
  minPositionLev: BigNumber
  fundingFeePerBlockP: BigNumber
  poolTotalSupply?: BigNumber
  poolCurrentBalance?: BigNumber
}

export interface FactorySlice {
  isLoadingFactory: boolean
  setIsLoadingFactory: (isLoadingFactory: boolean) => void
  factoryLock: boolean
  setFactoryLock: (isLoadingFactory: boolean) => void
  allPoolParams: PoolParams[]
  setAllPoolParams: (allPoolInfo: PoolParams[]) => void
  userPositionDatas: UserData[]
  setUserPositionDatas: (userPositionDatas: UserData[]) => void
  expectChainId: number
  setExpectChainId: (expectChainId: number) => void
}

export const createFactorySlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  FactorySlice
> = (set) => ({
  isLoadingFactory: true,
  allPoolParams: [],
  userPositionDatas: [],
  expectChainId: DEFAULT_CHAIN,
  factoryLock: true,
  setAllPoolParams(allPoolParams) {
    set({ allPoolParams: allPoolParams })
  },
  setUserPositionDatas(userPositionDatas) {
    set({ userPositionDatas: userPositionDatas })
  },
  setIsLoadingFactory(isLoadingFactory) {
    set({ isLoadingFactory: isLoadingFactory })
  },
  setExpectChainId(expectChainId) {
    set({ expectChainId: expectChainId })
  },
  setFactoryLock(factoryLock) {
    set({ factoryLock: factoryLock })
  },
})
