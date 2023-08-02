import { useRootStore } from '../../store/root'
import { useCallback, useEffect, useState } from 'react'
import { QUANTO_API, TEST_CHAIN_ID } from '../../constant/chain'
import { Quanto } from '../../components/Trades/TradeLeft/TradeHistory'
import BigNumber from 'bignumber.js'
import { ONE_YEAR_TIMESTAMP } from '../../constant/math'

export type AprList = {
  tradingT: string
  apr: BigNumber
}

export const useGetApr = () => {
  const [aprList, setAprList] = useState<AprList[]>([])
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const getApr = useCallback(async () => {
    if (allPoolParams.length > 0) {
      try {
        const quantosRequest = await fetch(
          QUANTO_API + `?chainId=${TEST_CHAIN_ID}&offset=0&limit=` + allPoolParams.length
        )
        const quantos = await quantosRequest.json()
        if (quantos.code == 200) {
          const allPoolApr: AprList[] = []
          allPoolParams.forEach((pool) => {
            const target = quantos.data.find((quanto: Quanto) => quanto?.tradingT === pool.tradingT)
            const creatTime = target.timestamp * 1000
            const currentTime = new Date().getTime()
            const timeDiff = currentTime - creatTime
            //APR = accDaiPerDai / timeDiff * 1 year / 1e18 * 100%
            const APR = pool.accDaiPerDai
              .div(timeDiff)
              .times(ONE_YEAR_TIMESTAMP)
              .div(new BigNumber(10).pow(18))
              .times(100)
            allPoolApr.push({
              tradingT: pool.tradingT,
              apr: APR,
            })
          })
          setAprList(allPoolApr)
        }
      } catch (e) {}
    }
  }, [allPoolParams])

  useEffect(() => {
    getApr().then()
    setInterval(async () => {
      await getApr()
    }, 20000)
  }, [allPoolParams])
  return { aprList: aprList }
}
