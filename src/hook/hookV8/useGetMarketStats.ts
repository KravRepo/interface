import { useEffect, useState } from 'react'
import { useRootStore } from '../../store/root'
import { Contract } from 'ethers'
import { TradingStorageABI } from '../../abi/deployed/TradingStorageABI'
import { PairInfosABI } from '../../abi/deployed/PairInfosABI'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'

export const useGetMarketStats = (address: string, decimals: number, pairInfoAddress: string, paiIndex = 0) => {
  const { provider } = useWeb3React()
  const [openDaiLong, setOpenDaiLong] = useState<BigNumber | undefined>()
  const [openDaiShort, setOpenDaiShort] = useState<BigNumber | undefined>()
  const allPoolParams = useRootStore((store) => store.allPoolParams)

  useEffect(() => {
    if (!address || !pairInfoAddress) return
    ;(async () => {
      try {
        if (allPoolParams.length > 0 && provider && typeof paiIndex !== 'undefined') {
          const contract = new Contract(address, TradingStorageABI, provider)
          const pairInfoContract = new Contract(pairInfoAddress, PairInfosABI, provider)

          const [longRes, shortRes] = await Promise.all([
            contract.openInterestDai(paiIndex, 0),
            contract.openInterestDai(paiIndex, 1),
            pairInfoContract.getFundingFeePerBlockP(paiIndex),
          ])

          const long = new BigNumber(longRes._hex).div(Number(`1e${decimals}`))
          setOpenDaiLong(long)
          const short = new BigNumber(shortRes._hex).div(Number(`1e${decimals}`))
          setOpenDaiShort(short)
        }
      } catch (e) {
        setOpenDaiLong(undefined)
        setOpenDaiShort(undefined)
        console.log(e)
      }
    })()
  }, [allPoolParams, provider, address, paiIndex, decimals, pairInfoAddress])

  return {
    openDaiLong: openDaiLong,
    openDaiShort: openDaiShort,
  }
}
