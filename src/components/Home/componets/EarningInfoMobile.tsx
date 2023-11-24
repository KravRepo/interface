/** @jsxImportSource @emotion/react */
import { ReactComponent as ArrowLeftDark } from '../../../assets/imgs/darkModel/arrow_left_dark.svg'
import { css } from '@emotion/react'
import { ReactComponent as ArrowLeft } from '../../../assets/imgs/arrowLeft.svg'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material'
import { ReactComponent as PointsDarkLogo } from '../../../assets/imgs/darkModel/dashboard_logo_dark.svg'
import { ReactComponent as PointsLogo } from '../../../assets/imgs/dashboard_logo.svg'
import { formatNumber } from '../../../utils'
import { API_DECIMALS } from '../../../constant/math'
import { UserAssetOverview } from '../../../hook/hookV8/useGetUserAssetOverview'

export const EarningInfoMobile = ({
  userPoolLength,
  userAssetOverview,
}: {
  userPoolLength: number
  userAssetOverview: UserAssetOverview
}) => {
  const theme = useTheme()
  const navigate = useNavigate()
  return (
    <div
      css={css`
        display: block !important;
        background: ${theme.background.primary};
        padding: 16px 24px;
      `}
      className="card"
    >
      <p
        className="tabs"
        css={css`
          background: ${theme.palette.mode === 'dark' ? '#2832f5' : '#a4a8fe'};
          width: 180px;
          margin-bottom: 18px;
          color: #fff;
        `}
      >
        Liquidity being provided
      </p>
      <div>
        <div
          css={css`
            border-bottom: ${theme.splitLine.primary};
          `}
        >
          <p>Total Value</p>
          <p
            css={css`
              padding-bottom: 24px;
              padding-top: 8px;
              font-family: 'GT-Flexa-Bold-Trial';
              font-size: 40px;
              font-style: normal;
              font-weight: 900;
              line-height: 110%;
              letter-spacing: 0.8px;
            `}
          >
            {formatNumber(Number(userAssetOverview?.balance) / API_DECIMALS, 2)}
          </p>
        </div>
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 24px;
          `}
          className="my-pool"
        >
          <div
            css={css`
              padding: 0 !important;
            `}
          >
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
  )
}
