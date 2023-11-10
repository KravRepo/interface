/** @jsxImportSource @emotion/react */
import React, { useEffect, useMemo } from 'react'
import { farm } from './style'
import KRAVButton from '../KravUIKit/KravButton'
import { css } from '@emotion/react'
import { FarmItem } from './FarmItem'
import DashboardBg from '../../assets/imgs/dashboard_bg.png'
import DashboardDarkBg from '../../assets/imgs/darkModel/dashboard_bg_dark.png'
import { ReactComponent as ArrowRight } from '../../assets/imgs/arrowRight.svg'
import { useUserPosition } from '../../hook/hookV8/useUserPosition'
import { useRootStore } from '../../store/root'
import { useWeb3React } from '@web3-react/core'
import { useNavigate } from 'react-router-dom'
import { useGetApr } from '../../hook/hookV8/useGetApr'
import { useMediaQuery, useTheme } from '@mui/material'
import { useInterval } from '../../hook/hookV8/useInterval'
type DashboardFarmProps = {
  setUserPoolLength: React.Dispatch<React.SetStateAction<number>>
}

export const DashboardFarm = ({ setUserPoolLength }: DashboardFarmProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const userBackend = useUserPosition()
  const { account, provider } = useWeb3React()
  const navigate = useNavigate()
  const { aprList } = useGetApr()

  const userPositionDatas = useRootStore((store) => store.userPositionDatas)
  const setWalletDialogVisibility = useRootStore((store) => store.setWalletDialogVisibility)
  const positionDatas = useMemo(() => {
    let flag = false
    userPositionDatas.find((positionData) => {
      if (positionData?.hasPosition) flag = true
    })
    if (flag) {
      return userPositionDatas.filter((position) => position.hasPosition)
    } else return []
  }, [userPositionDatas])

  const allPoolParams = useRootStore((store) => store.allPoolParams)

  useInterval(userBackend, 60000)

  useEffect(() => {
    if (allPoolParams.length > 0 && account && provider) {
      userBackend().then()
    }
  }, [account, allPoolParams, provider])

  useEffect(() => {
    setUserPoolLength(positionDatas.length)
  }, [positionDatas])

  return (
    <div
      css={[
        farm,
        css`
          margin: 0 !important;
          min-height: 0 !important;
        `,
      ]}
    >
      <div
        className="title"
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: ${theme.text.primary};
          @media screen and (max-width: 600px) {
            display: block;
            margin-bottom: 0 !important;
            border-bottom: ${theme.splitLine.primary};
            > div {
              margin-bottom: 16px;
            }
          }
        `}
      >
        <div>My Liquidity Pools</div>
        <KRAVButton onClick={() => navigate('/liquidity')} sx={{ width: '160px' }}>
          + Provider liquidity
        </KRAVButton>
      </div>
      {positionDatas.length > 0 && (
        <div>
          {/*<div className="overview">*/}
          {/*  <div>*/}
          {/*    <span>Total Claimable Rewards</span>*/}
          {/*    <span>≈ $246,556,893.30</span>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div
            css={css` overflow: ${isMobile ? 'auto' : ''};
            &::-webkit-scrollbar {
            display: none
            },`}
          >
            <div
              css={css`
                margin-top: 24px;
              `}
              className="liquidity grey nowrap"
            >
              <span>ASSET</span>
              <span>APR</span>
              <span>UTILIZATION</span>
              <span>TOTAL LIQUIDITY SUPPLY</span>
              <span>LP REWARD</span>
              <span />
            </div>
            {positionDatas.map((position) => {
              return <FarmItem key={position.pool.tradingT} position={position} aprList={aprList} />
            })}
          </div>
        </div>
      )}
      {positionDatas.length === 0 && (
        <div
          className="no-stake"
          css={css`
            background: url(${theme.palette.mode === 'dark' ? DashboardDarkBg : DashboardBg}), no-repeat,
              ${theme.palette.mode === 'dark' ? '#0f1114' : '#f1f1f1'};
          `}
        >
          {!account && (
            <>
              <KRAVButton
                sx={{ width: '160px', mt: '32px', mb: '25px' }}
                onClick={() => setWalletDialogVisibility(true)}
              >
                Connect wallet
              </KRAVButton>
            </>
          )}
          {account && (
            <>
              <p>You have no liquidity</p>
              <KRAVButton sx={{ width: '113px', mt: '32px', mb: '25px' }} onClick={() => navigate('/liquidity')}>
                Add Liquidity
              </KRAVButton>
              <p>
                <span
                  css={css`
                    font-family: 'Inter';
                    font-size: 16px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  `}
                >
                  Learn more about Liquidity Pool&nbsp; <ArrowRight />
                </span>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
