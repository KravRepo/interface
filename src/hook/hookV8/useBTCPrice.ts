import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useRootStore } from '../../store/root'
import { Contract, ethers } from 'ethers'
import btc_price from 'abi/bsc_price.json'
import { shallow } from 'zustand/shallow'
import { BTC_CONTRACT, TEST_RPC_NODE } from '../../constant/chain'
import { JsonRpcProvider } from '@ethersproject/providers'

export const useBTCPrice = () => {
  const provider = new ethers.providers.JsonRpcProvider(TEST_RPC_NODE) as JsonRpcProvider
  //TODO change BTC price source
  const contract = new Contract(BTC_CONTRACT, btc_price, provider as any)
  const { setIsBTCRise, BTCPrice, setBTCPrice } = useRootStore(
    (state) => ({
      setIsBTCRise: state.setIsBTCRise,
      BTCPrice: state.BTCPrice,
      setBTCPrice: state.setBTCPrice,
    }),
    shallow
  )

  return useCallback(async () => {
    try {
      if (provider) {
        const price = await contract.latestRoundData()
        const res = new BigNumber(price.answer._hex).div(new BigNumber(10).pow(8))
        if (res.isGreaterThan(BTCPrice)) setIsBTCRise(true)
        else setIsBTCRise(false)
        setBTCPrice(res)
      }
    } catch (e) {
      console.error('get BTC Price failed!', e)
      return
    }
  }, [contract, provider])
}
