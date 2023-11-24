/** @jsxImportSource @emotion/react */
import { ReactComponent as PointsLogo } from '../../assets/imgs/dashboard_logo.svg'
import { ReactComponent as PointsDarkLogo } from '../../assets/imgs/darkModel/dashboard_logo_dark.svg'
import { ReactComponent as ArrowLeft } from '../../assets/imgs/arrowLeft.svg'
import { ReactComponent as ArrowLeftDark } from '../../assets/imgs/darkModel/arrow_left_dark.svg'
import DashboardBg from '../../assets/imgs/dashboard_bg.png'
import DashboardDarkBg from '../../assets/imgs/darkModel/dashboard_bg_dark.png'
import { css } from '@emotion/react'
import { dashboard } from './style'
import { DashboardCard } from './DashboardCard'
import { useEffect, useState } from 'react'
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
import { useMediaQuery, useTheme } from '@mui/material'
import { useGetTotalMarketOverview } from '../../hook/hookV8/useGetTotalMarketOverview'
import { EarningInfoMobile } from './componets/EarningInfoMobile'

export const Dashboard = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const { account, provider } = useWeb3React()
  // const [userStake, setUserStake] = useState(new BigNumber(0))
  const [userPoolLength, setUserPoolLength] = useState(0)
  const navigate = useNavigate()
  const { getUserAllOpenTrades } = useGetUserAllOpenTrades()
  const getUserAllLimitOrders = useGetUserAllLimitOrders()
  // const { getUserStake } = useGetKravStake()
  const { userAssetOverview, getUserAssetOverview } = useGetUserAssetOverview()
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const { getOverView, overviewData } = useGetTotalMarketOverview()

  useEffect(() => {
    let interval: NodeJS.Timer
    if (account) {
      Promise.all([
        // getUserStake().then((stakeAmount) => setUserStake(eXDecimals(stakeAmount, 18))),
        getOverView().then(),
        getUserAssetOverview(),
      ]).then()
      getUserAllLimitOrders().then()
      interval = setInterval(async () => {
        await Promise.all([
          getOverView(),
          // getUserStake().then((stakeAmount) => setUserStake(eXDecimals(stakeAmount, 18))),
          getUserAssetOverview(),
        ])
        await getUserAllLimitOrders()
      }, 15000)
    }
    return () => clearInterval(interval)
  }, [account])

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
          background: url(${theme.palette.mode === 'dark' ? DashboardDarkBg : DashboardBg}), no-repeat,
            ${theme.palette.mode === 'dark' ? '#0f1114' : '#f1f1f1'};
        `}
        className="income"
      >
        <p
          css={css`
            color: ${theme.text.primary};
          `}
        >
          Earned Income
        </p>
        <p css={align}>
          <span>{formatNumber(Number(userAssetOverview?.lpRewardBalance) / API_DECIMALS, 2)}</span>
          {/*<ArrowLeft*/}
          {/*  css={css`*/}
          {/*    margin-left: 16px;*/}
          {/*  `}*/}
          {/*/>*/}
        </p>
      </div>
      <div
        css={css`
          color: ${theme.text.primary};
        `}
        className="earning"
      >
        <p className="title">Earning Information</p>
        {!isMobile && (
          <div>
            <div
              css={css`
                background: ${theme.background.primary};
              `}
            >
              <div className="provided card">
                <p
                  className="tabs"
                  css={css`
                    width: 180px;
                    color: ${theme.palette.mode === 'dark' ? theme.text.primary : '#fff'};
                    background: ${theme.palette.mode === 'dark' ? '#2832f5' : '#a4a8fe'};
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
                      border-right: ${theme.splitLine.primary};
                      border-bottom: ${isMobile ? theme.splitLine.primary : ''};
                      margin: ${isMobile ? '24px 0' : '30px 0 0 0'};
                    `}
                  />
                  <div className="my-pool">
                    <div>
                      <p>My Pool</p>
                      <p>
                        <span>{userPoolLength}</span>
                        <span>View Details</span>
                        {/*ArrowLeftDark*/}
                        {theme.palette.mode === 'dark' ? (
                          <ArrowLeftDark
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
                        ) : (
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
                        )}
                      </p>
                    </div>
                    {theme.palette.mode === 'dark' ? <PointsDarkLogo /> : <PointsLogo />}
                  </div>
                </div>
              </div>
            </div>
            <div
              css={css`
                background: ${theme.background.primary};
                border-radius: 8px;
              `}
              className="card krav"
            >
              <p
                css={css`
                  background: ${theme.palette.mode === 'dark' ? '#2832f5' : '#a4a8fe'};
                  color: ${theme.palette.mode === 'dark' ? theme.text.primary : '#fff'};
                `}
                className="tabs"
              >
                Krav Staking
              </p>
              <p>
                {getBigNumberStr(new BigNumber(0), 2)}
                <span>KRAV</span>
              </p>
              <p>
                View Details
                {theme.palette.mode === 'dark' ? (
                  <ArrowLeftDark
                    onClick={() => navigate('/portfolio/stake')}
                    css={css`
                      margin-left: 16px;
                      cursor: pointer;
                      :hover {
                        transform: scale(1.1);
                      }
                    `}
                  />
                ) : (
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
                )}
              </p>
            </div>
          </div>
        )}
        {isMobile && <EarningInfoMobile userPoolLength={userPoolLength} userAssetOverview={userAssetOverview} />}
      </div>
      <div>
        <p className="title">Trading Information</p>
        <div
          className="data"
          css={css`
            border-bottom: ${theme.splitLine.primary};
          `}
        >
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
