/** @jsxImportSource @emotion/react */
import { ReactComponent as PointsLogo } from '../../assets/imgs/dashboard_logo.svg'
import { ReactComponent as ArrowLeft } from '../../assets/imgs/arrowLeft.svg'
import DashboardBg from '../../assets/imgs/dashboard_bg.png'
import KRAVButton from '../KravUIKit/KravButton'
import { css } from '@emotion/react'
import { dashboard } from './style'
import { DashboardCard } from './DashboardCard'

export const Dashboard = () => {
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
          <KRAVButton sx={{ width: '105px' }}>Learn more</KRAVButton>
        </div>
        <div className="learn-more-right">
          <div>
            <span className="tabs">Fee Rate</span>
          </div>
          <div className="rate">
            <span>Open</span>
            <span>0.300%</span>
          </div>
          <div className="rate">
            <span>Close</span>
            <span>0.600%</span>
          </div>
        </div>
      </div>
      <div className="points">
        <div>
          <p>1200</p>
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
        <DashboardCard title={'Order Placement'} content={'$606,2121'} />
        <DashboardCard title={'Liquidity Supply'} content={'$606,2121'} />
        <DashboardCard title={'Trading Volume'} content={'$898,2121,211'} />
        <DashboardCard title={'Continuous Participation'} content={'200 days'} />
        <DashboardCard title={'Trading Frequency'} content={'200 times'} />
        <DashboardCard title={'Referral'} content={'2 friends'} />
      </div>
    </div>
  )
}
