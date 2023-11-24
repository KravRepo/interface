import { useCallback } from 'react'
import { useRootStore } from '../../store/root'
import { useWeb3React } from '@web3-react/core'
import { Tuple } from '../../components/Trades/type'
import { PoolParams } from '../../store/FactorySlice'
import { Contract } from 'ethers'
import trading_storage from '../../abi/trading_storage_v5.json'
import BigNumber from 'bignumber.js'
import { forMatterOpenTrades } from './utils/utils'
import { BASE_PAIR_CONFIG, EXCHANGE_STORAGE_T } from '../../constant/exchange'
import { CreatCall, creatCall, decodeCallResult } from './useContract'
import multicall2 from '../../abi/multicall2.json'
import { useConfig } from './useConfig'

export type UseAllOpenTrades = {
  pool: PoolParams
  tuple: Tuple[]
}
// TODO match pair index
export const useGetUserAllOpenTrades = () => {
  const { account, provider } = useWeb3React()
  const config = useConfig()
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const pairConfig = useRootStore((store) => store.pairConfig)
  const setUserAllOpenTradeList = useRootStore((store) => store.setUserAllOpenTradeList)
  const getUserAllOpenTrades = useCallback(async () => {
    try {
      if (allPoolParams.length > 0 && account && provider && config) {
        const storageList: string[] = []
        allPoolParams.forEach((pool) => {
          storageList.push(pool.storageT)
        })
        const allOpenTrades: UseAllOpenTrades[] = []
        const multicall = new Contract(config.multicall, multicall2.abi, provider)
        const getAndForMatter = async () => {
          return await Promise.all(
            storageList.map(async (address, index) => {
              const asyncWorker = async () => {
                //TODO current pairIndex only one , change in next update
                const contract = new Contract(address, trading_storage.abi, provider)
                if (EXCHANGE_STORAGE_T.includes(address) || pairConfig === BASE_PAIR_CONFIG) {
                  const userTotalTradesTask: CreatCall[] = []
                  const config = Object.keys(pairConfig).map((key) => {
                    return pairConfig[Number(key)]
                  })
                  for (let i = 0; i < config.length; i++) {
                    userTotalTradesTask.push(
                      creatCall(contract.address, contract.interface, 'openTradesCount', [account, config[i].pairIndex])
                    )
                  }
                  const req = await multicall.callStatic.aggregate(userTotalTradesTask)
                  let userTotalTrades = req.returnData
                  userTotalTrades = userTotalTrades.map((pair: string, index: number) => {
                    return {
                      trades: new BigNumber(
                        decodeCallResult(contract.interface, 'openTradesCount', pair)._hex
                      ).toNumber(),
                      pairIndex: config[index].pairIndex,
                    }
                  })
                  const positionTask: CreatCall[] = []
                  let totalCount = 0
                  userTotalTrades.forEach((trades: { trades: number; pairIndex: number }) => {
                    if (trades.trades > 0) {
                      totalCount += trades.trades
                      for (let i = 0; i < 3; i++) {
                        positionTask.push(
                          creatCall(contract.address, contract.interface, 'openTrades', [account, trades.pairIndex, i])
                        )
                      }
                    }
                  })
                  const openTradeReq = await multicall.callStatic.aggregate(positionTask)
                  let userOpenTradeWithPair = openTradeReq.returnData
                  userOpenTradeWithPair = userOpenTradeWithPair.map((openTrade: string) => {
                    return decodeCallResult(contract.interface, 'openTrades', openTrade)
                  })
                  const forMatter = forMatterOpenTrades(userOpenTradeWithPair, totalCount, account, false)
                  if (forMatter.length > 0) {
                    allOpenTrades.push({
                      pool: allPoolParams[index],
                      tuple: forMatter,
                    })
                  }
                } else {
                  const userTotalTrade = await contract.openTradesCount(account, 0)
                  const trades = new BigNumber(userTotalTrade._hex).toNumber()
                  const task = []
                  if (trades > 0) {
                    for (let i = 0; i < 3; i++) {
                      task.push(contract.openTrades(account, 0, i))
                    }
                  }
                  const res = await Promise.all(task)
                  const openTrades = forMatterOpenTrades(res, trades, account, false)
                  if (openTrades.length > 0) {
                    allOpenTrades.push({
                      pool: allPoolParams[index],
                      tuple: openTrades,
                    })
                  }
                }
              }
              return await asyncWorker()
            })
          )
        }
        await getAndForMatter()
        setUserAllOpenTradeList(allOpenTrades)
      }
    } catch (e) {}
  }, [allPoolParams, account, provider, config])

  return { getUserAllOpenTrades: getUserAllOpenTrades }
}
