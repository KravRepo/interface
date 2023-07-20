import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'ethers'
import test_erc20 from '../../abi/test_erc20.json'
import { useUpdateError } from './useUpdateError'
import { VALIDITY_ADDRESS_LENGTH } from '../../constant/math'

export const useCheckAddressValidity = () => {
  const { provider } = useWeb3React()
  const updateError = useUpdateError()
  return useCallback(
    async (tokenAddress: string) => {
      try {
        if (tokenAddress?.length !== VALIDITY_ADDRESS_LENGTH) {
          updateError('inValidity address!')
          return false
        }
        if (provider && tokenAddress?.length === VALIDITY_ADDRESS_LENGTH) {
          const tokenContract = new Contract(tokenAddress, test_erc20.abi, provider)
          await tokenContract.symbol()
          return true
        } else return false
      } catch (e) {
        updateError('inValidity address!')
        return false
      }
    },
    [provider]
  )
}
