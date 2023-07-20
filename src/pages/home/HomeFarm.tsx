/** @jsxImportSource @emotion/react */
import { home } from '../../components/Home/style'
import { LeftMenu } from '../../components/Home/LeftMenu'
import { Farm } from 'components/Home/Farm'

export const HomeFarm = () => {
  return (
    <div css={home}>
      <LeftMenu />
      <div className="home-content">
        <Farm />
      </div>
    </div>
  )
}
