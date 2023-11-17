import { useRootStore } from '../../store/root'
import { useWeb3React } from '@web3-react/core'
import { usePairStorageContract } from './useContract'
import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'

export const useGetOrderLimit = () => {
  const tradePool = useRootStore((state) => state.tradePool)
  const tradePairIndex = useRootStore((state) => state.tradePairIndex)
  const { provider, chainId } = useWeb3React()
  const pairStorageContract = usePairStorageContract(tradePool.pairStorageT)
  const [orderLimit, setOrderLimit] = useState(new BigNumber(0))
  const getOrderLimit = useCallback(async () => {
    try {
      if (pairStorageContract && tradePool.poolCurrentBalance && provider) {
        // console.log('start get order limit')
        const pairsInfo = await Promise.all([
          pairStorageContract.pairsBackend(tradePairIndex),
          pairStorageContract.groupCollateral(tradePairIndex, true),
        ])
        const pairsBackend = pairsInfo[0]
        const groupCollateral = pairsInfo[1]
        const maxCollateralP = new BigNumber(pairsBackend[1].maxCollateralP._hex)
        const MaxPos = tradePool.poolCurrentBalance?.times(maxCollateralP).div(100)
        const curPos = eXDecimals(new BigNumber(groupCollateral._hex), tradePool.decimals)
        setOrderLimit(MaxPos?.minus(curPos))
      }
    } catch (e) {
      console.log('get order limit failed!')
    }
  }, [tradePool, provider, tradePairIndex, pairStorageContract])

  useEffect(() => {
    setOrderLimit(new BigNumber(0))
  }, [chainId])

  return { orderLimit: orderLimit, getOrderLimit: getOrderLimit }
}
