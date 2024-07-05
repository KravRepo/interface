/** @jsxImportSource @emotion/react */
import { comingSoon } from '../components/Home/style'
import { ReactComponent as Coming } from '../assets/imgs/coming_soon.svg'
import { css } from '@emotion/react'
import { Trans } from '@lingui/macro'

export const Statistics = () => {
  return (
    <div css={comingSoon}>
      <p
        css={css`
          margin-bottom: 16px !important;
        `}
        className="title"
      >
        <Trans>Statistics</Trans>
      </p>
      <p
        css={css`
          margin-left: 40px !important;
          text-align: start !important;
          @media screen and (max-width: 600px) {
            margin-left: 16px !important;
          }
        `}
      >
        <Trans>Stay tuned</Trans>
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
