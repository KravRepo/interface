import { useWeb3React } from '@web3-react/core'
import { useContract, useTokenContract } from './useContract'
import { KRAV_ADDRESS, VE_KRAV } from '../../constant/chain'
import voting from '../../abi/voting_escrow.json'
import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'
// import { useGetClaimableTokensFee } from './useGetClaimableTokensFee'
import { useRootStore } from '../../store/root'
import { useUpdateError } from './useUpdateError'
import { useUpdateSuccessDialog } from './useUpdateSuccessDialog'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
export type UserLockPosition = {
  amount: BigNumber
  end: number
}

export const useGetUserKravLock = () => {
  const { provider, account } = useWeb3React()
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const [userKravBalance, setUserKravBalance] = useState(new BigNumber(0))
  const [totalKravLock, setTotalKravLock] = useState(new BigNumber(0))
  const [userVeKravAmount, setUserVeKravAmount] = useState(new BigNumber(0))
  const [totalVeKravAmount, setTotalVeKravAmount] = useState(new BigNumber(0))
  // const { getUserFeesReward, userFeesRewardList } = useGetClaimableTokensFee()
  const [userLockPosition, setUserLockPosition] = useState<UserLockPosition>({
    amount: new BigNumber(0),
    end: 0,
  })
  const updateError = useUpdateError()
  const updateSuccessDialog = useUpdateSuccessDialog()
  const setTransactionState = useRootStore((store) => store.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((state) => state.setSuccessSnackbarInfo)

  const veContract = useContract(VE_KRAV, voting.abi)
  const kravTokenContract = useTokenContract(KRAV_ADDRESS)
  const getUserKravLock = useCallback(async () => {
    if (provider && veContract && account && kravTokenContract) {
      try {
        const res = await Promise.all([
          kravTokenContract.balanceOf(account),
          veContract.locked(account),
          veContract.balanceOf(account),
          veContract.totalSupply(),
        ])
        const balance = new BigNumber(res[0]._hex).toString()
        setUserKravBalance(eXDecimals(balance, 18))
        setUserLockPosition({
          amount: eXDecimals(new BigNumber(res[1].amount._hex), 18),
          end: new BigNumber(res[1].end._hex).toNumber(),
        })
        setUserVeKravAmount(eXDecimals(new BigNumber(res[2]._hex), 18))
        setTotalVeKravAmount(eXDecimals(new BigNumber(res[3]._hex), 18))
      } catch (e) {
        console.log('get user locked position failed!', e)
      }
    }
  }, [provider, veContract, account, kravTokenContract])
  const getTotalLock = useCallback(async () => {
    if (veContract) {
      try {
        const res = await veContract.supply()
        setTotalKravLock(eXDecimals(new BigNumber(res._hex), 18))
      } catch (e) {
        console.log('get total lock failed!', e)
      }
    }
  }, [veContract])
  const unLockPosition = useCallback(async () => {
    if (veContract) {
      try {
        setTransactionState(TransactionState.INTERACTION)
        setTransactionDialogVisibility(true)
        const tx = await veContract.withdraw()
        setTransactionState(TransactionState.UNLOCK)
        await tx.wait()
        setTransactionState(TransactionState.START)
        updateSuccessDialog(TransactionAction.UNLOCK)
        setSuccessSnackbarInfo({
          snackbarVisibility: true,
          title: 'Unlock',
          content: 'Unlocked successfully',
        })
      } catch (e) {
        updateError(TransactionAction.UNLOCK)
      }
    }
  }, [veContract])
  useEffect(() => {
    let Interval: NodeJS.Timer
    if (account && provider && allPoolParams.length > 0) {
      Promise.all([getUserKravLock(), getTotalLock()]).then()

      Interval = setInterval(async () => {
        await Promise.all([getUserKravLock(), getTotalLock()])
      }, 15000)
    }
    return () => {
      if (Interval) clearInterval(Interval)
    }
  }, [provider, account, allPoolParams])

  return {
    userKravBalance: userKravBalance,
    userLockPosition: userLockPosition,
    // userFeesRewardList: userFeesRewardList,
    totalKravLock: totalKravLock,
    userVeKravAmount: userVeKravAmount,
    totalVeKravAmount: totalVeKravAmount,
    unLockPosition: unLockPosition,
  }
}
