import { useEffect, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { SUPPORT_CHAIN } from '../../constant/chain'
import useMemoizedFn from './useMemoizedFn'

export const useInterval = (callback: () => Promise<any>, delay: number | undefined) => {
  const intervalRef = useRef<NodeJS.Timer | null>(null)
  const timerCallback = useMemoizedFn(callback)
  const { chainId } = useWeb3React()

  useEffect(() => {
    if (typeof delay !== 'number' || delay < 0) return
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (chainId && !SUPPORT_CHAIN.includes(chainId)) return
    try {
      // if (immd) {
      //   timerCallback().then()
      // }
      intervalRef.current = setInterval(async () => {
        await timerCallback()
      }, delay)
    } catch (e) {
      console.error(e)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [delay, timerCallback, chainId])
}
