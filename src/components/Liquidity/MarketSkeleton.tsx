/** @jsxImportSource @emotion/react */
import { align } from '../../globalStyle'
import { Skeleton } from '@mui/material'
import { css } from '@emotion/react'

export const MarketSkeleton = () => {
  return (
    <div className="liquidity-table">
      <div css={align}>
        <Skeleton animation="wave" variant="circular" width={40} height={40} />
        <div
          css={css`
            margin-left: 12px;
          `}
        >
          <Skeleton animation="wave" height={16} width={80} style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={16} width="80%" style={{ marginBottom: 6 }} />
        </div>
      </div>
      <div>
        <Skeleton animation="wave" height={20} width="40%" />
      </div>
      <div>
        <Skeleton animation="wave" height={20} width="40%" />
      </div>
      <div>
        <Skeleton animation="wave" height={16} width="60%" style={{ marginBottom: 6 }} />
        <Skeleton animation="wave" height={16} width="50%" style={{ marginBottom: 6 }} />
      </div>
      <div>
        <Skeleton animation="wave" height={16} width="80%" />
      </div>
      <div>
        <Skeleton animation="wave" height={16} width="60%" />
      </div>
      <div>
        <Skeleton animation="wave" height={60} width="80%" sx={{ minHeight: '60px' }} />
      </div>
    </div>
  )
}
