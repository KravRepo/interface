import { useEffect, useState } from 'react'
import { useRootStore } from '../../store/root'
import { Contract } from 'ethers'
import trading_storage from '../../abi/trading_storage_v5.json'
import pair_info from '../../abi/pair_info_v6_1.json'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'

export const useGetMarketStats = (address: string, decimals: number, pairInfoAddress: string, paiIndex = 0) => {
  const { provider } = useWeb3React()
  const [openDaiLong, setOpenDaiLong] = useState<BigNumber | undefined>()
  const [openDaiShort, setOpenDaiShort] = useState<BigNumber | undefined>()
  const allPoolParams = useRootStore((store) => store.allPoolParams)

  useEffect(() => {
    ; (async () => {
      try {
        if (allPoolParams.length > 0 && provider && typeof paiIndex !== 'undefined') {
          const contract = new Contract(address, trading_storage.abi, provider)
          const pairInfoContract = new Contract(pairInfoAddress, pair_info.abi, provider)

          const [longRes, shortRes] = await Promise.all([
            contract.openInterestDai(paiIndex, 0),
            contract.openInterestDai(paiIndex, 1),
            pairInfoContract.getFundingFeePerBlockP(paiIndex),
          ])

          const long = new BigNumber(longRes._hex).div(Number(`1e${decimals}`))
          console.log('long', long.toString())
          setOpenDaiLong(long)
          const short = new BigNumber(shortRes._hex).div(Number(`1e${decimals}`))
          console.log('short', short.toString())
          setOpenDaiShort(short)
        }
      } catch (e) {
        setOpenDaiLong(undefined)
        setOpenDaiShort(undefined)
        console.log(e)
      }
    })()
  }, [allPoolParams, provider, address, paiIndex, decimals, pairInfoAddress])

  // useEffect to log the state values when they change
  useEffect(() => {
    console.log('Updated long', openDaiLong?.toString())
  }, [openDaiLong])

  useEffect(() => {
    console.log('Updated short', openDaiShort?.toString())
  }, [openDaiShort])

  return {
    openDaiLong: openDaiLong,
    openDaiShort: openDaiShort,
  }
}
