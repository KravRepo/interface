/** @jsxImportSource @emotion/react */
import { marketCard } from './style'
import { css, useMediaQuery, useTheme } from '@mui/material'
import KravButtonHollow from '../KravUIKit/KravButtonHollow'
import { useRootStore } from '../../store/root'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'
import { MarketItemProps } from './type'
import { useWeb3React } from '@web3-react/core'
import { getBigNumberStr } from '../../utils'

export const MarketItemCard = ({ setAddLiquidity, poolParams, aprList }: MarketItemProps) => {
  const theme = useTheme()
  const { account } = useWeb3React()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const setLiquidityInfo = useRootStore((store) => store.setLiquidityInfo)
  const setWalletDialogVisibility = useRootStore((store) => store.setWalletDialogVisibility)
  const userPositionDatas = useRootStore((store) => store.userPositionDatas)
  const poolSupply = useMemo(() => {
    const supply =
      userPositionDatas.find((item) => item.pool?.tradingT === poolParams?.tradingT)?.daiDeposited ?? new BigNumber(0)
    return eXDecimals(supply, poolParams.decimals)
  }, [poolParams, userPositionDatas])

  const apr = useMemo(() => {
    const res = aprList.find((list) => list?.tradingT === poolParams?.tradingT)
    if (res) return res.apr
    else return new BigNumber(0)
  }, [aprList])
  return (
    <div
      css={[
        marketCard,
        css`
          border: ${theme.splitLine.primary};
        `,
      ]}
    >
      <div
        className="card-title"
        css={css`
          border-bottom: ${theme.splitLine.primary};
        `}
      >
        <div>
          <span>{poolParams.symbol}</span>
          <div>
            <span
              css={css`
                color: ${theme.text.second};
                font-size: 12px;
                margin-right: 8px;
              `}
            >
              UTILIZATION
            </span>
            <span
              css={css`
                font-size: 16px;
                font-weight: 600;
              `}
            >
              {isNaN(poolParams.utilization.toNumber()) ? 0 : poolParams.utilization.toFixed(2)}%
            </span>
          </div>
        </div>
        <img
          css={css`
            left: calc(50% - ${isMobile ? '24px' : '32px'});
            top: ${isMobile ? '-24px' : '-32px'};
            border-radius: 50%;
          `}
          src={poolParams.logoSource}
          height={isMobile ? '48' : '64'}
          width={isMobile ? '48' : '64'}
        />
      </div>
      <div className="card-content">
        <div className="data">
          <p>TOTAL LIQUIDITY SUPPLY</p>
          <p>{poolParams.poolTotalSupply?.toFixed(2)}</p>
        </div>
        <div className="data">
          <p>YOUR LIQUIDITY SUPPLY</p>
          <p
            css={css`
              color: #2832f5;
            `}
          >
            {getBigNumberStr(poolSupply, 2)}
          </p>
        </div>
        <div
          css={css`
            background: ${theme.palette.mode === 'dark' ? '#bde0ba' : '#e7fae5'};
          `}
          className="apr"
        >
          <span
            css={css`
              color: ${theme.palette.mode === 'dark' ? '#1c1e23' : '#757575'};
            `}
          >
            APR
          </span>
          <span
            css={css`
              color: #009b72;
            `}
          >
            {apr.toFixed(2)}%
          </span>
        </div>
        {account && (
          <KravButtonHollow
            onClick={() => {
              setAddLiquidity(true)
              setLiquidityInfo(poolParams)
            }}
          >
            Add Liquidity
          </KravButtonHollow>
        )}
        {!account && (
          <KravButtonHollow
            onClick={() => {
              setWalletDialogVisibility(true)
            }}
          >
            Connect Wallet
          </KravButtonHollow>
        )}
      </div>
    </div>
  )
}
