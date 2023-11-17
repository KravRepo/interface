/** @jsxImportSource @emotion/react */
import { Farm } from '../../components/Home/Farm'
import { NewFarm } from '../../components/Home/NewFarm'
import { HomeLayout } from './HomeLayout'
import { useWeb3React } from '@web3-react/core'
import { ChainId } from '../../constant/chain'

export const HomeFarm = () => {
  const { chainId } = useWeb3React()
  return (
    <HomeLayout>
      <>
        {chainId === ChainId.BASE_TEST && <NewFarm />}
        {chainId !== ChainId.BASE_TEST && <Farm />}
      </>
    </HomeLayout>
  )
}
