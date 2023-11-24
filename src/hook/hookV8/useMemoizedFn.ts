import { useMemo, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'

type noop = (this: any, ...args: any[]) => any

type PickFunction<T extends noop> = (this: ThisParameterType<T>, ...args: Parameters<T>) => ReturnType<T>

function useMemoizedFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn)
  const { chainId } = useWeb3React()

  fnRef.current = useMemo(() => fn, [fn, chainId])

  const memoizedFn = useRef<PickFunction<T>>()
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args)
    }
  }

  return memoizedFn.current as T
}

export default useMemoizedFn
