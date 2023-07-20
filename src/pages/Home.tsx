/** @jsxImportSource @emotion/react */
import { LeftMenu } from '../components/Home/LeftMenu'
import { home } from '../components/Home/style'

import { Dashboard } from '../components/Home/Dashboard'

export const Home = () => {
  return (
    <div css={home}>
      <LeftMenu />
      <div className="home-content">
        <Dashboard />
      </div>
    </div>
  )
}
