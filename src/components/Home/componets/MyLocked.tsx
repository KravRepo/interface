/** @jsxImportSource @emotion/react */
import { ReactComponent as BoostIcon } from '../../../assets/imgs/boost_icon.svg'
import { ReactComponent as QuestionIcon } from '../../../assets/imgs/question.svg'
import { ReactComponent as ToVoteIcon } from '../../../assets/imgs/to_vote.svg'
import KRAVButton from '../../KravUIKit/KravButton'
import KRAVHollowButton from '../../KravUIKit/KravHollowButton'
import { css, useTheme } from '@mui/material'
import { align } from '../../../globalStyle'
import { UserLockPosition } from '../../../hook/hookV8/useGetUserKravLock'
import { formatNumber, getBigNumberStr } from '../../../utils'
import moment from 'moment'
import { FeesRewardList } from '../../../hook/hookV8/useGetClaimableTokensFee'
import { useMemo } from 'react'
import { useClaimFeesReward } from '../../../hook/hookV8/useClaimFeesReward'
import BigNumber from 'bignumber.js'

type MyLockedProp = {
  userLockPosition: UserLockPosition
  userFeesRewardList: FeesRewardList[]
  currentUserBooster: BigNumber
}

export const MyLocked = ({ userLockPosition, userFeesRewardList, currentUserBooster }: MyLockedProp) => {
  const theme = useTheme()
  const claimFeesReward = useClaimFeesReward()

  const unlockButtonEnable = useMemo(() => {
    const nowTimestamp = Number((new Date().getTime() / 1000).toFixed(0))
    if (!userLockPosition) return false
    if (userLockPosition.end > nowTimestamp) return false
    return true
  }, [userLockPosition])

  const claimButtonEnable = useMemo(() => {
    let enable = false
    userFeesRewardList.forEach((list) => {
      if (list.amount.isGreaterThan(0)) enable = true
    })
    return enable
  }, [userFeesRewardList])

  return (
    <div>
      <p className="title gt">My Locked</p>
      <div
        css={css`
          padding: 24px 0 42px;
        `}
      >
        The longer you lock your KRAV, the more veKRAV you will receive. You can also get additional veKRAV by locking
        more KRAV or extending the lock period. veKRAV decays slowly over your locking period, eventually reaching
        1-to-1 with KRAV.
      </div>
      <div className="overview">
        <span>Locked amount</span>
        <span>{formatNumber(userLockPosition.amount.toString(), 2, false)} KRAV</span>
      </div>
      <div className="overview">
        <span>Locked until</span>
        <span>
          {moment(userLockPosition.end * 1000)
            .utc()
            .format('MMM DD, YYYY HH:mm A')}{' '}
          &nbsp;UTC
        </span>
        {/*<span>Sep 21, 2021 08:30 AM UTC </span>*/}
      </div>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        `}
      >
        <div css={align}>
          <BoostIcon />
          <span>&nbsp;My current boost :&nbsp;</span>
          <QuestionIcon />
        </div>
        <div>{getBigNumberStr(currentUserBooster, 4)}</div>
      </div>
      <KRAVButton disabled={!unlockButtonEnable} sx={{ mb: '32px' }}>
        Unlock
      </KRAVButton>
      <div className="title gt">My Reward</div>
      <div className="my-reward">
        {userFeesRewardList.map((item) => {
          return (
            <div
              key={item.pool.tradingT}
              css={css`
                background: ${theme.background.second};
              `}
            >
              <img
                css={css`
                  border-radius: 50%;
                  background: ${theme.palette.mode === 'dark' ? '#fff' : ''};
                `}
                src={item?.pool?.logoSource}
                height="40"
                width="40"
              />
              <span>
                &nbsp;&nbsp;{getBigNumberStr(item.amount, 2)} {item.pool.symbol}
              </span>
            </div>
          )
        })}
      </div>
      <KRAVButton
        disabled={!claimButtonEnable}
        onClick={async () => {
          await claimFeesReward(userFeesRewardList)
        }}
        sx={{ mb: '12px' }}
      >
        Claim
      </KRAVButton>
      <KRAVHollowButton>
        To vote <ToVoteIcon />
      </KRAVHollowButton>
    </div>
  )
}
