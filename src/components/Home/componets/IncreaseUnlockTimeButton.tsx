import KRAVButton from '../../KravUIKit/KravButton'
import { addDecimals } from '../../../utils/math'
import BigNumber from 'bignumber.js'
import { useAddUnlockTime } from '../../../hook/hookV8/useAddUnlockTime'
import { useCallback, useMemo } from 'react'
import { useAddLockAmount } from '../../../hook/hookV8/useAddLockAmount'
import { getLockTime } from '../../../hook/hookV8/utils/utils'
import { ONE_WEEK_TIMESTAMP } from '../../../constant/math'

type IncreaseUnlockTimeButtonProps = {
  lockAmount: BigNumber
  lockTime: number
  userPositionUnLockTime: number
  userKravBalance: BigNumber
}

export const IncreaseUnlockTimeButton = ({
  lockAmount,
  lockTime,
  userPositionUnLockTime,
  userKravBalance,
}: IncreaseUnlockTimeButtonProps) => {
  const addUnlockTime = useAddUnlockTime()
  const addLockAmount = useAddLockAmount()

  const unlockAble = useMemo(() => {
    const nowTimestamp = Number((new Date().getTime() / 1000).toFixed(0))
    const forMatterTime = getLockTime(lockTime) / 1000
    return nowTimestamp + forMatterTime - ONE_WEEK_TIMESTAMP / 1000 > userPositionUnLockTime
  }, [userPositionUnLockTime, lockTime])

  const updatePosition = useCallback(async () => {
    if (lockAmount.isGreaterThan(0)) {
      await addLockAmount(addDecimals(lockAmount, 18))
    }
    await addUnlockTime(lockTime)
  }, [lockAmount, lockTime, userPositionUnLockTime])

  return (
    <KRAVButton
      disabled={!unlockAble || lockAmount.isGreaterThan(userKravBalance)}
      onClick={() => updatePosition().then()}
      sx={{ mt: '20px' }}
    >
      Lock & Mint
    </KRAVButton>
  )
}