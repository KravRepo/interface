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
          <Link href="https://docs.krav.trade/" color="#000" marginRight={'8px'}>
            Trading guide
          </Link>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.2902 10.4044L11.2902 3.75704L4.64286 3.75704L4.64286 4.95704L9.24185 4.95704L3.19501 11.0039L4.04354 11.8524L10.0902 5.80571V10.4044L11.2902 10.4044Z"
              fill="black"
            />
          </svg>
        </p>
      </div>
    </div>
  )
}
