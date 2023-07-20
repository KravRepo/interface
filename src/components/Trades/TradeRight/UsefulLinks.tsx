/** @jsxImportSource @emotion/react */
import { Link } from '@mui/material'
import { bottomCard } from '../style'
import { css } from '@emotion/react'

export const UsefulLinks = () => {
  return (
    <div css={bottomCard}>
      <div>Useful Links</div>
      <div
        css={css`
          padding-top: 12px;
        `}
      >
        <p className="card-details">
          <Link color="#000">Trading guide</Link>
        </p>
        <p className="card-details">
          <Link color="#000">Leaderboard</Link>
        </p>
        <p className="card-details">
          <Link color="#000">Speed up page loading</Link>
        </p>
      </div>
    </div>
  )
}
