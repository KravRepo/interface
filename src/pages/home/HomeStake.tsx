/** @jsxImportSource @emotion/react */
// import { Stake } from 'components/Home/Stake'
import { HomeLayout } from './HomeLayout'
import { ComingSoon } from '../../components/Home/ComingSoon'

export const HomeStake = () => {
  return (
    <HomeLayout>
      <ComingSoon title={'My Stake'} />
      {/*<Stake />*/}
    </HomeLayout>
  )
}
