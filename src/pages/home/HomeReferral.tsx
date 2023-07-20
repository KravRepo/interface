/** @jsxImportSource @emotion/react */
import { home } from '../../components/Home/style'
import { LeftMenu } from '../../components/Home/LeftMenu'
import { Referral } from 'components/Home/Referral'

export const HomeReferral = () => {
  return (
    <div css={home}>
      <LeftMenu />
      <div className="home-content">
        <Referral />
      </div>
    </div>
  )
}
