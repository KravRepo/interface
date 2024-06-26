/** @jsxImportSource @emotion/react */
import { ReactComponent as Coming } from '../../assets/imgs/coming_soon.svg'
import { comingSoon } from './style'
import { useTheme } from '@mui/material'
import { css } from '@emotion/react'
import { t } from '@lingui/macro'

type ComingSoonProps = {
  title: string
}

export const ComingSoon = ({ title }: ComingSoonProps) => {
  const theme = useTheme()
  return (
    <div css={comingSoon}>
      <p
        className="title"
        css={css`
          color: ${theme.text.primary};
        `}
      >
        {title}
      </p>
      <p
        css={css`
          color: ${theme.text.primary};
        `}
      >
        {t`Stay tuned`}
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
