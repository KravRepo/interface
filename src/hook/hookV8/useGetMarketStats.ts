import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { useRootStore } from '../../store/root'
import { Contract } from 'ethers'
import trading_storage from '../../abi/trading_storage_v5.json'
import pair_info from '../../abi/pair_info_v6_1.json'
import BigNumber from 'bignumber.js'
import { formatNumber } from '../../utils'
// import { eXDecimals } from '../../utils/math'

export const useGetMarketStats = (address: string, decimals: number, pairInfoAddress: string) => {
  const { account, provider } = useWeb3React()
  const [openDaiLong, setOpenDaiLong] = useState<string | number | undefined>()
  const [openDaiShort, setOpenDaiShort] = useState<string | number | undefined>()
  const [borrowLongVal, setBorrowLongVal] = useState<BigNumber | undefined | 0>()
  const [borrowShortVal, setBorrowShortVal] = useState<BigNumber | undefined | 0>()
  const allPoolParams = useRootStore((store) => store.allPoolParams)

  useEffect(() => {
    ;(async () => {
      try {
        if (allPoolParams.length > 0 && account && provider) {
          const contract = new Contract(address, trading_storage.abi, provider)
          const longRes = await contract.openInterestDai(0, 0)
          const long = new BigNumber(longRes._hex).div(Number(`1e${decimals}`))
          setOpenDaiLong(formatNumber(long.toString(), 2, false))
          const shortRes = await contract.openInterestDai(0, 1)
          const short = new BigNumber(shortRes._hex)
          setOpenDaiShort(formatNumber(short.toString(), 2, false))
          const pairInfoContract = new Contract(pairInfoAddress, pair_info.abi, provider)
          const infoRes = await pairInfoContract.getFundingFeePerBlockP(0)
          const feePer = new BigNumber(infoRes._hex)
          const longVal =
            long.toString() !== '0' ? long.minus(short).times(feePer).times(1800).div(Number(1e10)).div(long) : 0
          const shortVal =
            short.toString() !== '0' ? long.minus(short).times(feePer).times(1800).div(Number(1e10)).div(short) : 0
          setBorrowLongVal(longVal)
          setBorrowShortVal(shortVal)
        }
      } catch (e) {
        setOpenDaiLong(undefined)
        setOpenDaiShort(undefined)
        console.log(e)
      }
    })()
  }, [allPoolParams, account, provider, address])
  return {
    openDaiLong: openDaiLong,
    openDaiShort: openDaiShort,
    borrowLongVal: borrowLongVal,
    borrowShortVal: borrowShortVal,
  }
}
