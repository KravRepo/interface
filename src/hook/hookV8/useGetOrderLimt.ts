import { useRootStore } from '../../store/root'
import { useWeb3React } from '@web3-react/core'
import { usePairStorageContract } from './useContract'
import { useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'
import { MAX_COLLATERAL_P } from '../../constant/contractConstants'
import { useSingleCallResult } from '../multicall'

export const useGetOrderLimit = () => {
  const tradePool = useRootStore((state) => state.tradePool)
  const tradePairIndex = useRootStore((state) => state.tradePairIndex)
  const { chainId } = useWeb3React()
  const pairStorageContract = usePairStorageContract(tradePool.pairStorageT)
  const [orderLimit, setOrderLimit] = useState(new BigNumber(0))

  const args = useMemo(() => {
    return {
      pairsBackend: [tradePairIndex],
      groupCollateral: [tradePairIndex, 'true'] as any[],
    }
  }, [tradePairIndex])

  const pairsBackend = useSingleCallResult(pairStorageContract, 'pairsBackend', args.pairsBackend)
  const groupCollateralRaw = useSingleCallResult(pairStorageContract, 'groupCollateral', args.groupCollateral)

  useEffect(() => {
    if (!groupCollateralRaw.result || !tradePool.poolCurrentBalance) return
    const groupCollateral = groupCollateralRaw.result[0]

    const MaxPos = tradePool.poolCurrentBalance?.times(MAX_COLLATERAL_P).div(100)
    const curPos = eXDecimals(new BigNumber(groupCollateral._hex), tradePool.decimals)
    setOrderLimit(MaxPos?.minus(curPos))
  }, [groupCollateralRaw.result, pairsBackend.result, tradePool.decimals, tradePool.poolCurrentBalance])

  // const getOrderLimit = useCallback(async () => {
  //   try {
  //     if (pairStorageContract && tradePool.poolCurrentBalance && provider) {
  //       // console.log('start get order limit')
  //       const pairsInfo = await Promise.all([
  //         pairStorageContract.pairsBackend(tradePairIndex),
  //         pairStorageContract.groupCollateral(tradePairIndex, true),
  //       ])
  //       const groupCollateral = pairsInfo[1]
  //       const MaxPos = tradePool.poolCurrentBalance?.times(MAX_COLLATERAL_P).div(100)
  //       const curPos = eXDecimals(new BigNumber(groupCollateral._hex), tradePool.decimals)
  //       setOrderLimit(MaxPos?.minus(curPos))
  //     }
  //   } catch (e) {
  //     console.log('get order limit failed!')
  //   }
  // }, [tradePool, provider, tradePairIndex, pairStorageContract])

  useEffect(() => {
    setOrderLimit(new BigNumber(0))
  }, [chainId])

  return { orderLimit: orderLimit }
}
