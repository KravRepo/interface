/** @jsxImportSource @emotion/react */
import { home } from '../../components/Home/style'
import { LeftMenu } from '../../components/Home/LeftMenu'
import { Stake } from 'components/Home/Stake'

export const HomeStake = () => {
  return (
    <div css={home}>
      <LeftMenu />
      <div className="home-content">
        <Stake />
      </div>
    </div>
  )
}
