import { useCallback, useEffect, useState } from 'react'
import { useRootStore } from '../../store/root'
import { useWeb3React } from '@web3-react/core'
// import { Contract } from 'ethers'
// import trading_storage from 'abi/trading_storage_v5.json'
// import BigNumber from 'bignumber.js'
import { useGetUserOpenTrade } from './useGetUserOpenTrade'
import { Tuple } from '../../components/Trades/type'

export const useGetUserAllOpenTrades = () => {
  const { account, provider } = useWeb3React()
  const { userOpenTrades, getUserOpenTrade } = useGetUserOpenTrade()
  const [useAllOpenTrades, setUserAllOpenTrades] = useState([] as Tuple[])
  const allPoolParams = useRootStore((store) => store.allPoolParams)

  const getUserAllOpenTrades = useCallback(async () => {
    if (allPoolParams.length > 0 && account && provider) {
      const storageList: string[] = []
      allPoolParams.forEach((pool) => {
        // const storageContract = new Contract(pool.storageT, trading_storage.abi, provider)
        storageList.push(pool.storageT)
      })
      storageList.map(async (address) => {
        await getUserOpenTrade(address, false)
        console.log(userOpenTrades)
        setUserAllOpenTrades(userOpenTrades)
      })

      // const tradesTask: any[] = []
      // storageList.forEach((contract) => tradesTask.push(contract.openTradesCount(account, 0)))
      // const poolTrades = await Promise.all(tradesTask)
      // let totalTrades = 0
      // poolTrades.forEach((trades) => {
      //   totalTrades += new BigNumber(trades._hex).toNumber()
      // })
      // console.log('totalTrades', totalTrades)
      // setUserAllOpenTrades(totalTrades)
    }
  }, [allPoolParams, account, provider])

  useEffect(() => {
    getUserAllOpenTrades().then()
    const interval = setInterval(async () => {
      await getUserAllOpenTrades()
    }, 15000)

    return () => clearInterval(interval)
  }, [allPoolParams, account, provider])

  return { totalTrades: useAllOpenTrades }
}
