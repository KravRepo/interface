import { useEffect, useMemo, useState } from 'react'
import { TradingStorageABI } from '../../abi/deployed/TradingStorageABI'
import BigNumber from 'bignumber.js'
import { useContract } from './useContract'
import { useSingleContractMultipleData } from '../multicall'

export const useGetMarketStats = (address: string, decimals: number, pairInfoAddress: string, paiIndex = 0) => {
  const [openDaiLong, setOpenDaiLong] = useState<BigNumber | undefined>(undefined)
  const [openDaiShort, setOpenDaiShort] = useState<BigNumber | undefined>(undefined)
  // const allPoolParams = useRootStore((store) => store.allPoolParams)

  const storageContract = useContract(address, TradingStorageABI)

  const args = useMemo(() => {
    return {
      openInterest: [
        [paiIndex, 0],
        [paiIndex, 1],
      ],
    }
  }, [paiIndex])

  const openInterestDai = useSingleContractMultipleData(storageContract, 'openInterestDai', args.openInterest)

  useEffect(() => {
    const longRes = openInterestDai?.[0]?.result?.[0]
    const shortRes = openInterestDai?.[1]?.result?.[0]
    if (!longRes || !shortRes) {
      return
    }

    const long = new BigNumber(longRes._hex).div(Number(`1e${decimals}`))
    setOpenDaiLong(long)
    const short = new BigNumber(shortRes._hex).div(Number(`1e${decimals}`))
    setOpenDaiShort(short)
  }, [decimals, openInterestDai])

  // useEffect(() => {
  //   if (!address || !pairInfoAddress) return
  //   ;(async () => {
  //     try {
  //       if (allPoolParams.length > 0 && provider && typeof paiIndex !== 'undefined') {
  //         const contract = new Contract(address, TradingStorageABI, provider)
  //         const pairInfoContract = new Contract(pairInfoAddress, PairInfosABI, provider)

  //         const [longRes, shortRes] = await Promise.all([
  //           contract.openInterestDai(paiIndex, 0),
  //           contract.openInterestDai(paiIndex, 1),
  //           pairInfoContract.getFundingFeePerBlockP(paiIndex),
  //         ])

  //         const long = new BigNumber(longRes._hex).div(Number(`1e${decimals}`))
  //         setOpenDaiLong(long)
  //         const short = new BigNumber(shortRes._hex).div(Number(`1e${decimals}`))
  //         setOpenDaiShort(short)
  //       }
  //     } catch (e) {
  //       setOpenDaiLong(undefined)
  //       setOpenDaiShort(undefined)
  //       console.log(e)
  //     }
  //   })()
  // }, [allPoolParams, provider, address, paiIndex, decimals, pairInfoAddress])

  return {
    openDaiLong: openDaiLong,
    openDaiShort: openDaiShort,
  }
}
