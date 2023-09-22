/** @jsxImportSource @emotion/react */
// import { NewFarm } from '../../components/Home/NewFarm'
import { HomeLayout } from './HomeLayout'
import { Farm } from '../../components/Home/Farm'

export const HomeFarm = () => {
  return (
    <HomeLayout>
      <Farm />
      {/*<NewFarm />*/}
    </HomeLayout>
  )
}
