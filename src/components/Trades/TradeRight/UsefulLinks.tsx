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
          <Link href="https://docs.krav.trade/" color="#000">
            Trading guide
          </Link>
        </p>
      </div>
    </div>
  )
}
