/** @jsxImportSource @emotion/react */
import { HomeLayout } from './HomeLayout'
import { NewStake } from '../../components/Home/NewStake'
import { useWeb3React } from '@web3-react/core'
import { ChainId } from '../../constant/chain'
import { css } from '@emotion/react'
import KRAVButton from '../../components/KravUIKit/KravButton'
import { useConnect } from '../../hook/hookV8/useConnect'
const NoStake = () => {
  const changeNetwork = useConnect()
  return (
    <div
      css={css`
        min-height: calc(100vh - 324px);
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <KRAVButton
        onClick={async () => {
          await changeNetwork(ChainId.BASE)
        }}
      >
        Please change network.
      </KRAVButton>
    </div>
  )
}

export const HomeStake = () => {
  const { chainId } = useWeb3React()
  return (
    <HomeLayout>{chainId === ChainId.BASE || chainId === ChainId.BASE_TEST ? <NewStake /> : <NoStake />}</HomeLayout>
  )
}
