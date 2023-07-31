import { UserData } from 'hook/hookV8/useUserPosition'
import { StateCreator } from 'zustand'
import { RootStore } from './root'
import BigNumber from 'bignumber.js'

export type PoolParams = {
  tokenT: string
  storageT: string
  pairInfoT: string
  pairStorageT: string
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
  poolTotalSupply?: BigNumber
  poolCurrentBalance?: BigNumber
}

export interface FactorySlice {
  isLoadingFactory: boolean
  setIsLoadingFactory: (isLoadingFactory: boolean) => void
  allPoolParams: PoolParams[]
  setAllPoolParams: (allPoolInfo: PoolParams[]) => void
  userPositionDatas: UserData[]
  setUserPositionDatas: (userPositionDatas: UserData[]) => void
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
  setAllPoolParams(allPoolParams) {
    set({ allPoolParams: allPoolParams })
  },
  setUserPositionDatas(userPositionDatas) {
    set({ userPositionDatas: userPositionDatas })
  },
  setIsLoadingFactory(isLoadingFactory) {
    set({ isLoadingFactory: isLoadingFactory })
  },
})
