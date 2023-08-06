/** @jsxImportSource @emotion/react */
import { ReactComponent as PointsLogo } from '../../assets/imgs/dashboard_logo.svg'
import { ReactComponent as ArrowLeft } from '../../assets/imgs/arrowLeft.svg'
import DashboardBg from '../../assets/imgs/dashboard_bg.png'
import { css } from '@emotion/react'
import { dashboard } from './style'
import { DashboardCard } from './DashboardCard'
import { useCallback, useEffect, useState } from 'react'
import { DASHBOARD_OVERVIEW_API } from '../../constant/chain'
import { formatNumber, getBigNumberStr } from '../../utils'
import { useGetUserAllOpenTrades } from '../../hook/hookV8/useGetUserAllOpenTrades'
import { MyOrder } from './MyOrder'
import { align } from '../../globalStyle'
import { useRootStore } from '../../store/root'
import { useWeb3React } from '@web3-react/core'
// import BigNumber from 'bignumber.js'
// import { useGetKravStake } from '../../hook/hookV8/useGetKravStake'
// import { eXDecimals } from '../../utils/math'
import { useGetUserAssetOverview } from '../../hook/hookV8/useGetUserAssetOverview'
import BigNumber from 'bignumber.js'
import { useGetUserAllLimitOrders } from '../../hook/hookV8/useGetUserAllLimitOrders'
import { DashboardFarm } from './DashboardFarm'
import { useNavigate } from 'react-router-dom'
import { API_DECIMALS } from '../../constant/math'

type OverviewData = {
  liquiditySupply: number
  orderPlacement: number
  tradingVolume: number
  tradingFrequency: number
}

export const Dashboard = () => {
  const { account, provider } = useWeb3React()
  const [overviewData, setOverViewData] = useState<OverviewData>({} as OverviewData)
  // const [userStake, setUserStake] = useState(new BigNumber(0))
  const [userPoolLength, setUserPoolLength] = useState(0)
  const navigate = useNavigate()
  const { getUserAllOpenTrades } = useGetUserAllOpenTrades()
  const getUserAllLimitOrders = useGetUserAllLimitOrders()
  // const { getUserStake } = useGetKravStake()
  const { userAssetOverview, getUserAssetOverview } = useGetUserAssetOverview()
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const getOverView = useCallback(async () => {
    try {
      const req = await fetch(DASHBOARD_OVERVIEW_API)
      const overview = await req.json()
      setOverViewData({
        liquiditySupply: Number(overview.data.liquiditySupply) / API_DECIMALS,
        orderPlacement: Number(overview.data.orderPlacement) / API_DECIMALS,
        tradingFrequency: overview.data.tradingFrequency,
        tradingVolume: Number(overview.data.tradingVolume) / API_DECIMALS,
      })
    } catch (e) {
      console.error('get overview failed!', e)
    }
  }, [])

  useEffect(() => {
    Promise.all([
      // getUserStake().then((stakeAmount) => setUserStake(eXDecimals(stakeAmount, 18))),
      getOverView().then(),
      getUserAssetOverview(),
      getUserAllLimitOrders(),
    ]).then()
    const interval = setInterval(async () => {
      await Promise.all([
        getOverView(),
        // getUserStake().then((stakeAmount) => setUserStake(eXDecimals(stakeAmount, 18))),
        getUserAssetOverview(),
        getUserAllLimitOrders(),
      ])
    }, 15000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timer
    if (allPoolParams.length > 0 && account && provider) {
      getUserAllOpenTrades().then()
      interval = setInterval(async () => {
        getUserAllOpenTrades().then(() => console.log())
      }, 10000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [allPoolParams, account, provider])

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
          <span>{formatNumber(Number(userAssetOverview?.lpRewardBalance) / API_DECIMALS, 2)}</span>
          {/*<ArrowLeft*/}
          {/*  css={css`*/}
          {/*    margin-left: 16px;*/}
          {/*  `}*/}
          {/*/>*/}
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
                  <div>{formatNumber(Number(userAssetOverview?.balance) / API_DECIMALS, 2)}</div>
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
                      <span>{userPoolLength}</span>
                      <span>View Details</span>
                      <ArrowLeft
                        onClick={() => navigate('/liquidity')}
                        className="poolArrow"
                        css={css`
                          cursor: pointer;
                          margin-left: 16px;
                          :hover {
                            transform: scale(1.1);
                          }
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
              {getBigNumberStr(new BigNumber(0), 2)}
              <span>KRAV</span>
            </p>
            <p>
              View Details
              <ArrowLeft
                onClick={() => navigate('/portfolio/stake')}
                css={css`
                  margin-left: 16px;
                  cursor: pointer;
                  :hover {
                    transform: scale(1.1);
                  }
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
      <MyOrder />
      <DashboardFarm setUserPoolLength={setUserPoolLength} />
    </div>
  )
}
