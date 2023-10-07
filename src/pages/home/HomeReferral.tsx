/** @jsxImportSource @emotion/react */
// import { Referral } from '../../components/Home/Referral'
import { HomeLayout } from './HomeLayout'
// import { ComingSoon } from '../../components/Home/ComingSoon'
import { Referral } from '../../components/Home/Referral'

export const HomeReferral = () => {
  return (
    <HomeLayout>
      <Referral />
      {/*<ComingSoon title={'Referral'} />*/}
    </HomeLayout>
  )
}
