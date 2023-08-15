import { useWeb3React } from '@web3-react/core'
import { useContract } from './useContract'
import { VE_KRAV } from '../../constant/chain'
import voting from '../../abi/voting_escrow.json'
import { useCallback } from 'react'


export const useGetUserKravLock = () => {
  const { provider, account } = useWeb3React()
  const veContract = useContract(VE_KRAV, voting.abi)
  return useCallback(async () => {
    if (provider && veContract && account) {
      try {
        const res = await veContract.locked(account)
        console.log('user locked', res)
      } catch (e) {
        console.log('get user locked position failed!', e)
      }
    }
  }, [provider, veContract, account])
}
