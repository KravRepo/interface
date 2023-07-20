import { useCallback, useLayoutEffect, useRef } from 'react'

export default function useEvent(handler: any) {
  const handlerRef = useRef(null)

  useLayoutEffect(() => {
    handlerRef.current = handler
  })

  return useCallback((...args: any[]) => {
    const fn = handlerRef.current
    // @ts-ignore
    return fn(...args)
  }, [])
}
