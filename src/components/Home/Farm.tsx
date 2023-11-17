/** @jsxImportSource @emotion/react */
import { useEffect, useMemo } from 'react'
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

export const Farm = () => {
  const theme = useTheme()
  const userBackend = useUserPosition()
  const { account, provider } = useWeb3React()
  const navigate = useNavigate()
  const { aprList } = useGetApr()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

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
  useEffect(() => {
    let backInterval: NodeJS.Timer
    if (allPoolParams.length > 0 && account && provider) {
      backInterval = setInterval(() => {
        userBackend().then()
      }, 10000)
    }
    return () => {
      if (backInterval) clearInterval(backInterval)
    }
  }, [account, allPoolParams, provider])

  return (
    <div css={farm}>
      <div
        className="title"
        css={css`
          color: ${theme.text.primary};
        `}
      >
        My Liquidity Pools
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
              {/*<span>PER TICKET SIZE</span>*/}
              <span>APR</span>
              <span>UTILIZATION</span>
              <span>YOUR LIQUIDITY SUPPLY</span>
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
            <div
              css={css`
                color: ${theme.text.primary};
              `}
            >
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
                    > svg > path {
                      fill: ${theme.text.primary};
                    }
                  `}
                >
                  Learn more about Liquidity Pools&nbsp; <ArrowRight />
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
