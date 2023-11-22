import { useCallback, useEffect, useRef } from 'react'
import BigNumber from 'bignumber.js'
import { useRootStore } from '../../store/root'
import { BTC_PRICE_API } from '../../constant/chain'
import { useWeb3React } from '@web3-react/core'

//TODO: match price with pair index
export const useBTCPrice = () => {
  const { chainId } = useWeb3React()
  const { setIsBTCRise, BTCPrice, setBTCPrice, tradePairIndex, pairConfig } = useRootStore((state) => ({
    setIsBTCRise: state.setIsBTCRise,
    BTCPrice: state.BTCPrice,
    setBTCPrice: state.setBTCPrice,
    tradePairIndex: state.tradePairIndex,
    pairConfig: state.pairConfig,
  }))
  const priceRef = useRef<NodeJS.Timer | null>(null)

  const getPrice = useCallback(async () => {
    try {
      const req = await fetch(BTC_PRICE_API + pairConfig[tradePairIndex].apiSymbol)
      const price = await req.json()
      const res = new BigNumber(price.data.price)
      if (res.isGreaterThan(BTCPrice)) setIsBTCRise(true)
      else setIsBTCRise(false)
      setBTCPrice(res)
    } catch (e) {
      console.error('get BTC Price failed!', e)
    }
  }, [tradePairIndex, pairConfig])

  useEffect(() => {
    if (priceRef.current) clearInterval(priceRef.current)
    getPrice().then()
    priceRef.current = setInterval(
      async () => {
        await getPrice()
      },
      tradePairIndex === 3 ? 6000 : 8000
    )
    return () => {
      if (priceRef.current) clearInterval(priceRef.current)
    }
  }, [getPrice, tradePairIndex, chainId])
}
