/** @jsxImportSource @emotion/react */
import { ReactComponent as BoostIcon } from '../../../assets/imgs/boost_icon.svg'
import { ReactComponent as QuestionIcon } from '../../../assets/imgs/question.svg'
import { ReactComponent as KravToken } from '../../../assets/imgs/krav_token.svg'
import { ReactComponent as VeKravToken } from '../../../assets/imgs/ve_krav_token.svg'
import { ReactComponent as ToVoteIcon } from '../../../assets/imgs/to_vote.svg'
import KRAVButton from '../../KravUIKit/KravButton'
import KRAVHollowButton from '../../KravUIKit/KravHollowButton'
import { css, useTheme } from '@mui/material'
import { align } from '../../../globalStyle'
import { UserLockPosition } from '../../../hook/hookV8/useGetUserKravLock'
import { formatNumber } from '../../../utils'
import moment from 'moment'

type MyLockedProp = {
  userLockPosition: UserLockPosition
}

export const MyLocked = ({ userLockPosition }: MyLockedProp) => {
  const theme = useTheme()

  // useEffect(() => {
  //   const res = moment(userLockPosition.end * 1000).utc(false)
  //   console.log('utc', res)
  // }, [userLockPosition])
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
            .format('MM DD, YYYY HH:mm ')}{' '}
          UTC
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
        <div>1.5579</div>
      </div>
      <KRAVButton sx={{ mb: '32px' }}>Unlock</KRAVButton>
      <div className="title gt">My Reward</div>
      <div className="my-reward">
        <div
          css={css`
            background: ${theme.background.second};
          `}
        >
          <KravToken />
          <span>&nbsp;&nbsp;10KRAV</span>
        </div>
        <div
          css={css`
            background: ${theme.background.second};
          `}
        >
          <VeKravToken />
          <span>&nbsp;&nbsp;10veKRAV</span>
        </div>
      </div>
      <KRAVButton sx={{ mb: '12px' }}>Claim</KRAVButton>
      <KRAVHollowButton>
        To vote <ToVoteIcon />
      </KRAVHollowButton>
    </div>
  )
}
