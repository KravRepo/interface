/** @jsxImportSource @emotion/react */
import { home } from '../../components/Home/style'
import { LeftMenu } from '../../components/Home/LeftMenu'

export const HomeLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <div css={home}>
      <LeftMenu />
      <div className="home-content">{children}</div>
    </div>
  )
}
