import { useCallback } from 'react'
import { useRootStore } from '../../store/root'
import { useWeb3React } from '@web3-react/core'
import { Tuple } from '../../components/Trades/type'
import { PoolParams } from '../../store/FactorySlice'
import { Contract } from 'ethers'
import trading_storage from '../../abi/trading_storage_v5.json'
import pair_storage_v6 from '../../abi/pair_storage_v6.json'
import multicall2 from '../../abi/multicall2.json'
import { useConfig } from './useConfig'
import { EthersBigNumber, forMatterOpenTrades, Multicall, openTradeRawData } from './utils/utils'
import BigNumber from 'bignumber.js'

export type UseAllOpenTrades = {
  pool: PoolParams
  tuple: Tuple[]
}

// TODO match pair index
export const useGetUserAllOpenTrades = () => {
  const { account, provider } = useWeb3React()
  const config = useConfig()
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const setUserAllOpenTradeList = useRootStore((store) => store.setUserAllOpenTradeList)
  const getUserAllOpenTrades = useCallback(async () => {
    try {
      if (allPoolParams.length > 0 && account && provider && config) {
        const pairStorageList: string[] = []
        const storageList: string[] = []
        allPoolParams.forEach((pool) => {
          storageList.push(pool.storageT)
          pairStorageList.push(pool.pairStorageT)
        })
        const allOpenTrades: UseAllOpenTrades[] = []
        const multicallContract = new Contract(config.multicall, multicall2.abi, provider)
        const multicall1 = new Multicall(multicallContract)
        pairStorageList.forEach((address, index) => {
          const contract = new Contract(address, pair_storage_v6.abi, provider)
          multicall1.addTask('pairsCount', [], contract, allPoolParams[index])
        })
        const pairCount = await multicall1.sendCall()
        multicall1.clear()
        pairCount.returnData.forEach((data: EthersBigNumber, index: number) => {
          for (let i = 0; i < new BigNumber(data._hex).toNumber(); i++) {
            multicall1.addTask(
              'openTradesCount',
              [account, i],
              new Contract(pairCount.details[index].storageT, trading_storage.abi, provider),
              {
                pool: pairCount.details[index],
                pairIndex: i,
              }
            )
          }
        })
        const openTradesCountCall = await multicall1.sendCall()
        const openTradesCount = openTradesCountCall.returnData

        multicall1.clear()
        openTradesCount.forEach((data: EthersBigNumber, index: number) => {
          if (new BigNumber(data._hex).isGreaterThan(0)) {
            for (let i = 0; i < 3; i++) {
              const params = [account, openTradesCountCall.details[index].pairIndex, i]
              const contract = new Contract(
                openTradesCountCall.details[index].pool.storageT,
                trading_storage.abi,
                provider
              )
              multicall1.addTask('openTrades', params, contract, {
                pool: openTradesCountCall.details[index].pool,
                pairIndex: openTradesCountCall.details[index].pairIndex,
                tradesCount: new BigNumber(openTradesCountCall.returnData[index]._hex).toNumber(),
              })
            }
          }
        })
        const openTradesData = await multicall1.sendCall()
        console.log('openTradesData', openTradesData)
        // const userAllOpenTrades:Tuple[] = []
        const filterIndex: number[] = []
        openTradesData.returnData = openTradesData.returnData.filter((data: openTradeRawData, index: number) => {
          if (new BigNumber(data.leverage._hex).isEqualTo(0)) {
            filterIndex.push(index)
            return
          } else {
            return data
          }
        })
        openTradesData.details = openTradesData.details.filter((data: any, index: number) => {
          if (!filterIndex.includes(index)) return data
        })
        console.log('openTradesData', openTradesData)
        const test = forMatterOpenTrades(openTradesData.returnData, openTradesData.returnData.length, account, false)
        console.log('forMatterOpenTrades', test)
        test.forEach((data, index) => {
          allOpenTrades.push({
            pool: openTradesData.details[index].pool,
            tuple: [data],
          })
        })
        setUserAllOpenTradeList(allOpenTrades)
      }
    } catch (e) {}
  }, [allPoolParams, account, provider, config])

  return { getUserAllOpenTrades: getUserAllOpenTrades }
}
