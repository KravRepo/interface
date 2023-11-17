import { useFactoryWithProvider } from './useContract'
import { useWeb3React } from '@web3-react/core'
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'
import BigNumber from 'bignumber.js'

export const useNumReferral = (setNumReferral: Dispatch<SetStateAction<number>>) => {
  const { account, provider } = useWeb3React()
  const factory = useFactoryWithProvider(provider)

  const getNumReferral = useCallback(async () => {
    if (factory && account) {
      try {
        const res = await factory.numReferral(account)
        setNumReferral(new BigNumber(res._hex).toNumber())
      } catch (e) {}
    }
  }, [account, factory])

  useEffect(() => {
    getNumReferral().then()
  }, [account, factory])
}
