import { useRootStore } from '../../store/root'
import { useWeb3React } from '@web3-react/core'
import { usePairStorageContract } from './useContract'
import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'

export const useGetOrderLimit = () => {
  const tradePool = useRootStore((state) => state.tradePool)
  const { provider } = useWeb3React()
  const pairStorageContract = usePairStorageContract(tradePool.pairStorageT)

  return useCallback(async () => {
    if (pairStorageContract && tradePool.poolCurrentBalance) {
      const pairsInfo = await Promise.all([
        pairStorageContract.pairsBackend(0),
        pairStorageContract.groupCollateral(0, true),
      ])
      const pairsBackend = pairsInfo[0]
      const groupCollateral = pairsInfo[1]
      const maxCollateralP = new BigNumber(pairsBackend[1].maxCollateralP._hex)
      const MaxPos = tradePool.poolCurrentBalance?.times(maxCollateralP).div(100)
      const curPos = eXDecimals(new BigNumber(groupCollateral._hex), tradePool.decimals)
      return MaxPos?.minus(curPos)
    } else return new BigNumber(0)
  }, [tradePool, provider])
}
