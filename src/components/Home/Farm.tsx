/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useState } from 'react'
import { stake } from './style'
import KRAVButton from '../KravUIKit/KravButton'
import { css } from '@emotion/react'
import { FarmItem } from './FarmItem'
import DashboardBg from '../../assets/imgs/dashboard_bg.png'
import { ReactComponent as ArrowRight } from '../../assets/imgs/arrowRight.svg'
import { useUserPosition } from '../../hook/hookV8/useUserPosition'
import { useRootStore } from '../../store/root'
import { useWeb3React } from '@web3-react/core'
import { useNavigate } from 'react-router-dom'

/** @jsxImportSource @emotion/react */
export const Farm = () => {
  const [hasLiquidity, setHasLiquidity] = useState(true)
  const userBackend = useUserPosition()
  const { account, provider } = useWeb3React()
  const navigate = useNavigate()

  const userPositionDatas = useRootStore((store) => store.userPositionDatas)

  const positionDatas = useMemo(() => {
    let flag = false
    userPositionDatas.find((positionData) => {
      if (positionData?.hasPosition) flag = true
    })
    if (flag) return userPositionDatas.filter((position) => position.hasPosition)
    else return []
  }, [userPositionDatas])

  const allPoolParams = useRootStore((store) => store.allPoolParams)
  useEffect(() => {
    let backInterval: NodeJS.Timer
    if (allPoolParams.length > 0 && account && provider) {
      backInterval = setInterval(() => {
        userBackend().then()
      }, 1000)
    }
    return () => {
      if (backInterval) clearInterval(backInterval)
    }
  }, [account, allPoolParams, provider])

  return (
    <div css={stake}>
      <div onClick={() => setHasLiquidity(!hasLiquidity)} className="title">
        My Liquidity Pools
      </div>
      {positionDatas.length > 0 && (
        <div>
          <div className="overview">
            <div>
              <span>Total Claimable Rewards</span>
              <span>≈ $246,556,893.30</span>
            </div>
          </div>
          <div>
            <div
              css={css`
                margin-top: 24px;
              `}
              className="liquidity grey nowrap"
            >
              <span>ASSET</span>
              <span>PER TICKET SIZE</span>
              <span>APR</span>
              <span>UTILIZATION</span>
              <span>TOTAL LIQUIDITY SUPPLY</span>
              <span>LP REWARD</span>
              <span />
            </div>
            {positionDatas.map((position) => {
              return <FarmItem key={position.pool.tradingT} position={position} />
            })}
          </div>
        </div>
      )}
      {positionDatas.length === 0 && (
        <div
          className="no-stake"
          css={css`
            background: url(${DashboardBg}), no-repeat, #f1f1f1;
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
              `}
            >
              Learn more about Liquidity Pool&nbsp; <ArrowRight />
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
