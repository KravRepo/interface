import { useWeb3React } from '@web3-react/core'
import { useContract } from './useContract'
import trading_vault from '../../abi/trading_vault_v5.json'
import { useCallback } from 'react'
import { useUpdateError } from './useUpdateError'

export const useHarvestLpReward = (vaultAddress: string) => {
  const { account } = useWeb3React()
  const vaultContract = useContract(vaultAddress, trading_vault.abi)
  const updateError = useUpdateError()
  return useCallback(async () => {
    try {
      if (vaultContract) {
        await vaultContract.harvest()
      }
    } catch (e) {
      updateError(e)
    }
  }, [account, vaultContract])
}
