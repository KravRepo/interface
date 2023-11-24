/** @jsxImportSource @emotion/react */
import { ReactComponent as ToVoteIcon } from '../../../assets/imgs/to_vote.svg'
import KRAVButton from '../../KravUIKit/KravButton'
import KravButtonHollow from '../../KravUIKit/KravButtonHollow'
import { css, Link, Tooltip, useTheme } from '@mui/material'
import { UserLockPosition } from '../../../hook/hookV8/useGetUserKravLock'
import { formatNumber, getBigNumberStr } from '../../../utils'
import moment from 'moment'
import { FeesRewardList } from '../../../hook/hookV8/useGetClaimableTokensFee'
import { useMemo } from 'react'
import { useClaimFeesReward } from '../../../hook/hookV8/useClaimFeesReward'
import BigNumber from 'bignumber.js'
import { align } from '../../../globalStyle'
import { ReactComponent as QuestionIcon } from '../../../assets/imgs/question.svg'
import { ReactComponent as BoostIcon } from '../../../assets/imgs/boost_icon.svg'

type MyLockedProp = {
  userLockPosition: UserLockPosition
  userFeesRewardList: FeesRewardList[]
  LpBooster: BigNumber
  tradeBooster: BigNumber
}

export const MyLocked = ({ userLockPosition, userFeesRewardList, LpBooster, tradeBooster }: MyLockedProp) => {
  const theme = useTheme()
  const claimFeesReward = useClaimFeesReward()
  const unlockButtonEnable = useMemo(() => {
    const nowTimestamp = Number((new Date().getTime() / 1000).toFixed(0))
    if (!userLockPosition) return false
    if (userLockPosition.amount.isEqualTo(0)) return false
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
      <p className="title gt">My Locked Amount</p>
      <div
        css={css`
          padding: 24px 0 42px;
        `}
      >
        Maximize your rewards by extending your KRAV lock duration. Amplify veKRAV accumulation by increasing the locked
        amount or period. Keep in mind, veKRAV decays slowly over time, eventually equating to KRAV.
      </div>
      <div className="overview">
        <span>Locked amount</span>
        <span>{formatNumber(userLockPosition.amount.toNumber(), 2, false)} KRAV</span>
      </div>
      <div className="overview">
        <span>Locked until</span>
        <span>
          {userLockPosition.end === 0
            ? '--'
            : moment(userLockPosition.end * 1000)
                .utc()
                .format('MMM DD, YYYY HH:mm A')}
          &nbsp;UTC
        </span>
      </div>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        `}
      >
        <Tooltip
          title={
            'Locking KRAV can get krav income and veKRAV rights and interests, which can Boost your yield up to 2.5x'
          }
        >
          <div css={align}>
            <BoostIcon />
            <span>&nbsp;My current trade boost :&nbsp;</span>
            <QuestionIcon />
          </div>
        </Tooltip>

        <div>{getBigNumberStr(tradeBooster, 4)}</div>
      </div>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        `}
      >
        <Tooltip
          title={
            'Locking KRAV can get krav income and veKRAV rights and interests, which can Boost your yield up to 2.5x'
          }
        >
          <div css={align}>
            <BoostIcon />
            <span>&nbsp;My current Liquidity Provider boost :&nbsp;</span>
            <QuestionIcon />
          </div>
        </Tooltip>
        <div>{getBigNumberStr(LpBooster, 4)}</div>
      </div>
      <KRAVButton disabled={!unlockButtonEnable} sx={{ mb: '32px' }}>
        Unlock
      </KRAVButton>
      <div className="title gt">My Rewards</div>
      <div className="my-reward">
        {userFeesRewardList.map((item, index) => {
          return (
            <div
              key={index}
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
                &nbsp;&nbsp;{getBigNumberStr(item.amount, 2)} {item?.pool?.symbol}
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
      <Link underline="none" sx={{ color: theme.text.primary }} href="https://snapshot.org/#/krav.eth">
        <KravButtonHollow>
          To Vote <ToVoteIcon />
        </KravButtonHollow>
      </Link>
    </div>
  )
}
