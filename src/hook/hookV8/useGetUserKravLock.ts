import { useWeb3React } from '@web3-react/core'
import { useContract, useTokenContract } from './useContract'
import { KRAV_ADDRESS, VE_KRAV } from '../../constant/chain'
import voting from '../../abi/voting_escrow.json'
import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'
export type UserLockPosition = {
  amount: BigNumber
  end: number
}

export const useGetUserKravLock = () => {
  const { provider, account } = useWeb3React()
  const [userKravBalance, setUserKravBalance] = useState(new BigNumber(0))
  const [userLockPosition, setUserLockPosition] = useState<UserLockPosition>({
    amount: new BigNumber(0),
    end: 0,
  })

  const veContract = useContract(VE_KRAV, voting.abi)
  const kravTokenContract = useTokenContract(KRAV_ADDRESS)
  const getUserKravLock = useCallback(async () => {
    if (provider && veContract && account && kravTokenContract) {
      try {
        const res = await Promise.all([kravTokenContract.balanceOf(account), veContract.locked(account)])
        const balance = new BigNumber(res[0]._hex).toString()
        setUserKravBalance(eXDecimals(balance, 18))
        console.log('user locked', res[1])
        setUserLockPosition({
          amount: eXDecimals(new BigNumber(res[1].amount._hex), 18),
          end: new BigNumber(res[1].end._hex).toNumber(),
        })
      } catch (e) {
        console.log('get user locked position failed!', e)
      }
    }
  }, [provider, veContract, account, kravTokenContract])

  useEffect(() => {
    let Interval: NodeJS.Timer
    if (account && provider) {
      getUserKravLock().then()
      Interval = setInterval(async () => {
        await getUserKravLock()
      }, 15000)
    }
    return () => {
      if (Interval) clearInterval(Interval)
    }
  }, [provider, veContract, account, kravTokenContract])

  return {
    userKravBalance: userKravBalance,
    userLockPosition: userLockPosition,
  }
}
