import { useEffect, useState } from 'react'
import { PNL_API } from '../../constant/chain'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'

export function usePnl(kTokenAddress?: string, decimals = 18) {
  const { account } = useWeb3React()

  const [pnl, setPnl] = useState(0)
  const [tokenAmount, setTokenAmount] = useState<BigNumber>(BigNumber('0'))

  useEffect(() => {
    if (!account || !kTokenAddress) return
    const fetchPnl = async () => {
      try {
        const res = await fetch(PNL_API + `/${account}/${kTokenAddress}`)
        const r = await res.json()
        if (!r.data) throw Error('Get Pnl Error')
        setPnl(Number(r.data.PNL) * 100)
        setTokenAmount(eXDecimals(r.data.tokenAmount, decimals))
      } catch (e) {
        console.error(e)
      }
    }
    fetchPnl()
  }, [account, decimals, kTokenAddress, pnl, setPnl])

  return {
    pnl,
    tokenAmount,
  }
}
