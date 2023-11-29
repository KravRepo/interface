import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'
import { useRootStore } from '../../store/root'
import { PoolParams } from '../../store/FactorySlice'
import { TupleLimitOrder } from '../../components/Trades/type'
import { Contract } from 'ethers'
import trading_storage from '../../abi/trading_storage_v5.json'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'
import multicall2 from '../../abi/multicall2.json'
import { useConfig } from './useConfig'
import { EthersBigNumber, Multicall } from './utils/utils'
import pair_storage_v6 from '../../abi/pair_storage_v6.json'

export type UseAllLimitOrders = {
  pool: PoolParams
  tuple: TupleLimitOrder[]
}

type limitOrderRawData = {
  block: EthersBigNumber
  buy: boolean
  index: EthersBigNumber
  leverage: EthersBigNumber
  maxPrice: EthersBigNumber
  minPrice: EthersBigNumber
  pairIndex: EthersBigNumber
  positionSize: EthersBigNumber
  sl: EthersBigNumber
  spreadReductionP: EthersBigNumber
  tokenId: EthersBigNumber
  trader: string
  tp: EthersBigNumber
}

// TODO match pair index
export const useGetUserAllLimitOrders = () => {
  const { account, provider } = useWeb3React()
  const config = useConfig()
  const allPoolParams = useRootStore((store) => store.allPoolParams)

  const setUserAllOpenLimitList = useRootStore((store) => store.setUserAllOpenLimitList)
  return useCallback(async () => {
    try {
      if (allPoolParams.length > 0 && account && provider && config) {
        const storageList: string[] = []
        allPoolParams.forEach((pool) => {
          storageList.push(pool.storageT)
        })
        const useAllLimits: UseAllLimitOrders[] = []
        const multicall = new Contract(config.multicall, multicall2.abi, provider)
        const pairStorageList: string[] = []
        allPoolParams.forEach((pool) => {
          storageList.push(pool.storageT)
          pairStorageList.push(pool.pairStorageT)
        })
        const multicall1 = new Multicall(multicall)
        pairStorageList.forEach((address, index) => {
          const contract = new Contract(address, pair_storage_v6.abi, provider)
          multicall1.addTask('pairsCount', [], contract, allPoolParams[index])
        })
        const pairCount = await multicall1.sendCall()
        multicall1.clear()
        pairCount.returnData.forEach((data: EthersBigNumber, index: number) => {
          for (let i = 0; i < new BigNumber(data._hex).toNumber(); i++) {
            multicall1.addTask(
              'openLimitOrdersCount',
              [account, i],
              new Contract(pairCount.details[index].storageT, trading_storage.abi, provider),
              {
                pool: pairCount.details[index],
                pairIndex: i,
              }
            )
          }
        })
        const openLimitOrdersCountCall = await multicall1.sendCall()
        const openLimitOrdersCount = openLimitOrdersCountCall.returnData

        multicall1.clear()
        openLimitOrdersCount.forEach((data: EthersBigNumber, index: number) => {
          if (new BigNumber(data._hex).isGreaterThan(0)) {
            for (let i = 0; i < 3; i++) {
              const params = [account, openLimitOrdersCountCall.details[index].pairIndex, i]
              const contract = new Contract(
                openLimitOrdersCountCall.details[index].pool.storageT,
                trading_storage.abi,
                provider
              )
              multicall1.addTask('hasOpenLimitOrder', params, contract, {
                pool: openLimitOrdersCountCall.details[index].pool,
                pairIndex: openLimitOrdersCountCall.details[index].pairIndex,
                tradesCount: new BigNumber(openLimitOrdersCountCall.returnData[index]._hex).toNumber(),
                index: i,
              })
            }
          }
        })
        const hasOpenLimitOrder = await multicall1.sendCall()
        multicall1.clear()
        hasOpenLimitOrder.returnData.forEach((data: any, index: number) => {
          if (data) {
            multicall1.addTask(
              'getOpenLimitOrder',
              [account, hasOpenLimitOrder.details[index].pairIndex, hasOpenLimitOrder.details[index].index],
              new Contract(hasOpenLimitOrder.details[index].pool.storageT, trading_storage.abi, provider),
              {
                pool: hasOpenLimitOrder.details[index].pool,
              }
            )
          }
        })
        const getOpenLimitOrderCall = await multicall1.sendCall()
        const userLimitOrders: TupleLimitOrder[] = []

        getOpenLimitOrderCall.returnData.forEach((item: limitOrderRawData) => {
          userLimitOrders.push({
            block: new BigNumber(item.block._hex).toNumber(),
            buy: item.buy,
            index: new BigNumber(item.index._hex).toNumber(),
            leverage: new BigNumber(item.leverage._hex).toNumber(),
            maxPrice: eXDecimals(item.maxPrice._hex, 10),
            minPrice: eXDecimals(item.minPrice._hex, 10),
            pairIndex: new BigNumber(item.pairIndex._hex).toNumber(),
            positionSize: eXDecimals(item.positionSize._hex, 18),
            sl: eXDecimals(item.sl._hex, 18),
            spreadReductionP: eXDecimals(item.spreadReductionP._hex, 10),
            tokenId: new BigNumber(item.tokenId._hex).toNumber(),
            trader: account,
            tp: eXDecimals(item.tp._hex, 18),
          })
        })

        userLimitOrders.forEach((data: any, index) => {
          useAllLimits.push({
            pool: getOpenLimitOrderCall.details[index].pool,
            tuple: [data],
          })
        })
        setUserAllOpenLimitList(useAllLimits)
      }
    } catch (e) {}
  }, [allPoolParams, account, provider, config])
}
