import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useRootStore } from '../../store/root'
import { shallow } from 'zustand/shallow'
import { BTC_PRICE_API } from '../../constant/chain'

export const useBTCPrice = () => {
  // const provider = new ethers.providers.JsonRpcProvider(TEST_RPC_NODE) as JsonRpcProvider
  // //TODO change BTC price source
  // const contract = new Contract(BTC_CONTRACT, btc_price, provider as any)
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
      const req = await fetch(BTC_PRICE_API)
      const price = await req.json()
      const res = new BigNumber(price.data.price)
      if (res.isGreaterThan(BTCPrice)) setIsBTCRise(true)
      else setIsBTCRise(false)
      setBTCPrice(res)
    } catch (e) {
      console.error('get BTC Price failed!', e)
      return
    }
  }, [])
}
