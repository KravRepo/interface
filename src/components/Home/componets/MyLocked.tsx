/** @jsxImportSource @emotion/react */
import { ReactComponent as BoostIcon } from '../../../assets/imgs/krav_token.svg'
import { ReactComponent as QuestionIcon } from '../../../assets/imgs/question.svg'
import { ReactComponent as KravToken } from '../../../assets/imgs/krav_token.svg'
import { ReactComponent as VeKravToken } from '../../../assets/imgs/ve_krav_token.svg'
import { ReactComponent as ToVoteIcon } from '../../../assets/imgs/to_vote.svg'
import KRAVButton from '../../KravUIKit/KravButton'
import KRAVHollowButton from '../../KravUIKit/KravHollowButton'

export const MyLocked = () => {
  return (
    <div>
      <p className="title gt">My Locked</p>
      <div>
        The longer you lock your KRAV, the more veKRAV you will receive. You can also get additional veKRAV by locking
        more KRAV or extending the lock period. veKRAV decays slowly over your locking period, eventually reaching
        1-to-1 with KRAV.
      </div>
      <div>
        <span>Locked amount</span>
        <span>235 KRAV</span>
      </div>
      <div>
        <span>Locked until</span>
        <span>Sep 21, 2021 08:30 AM UTC </span>
      </div>
      <div>
        <div>
          <BoostIcon />
          <span>My current boost :</span>
          <QuestionIcon />
        </div>
        <div>1.5579</div>
      </div>
      <KRAVButton>Unlock</KRAVButton>
      <div>My Reward</div>
      <div>
        <div>
          <KravToken />
          <span>10KRAV</span>
        </div>
        <div>
          <VeKravToken />
          <span>10veKRAV</span>
        </div>
      </div>
      <KRAVButton>Claim</KRAVButton>
      <KRAVHollowButton>
        To vote <ToVoteIcon />
      </KRAVHollowButton>
    </div>
  )
}
