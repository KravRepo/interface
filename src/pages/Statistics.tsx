/** @jsxImportSource @emotion/react */
import { comingSoon } from '../components/Home/style'
import { ReactComponent as Coming } from '../assets/imgs/coming_soon.svg'
import { css } from '@emotion/react'

export const Statistics = () => {
  return (
    <div css={comingSoon}>
      <p
        css={css`
          margin-bottom: 16px;
        `}
        className="title"
      >
        Statistics
      </p>
      <p
        css={css`
          margin-left: 40px;
        `}
      >
        Stay tuned! This feature will be launched soon.
      </p>
      <div>
        <Coming className="coming" />
        <Coming className="coming" />
        <Coming className="coming" />
        <Coming className="coming" />
        <Coming className="coming" />
        <Coming className="coming" />
        <Coming className="coming" />
        <Coming className="coming" />
        <Coming className="coming" />
      </div>
    </div>
  )
}
