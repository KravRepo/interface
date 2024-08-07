import { usePairStorageContract } from './useContract'
import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useRootStore } from '../../store/root'
import { eXDecimals } from '../../utils/math'
import { MAX_COLLATERAL_P } from '../../constant/contractConstants'

export const useMaxPositionCheck = () => {
  const tradePool = useRootStore((state) => state.tradePool)
  const tradePairIndex = useRootStore((state) => state.tradePairIndex)
  const pairStorageContract = usePairStorageContract(tradePool?.pairStorageT)

  return useCallback(
    async (positionAmount: BigNumber, leverage: number) => {
      if (pairStorageContract && tradePool.poolCurrentBalance) {
        const pairsInfo = await Promise.all([
          pairStorageContract.pairsBackend(tradePairIndex),
          pairStorageContract.groupCollateral(tradePairIndex, true),
        ])
        const groupCollateral = pairsInfo[1]
        const MaxPos = tradePool.poolCurrentBalance?.times(MAX_COLLATERAL_P).div(100)
        const curPos = eXDecimals(new BigNumber(groupCollateral._hex), tradePool.decimals)
        // require(maxPos>=curPos+positionAmount)

        return {
          state: !positionAmount.times(leverage)?.isGreaterThan(MaxPos?.minus(curPos)),
          maxAmount: MaxPos?.minus(curPos),
        }
      } else
        return {
          state: false,
          maxAmount: new BigNumber(0),
        }
    },
    [pairStorageContract, tradePool.poolCurrentBalance, tradePool.decimals, tradePairIndex]
  )
}
