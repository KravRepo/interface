/** @jsxImportSource @emotion/react */
// import { Referral } from '../../components/Home/Referral'
import { HomeLayout } from './HomeLayout'
import { ComingSoon } from '../../components/Home/ComingSoon'

export const HomeReferral = () => {
  return (
    <HomeLayout>
      {/*<Referral />*/}
      <ComingSoon title={'Referral'} />
    </HomeLayout>
  )
}
