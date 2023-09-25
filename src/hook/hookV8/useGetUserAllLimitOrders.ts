import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'
import { useRootStore } from '../../store/root'
import { PoolParams } from '../../store/FactorySlice'
import { TupleLimitOrder } from '../../components/Trades/type'
import { Contract } from 'ethers'
import trading_storage from '../../abi/trading_storage_v5.json'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'

export type UseAllLimitOrders = {
  pool: PoolParams
  tuple: TupleLimitOrder[]
}
// TODO match pair index
export const useGetUserAllLimitOrders = () => {
  const { account, provider } = useWeb3React()
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const setUserAllOpenLimitList = useRootStore((store) => store.setUserAllOpenLimitList)
  return useCallback(async () => {
    try {
      if (allPoolParams.length > 0 && account && provider) {
        const storageList: string[] = []
        allPoolParams.forEach((pool) => {
          storageList.push(pool.storageT)
        })
        const useAllLimits: UseAllLimitOrders[] = []
        const getAndForMatter = async () => {
          return await Promise.all(
            storageList.map(async (address, index) => {
              const asyncWorker = async () => {
                const contract = new Contract(address, trading_storage.abi, provider)
                const userTotalTrade = await contract.openLimitOrdersCount(account, 0)
                const trades = new BigNumber(userTotalTrade._hex).toNumber()
                const task = []
                const hasOpenLimitOrderArray = []
                if (trades > 0) {
                  for (let i = 0; i < 3; i++) {
                    const has = await contract.hasOpenLimitOrder(account, 0, i)
                    if (has) {
                      hasOpenLimitOrderArray.push(i)
                    }
                  }
                }

                for (let i = 0; i < hasOpenLimitOrderArray.length; i++) {
                  task.push(contract.getOpenLimitOrder(account, 0, hasOpenLimitOrderArray[i]))
                }
                const res = await Promise.all(task)
                const userOpenLimit: TupleLimitOrder[] = []
                for (let i = 0; i < trades; i++) {
                  userOpenLimit.push({
                    block: new BigNumber(res[i].block._hex).toNumber(),
                    buy: res[i].buy,
                    index: new BigNumber(res[i].index._hex).toNumber(),
                    leverage: new BigNumber(res[i].leverage._hex).toNumber(),
                    maxPrice: eXDecimals(res[i].maxPrice._hex, 10),
                    minPrice: eXDecimals(res[i].minPrice._hex, 10),
                    pairIndex: new BigNumber(res[i].pairIndex._hex).toNumber(),
                    positionSize: eXDecimals(res[i].positionSize._hex, 18),
                    sl: eXDecimals(res[i].sl._hex, 18),
                    spreadReductionP: eXDecimals(res[i].spreadReductionP._hex, 10),
                    tokenId: new BigNumber(res[i].tokenId._hex).toNumber(),
                    trader: account,
                    tp: eXDecimals(res[i].tp._hex, 18),
                  })
                }
                if (userOpenLimit.length > 0) {
                  useAllLimits.push({
                    pool: allPoolParams[index],
                    tuple: userOpenLimit,
                  })
                }
              }
              return await asyncWorker()
            })
          )
        }
        await getAndForMatter()
        setUserAllOpenLimitList(useAllLimits)
      }
    } catch (e) {}
  }, [allPoolParams, account, provider])
}
