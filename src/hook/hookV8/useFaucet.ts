import { useCallback } from 'react'
import { useGetUserAllBalance } from './useGetBalance'
import { Contract } from 'ethers'
import test_erc20 from 'abi/test_erc20.json'
import shiBT_erc20 from 'abi/erc20.json'
import { useWeb3React } from '@web3-react/core'
import { getProviderOrSigner } from '../../utils'
export const useFaucet = () => {
  const { account, provider } = useWeb3React()
  const getBalance = useGetUserAllBalance()
  return useCallback(
    async (tokenAddress: string) => {
      try {
        if (tokenAddress === '0x1A7E2fbB3886c6E3D960f173FAcd7d3809147d75') {
          const tokenContract = new Contract(tokenAddress, shiBT_erc20, getProviderOrSigner(provider!, account))
          const faucetTx = await tokenContract.mint(account, '10000000000000000000000')
          await faucetTx.wait()
          console.log('faucetTx', faucetTx)
          await getBalance()
        } else {
          const tokenContract = new Contract(tokenAddress, test_erc20.abi, getProviderOrSigner(provider!, account))
          const faucetTx = await tokenContract.mint('10000000000000000000000', account)
          await faucetTx.wait()
          console.log('faucetTx', faucetTx)
          await getBalance()
        }
      } catch (e) {
        console.error('faucet failed!', e)
      }
    },
    [account, provider]
  )
}
