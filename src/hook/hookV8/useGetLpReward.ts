import { useContract } from './useContract'
import trading_vault from '../../abi/trading_vault_v5.json'
import { useWeb3React } from '@web3-react/core'
import React, { Dispatch, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'

export const useGetLpReward = (vaultAddress: string, decimals: number) => {
  const { account } = useWeb3React()
  const vaultContract = useContract(vaultAddress, trading_vault.abi)
  return useCallback(
    async (setLpReward: Dispatch<React.SetStateAction<BigNumber>>) => {
      try {
        if (vaultContract) {
          const test = await vaultContract.pendingRewardDai.call({
            from: account,
          })
          setLpReward(eXDecimals(new BigNumber(test._hex), decimals))
        }
      } catch (e) {
        console.error('get lp reward failed!', e)
      }
    },
    [account, vaultContract]
  )
}
