/** @jsxImportSource @emotion/react */
import { ReactComponent as PointsLogo } from '../../assets/imgs/dashboard_logo.svg'
import { ReactComponent as ArrowLeft } from '../../assets/imgs/arrowLeft.svg'
import DashboardBg from '../../assets/imgs/dashboard_bg.png'
import { css } from '@emotion/react'
import { dashboard } from './style'
import { DashboardCard } from './DashboardCard'
import { useCallback, useEffect, useState } from 'react'
import { DASHBOARD_OVERVIEW_API } from '../../constant/chain'
import { formatNumber } from '../../utils'
import BigNumber from 'bignumber.js'
import { ONE_DAY_TIMESTAMP } from '../../constant/math'
import { useGetUserAllOpenTrades } from '../../hook/hookV8/useGetUserAllOpenTrades'
import { align } from '../../globalStyle'
import { MyOrder } from './MyOrder'
import { useGetUserAllLimitOrders } from '../../hook/hookV8/useGetUserAllLimitOrders'
import { Farm } from './Farm'

type OverviewData = {
  liquiditySupply: number
  orderPlacement: number
  tradingVolume: number
  tradingFrequency: number
  participation: string
}

export const Dashboard = () => {
  const [overviewData, setOverViewData] = useState<OverviewData>({} as OverviewData)
  const { useAllOpenTrades } = useGetUserAllOpenTrades()
  const { useAllLimitOrders } = useGetUserAllLimitOrders()
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
        className="income"
      >
        <p>Earned Income</p>
        <p css={align}>
          <span>$606,2121</span>
          <ArrowLeft
            css={css`
              margin-left: 16px;
            `}
          />
        </p>
      </div>
      <div className="earning">
        <p className="title">Earning Information</p>
        <div>
          <div>
            <div className="provided card">
              <p
                className="tabs"
                css={css`
                  width: 180px;
                `}
              >
                Liquidity being provided
              </p>
              <div className="details">
                <div className="total">
                  <div>Total Value</div>
                  <div>$606,2121</div>
                </div>
                <div
                  css={css`
                    border-right: 1px solid;
                    margin-top: 30px;
                  `}
                />
                <div className="my-pool">
                  <div>
                    <p>My Pool</p>
                    <p>
                      <span>6</span>
                      <span>View Details</span>
                      <ArrowLeft
                        css={css`
                          margin-left: 16px;
                        `}
                      />
                    </p>
                  </div>
                  <PointsLogo />
                </div>
              </div>
            </div>
          </div>
          <div className="card krav">
            <p className="tabs">Krav Staking</p>
            <p>
              255,256<span>KRAV</span>
            </p>
            <p>
              View Details
              <ArrowLeft
                css={css`
                  margin-left: 16px;
                `}
              />
            </p>
          </div>
        </div>
      </div>
      <div>
        <p className="title">Trading Information</p>
        <div className="data">
          <DashboardCard title={'Order Placement'} content={`${formatNumber(overviewData.orderPlacement, 2)}`} />
          <DashboardCard title={'Liquidity Supply'} content={`${formatNumber(overviewData.liquiditySupply, 2)}`} />
          <DashboardCard title={'Trading Volume'} content={`${formatNumber(overviewData.tradingVolume, 2)}`} />
        </div>
      </div>
      <MyOrder useAllOpenTrades={useAllOpenTrades} useAllLimitOrders={useAllLimitOrders} />
      <Farm isDashboard={true} />
    </div>
  )
}
