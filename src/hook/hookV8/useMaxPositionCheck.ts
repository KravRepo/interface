import { usePairStorageContract } from './useContract'
import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useRootStore } from '../../store/root'
import { eXDecimals } from '../../utils/math'

export const useMaxPositionCheck = () => {
  const tradePool = useRootStore((state) => state.tradePool)
  const tradePairIndex = useRootStore((state) => state.tradePairIndex)
  const { provider } = useWeb3React()
  const pairStorageContract = usePairStorageContract(tradePool?.pairStorageT)

  return useCallback(
    async (positionAmount: BigNumber, leverage: number) => {
      if (pairStorageContract && tradePool.poolCurrentBalance) {
        const pairsInfo = await Promise.all([
          pairStorageContract.pairsBackend(tradePairIndex),
          pairStorageContract.groupCollateral(tradePairIndex, true),
        ])
        const pairsBackend = pairsInfo[0]
        const groupCollateral = pairsInfo[1]
        console.log('groupCollateral', groupCollateral)
        const maxCollateralP = new BigNumber(pairsBackend[1].maxCollateralP._hex)
        const MaxPos = tradePool.poolCurrentBalance?.times(maxCollateralP).div(100)
        const curPos = eXDecimals(new BigNumber(groupCollateral._hex), tradePool.decimals)
        // require(maxPos>=curPos+positionAmount)

        console.log('positionAmount', positionAmount.toFixed(2))
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
    [tradePool, provider, tradePairIndex]
  )
}
