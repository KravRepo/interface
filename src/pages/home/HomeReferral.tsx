/** @jsxImportSource @emotion/react */
// import { Referral } from '../../components/Home/Referral'
import { HomeLayout } from './HomeLayout'
import { ComingSoon } from '../../components/Home/ComingSoon'
import { Referral } from '../../components/Home/Referral'
import { useRootStore } from '../../store/root'
import { ChainId } from '../../constant/chain'

export const HomeReferral = () => {
  const expectChainId = useRootStore((store) => store.expectChainId)
  return (
    <HomeLayout>
      <>
        {expectChainId === ChainId.MAINNET && <ComingSoon title={'Referral'} />}
        {expectChainId !== ChainId.MAINNET && <Referral />}
      </>
    </HomeLayout>
  )
}
