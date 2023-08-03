/** @jsxImportSource @emotion/react */
import { ReactComponent as PointsLogo } from '../../assets/imgs/dashboard_logo.svg'
import { ReactComponent as ArrowLeft } from '../../assets/imgs/arrowLeft.svg'
import DashboardBg from '../../assets/imgs/dashboard_bg.png'
import KRAVButton from '../KravUIKit/KravButton'
import { css } from '@emotion/react'
import { dashboard } from './style'
import { DashboardCard } from './DashboardCard'
import { useCallback, useEffect, useState } from 'react'
import { DASHBOARD_OVERVIEW_API } from '../../constant/chain'
import { formatNumber } from '../../utils'
import { useNumReferral } from '../../hook/hookV8/useNumReferral'
import { Link } from '@mui/material'
import BigNumber from 'bignumber.js'
import { ONE_DAY_TIMESTAMP } from '../../constant/math'

type OverviewData = {
  liquiditySupply: number
  orderPlacement: number
  tradingVolume: number
  tradingFrequency: number
  participation: string
}

export const Dashboard = () => {
  const [overviewData, setOverViewData] = useState<OverviewData>({} as OverviewData)
  const [numReferral, setNumReferral] = useState(0)
  useNumReferral(setNumReferral)
  const getOverView = useCallback(async () => {
    try {
      const req = await fetch(DASHBOARD_OVERVIEW_API)
      const overview = await req.json()
      const currentTime = new Date().valueOf()
      const circulationTime = new BigNumber((currentTime - Number(overview.data.createAt) * 1000) / ONE_DAY_TIMESTAMP)
      setOverViewData({
        liquiditySupply: Number(overview.data.liquiditySupply) / 100,
        orderPlacement: Number(overview.data.orderPlacement) / 100,
        tradingFrequency: overview.data.tradingFrequency,
        tradingVolume: Number(overview.data.tradingVolume) / 100,
        participation: circulationTime.toFixed(0, 0),
      })
    } catch (e) {
      console.error('get overview failed!', e)
    }
  }, [])

  useEffect(() => {
    getOverView().then()
    const interval = setInterval(async () => {
      await getOverView()
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div css={dashboard}>
      <div
        css={css`
          background: url(${DashboardBg}), no-repeat, #f1f1f1;
        `}
        className="learn-more"
      >
        <div className="learn-more-left">
          <p>Put your money to work</p>
          <p>You can earn liquidity providing rewards by depositing</p>
          {/**/}
          <Link href="https://docs.krav.trade/">
            <KRAVButton sx={{ width: '105px' }}>Learn more</KRAVButton>
          </Link>
        </div>
        <div className="learn-more-right">
          <div>
            <span className="tabs">Fee Rate</span>
          </div>
          <div className="rate">
            <span>Open</span>
            <span>0.0600%</span>
          </div>
          <div className="rate">
            <span>Close</span>
            <span>0.0600%</span>
          </div>
        </div>
      </div>
      <div className="points">
        <div>
          <p>--</p>
          <p>
            <span>POINTS EARNDED</span>
            <ArrowLeft
              css={css`
                margin-left: 8px;
              `}
            />
          </p>
        </div>
        <PointsLogo />
      </div>
      <div className="data">
        <DashboardCard title={'Order Placement'} content={`${formatNumber(overviewData.orderPlacement, 2)}`} />
        <DashboardCard title={'Liquidity Supply'} content={`${formatNumber(overviewData.liquiditySupply, 2)}`} />
        <DashboardCard title={'Trading Volume'} content={`${formatNumber(overviewData.tradingVolume, 2)}`} />
        <DashboardCard title={'Continuous Participation'} content={`${overviewData.participation} days`} />
        <DashboardCard title={'Trading Frequency'} content={`${overviewData.tradingFrequency} times`} />
        <DashboardCard title={'Referral'} content={`${numReferral} friends`} />
      </div>
    </div>
  )
}
