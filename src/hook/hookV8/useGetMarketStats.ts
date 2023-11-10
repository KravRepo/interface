import { useEffect, useState } from 'react'
import { useRootStore } from '../../store/root'
import { Contract } from 'ethers'
import trading_storage from '../../abi/trading_storage_v5.json'
import pair_info from '../../abi/pair_info_v6_1.json'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
// import { eXDecimals } from '../../utils/math'

export const useGetMarketStats = (address: string, decimals: number, pairInfoAddress: string, paiIndex = 0) => {
  const { provider } = useWeb3React()
  const [openDaiLong, setOpenDaiLong] = useState<BigNumber | undefined>()
  const [openDaiShort, setOpenDaiShort] = useState<BigNumber | undefined>()
  const [borrowLongVal, setBorrowLongVal] = useState<BigNumber | undefined>()
  const [borrowShortVal, setBorrowShortVal] = useState<BigNumber | undefined>()
  const allPoolParams = useRootStore((store) => store.allPoolParams)

  useEffect(() => {
    ;(async () => {
      try {
        if (allPoolParams.length > 0 && provider && typeof paiIndex !== 'undefined') {
          console.log('-------useGetMarketStats------------')
          const contract = new Contract(address, trading_storage.abi, provider)
          const pairInfoContract = new Contract(pairInfoAddress, pair_info.abi, provider)
          const [longRes, shortRes, infoRes] = await Promise.all([
            contract.openInterestDai(paiIndex, 0),
            contract.openInterestDai(paiIndex, 1),
            pairInfoContract.getFundingFeePerBlockP(paiIndex),
          ])
          const long = new BigNumber(longRes._hex).div(Number(`1e${decimals}`))
          setOpenDaiLong(long)
          const short = new BigNumber(shortRes._hex).div(Number(`1e${decimals}`))
          setOpenDaiShort(short)
          const feePer = new BigNumber(infoRes._hex)
          const longVal =
            long.toString() !== '0'
              ? long.minus(short).times(feePer).times(1800).div(Number(1e10)).div(long)
              : BigNumber(0)
          const shortVal =
            short.toString() !== '0'
              ? long.minus(short).times(feePer).times(1800).div(Number(1e10)).div(short)
              : BigNumber(0)
          setBorrowLongVal(longVal)
          setBorrowShortVal(shortVal)
        }
      } catch (e) {
        setOpenDaiLong(undefined)
        setOpenDaiShort(undefined)
        console.log(e)
      }
    })()
  }, [allPoolParams, provider, address, paiIndex])
  return {
    openDaiLong: openDaiLong,
    openDaiShort: openDaiShort,
    borrowLongVal: borrowLongVal,
    borrowShortVal: borrowShortVal,
  }
}
