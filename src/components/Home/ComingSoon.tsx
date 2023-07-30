/** @jsxImportSource @emotion/react */
import { ReactComponent as Coming } from '../../assets/imgs/coming_soon.svg'
import { comingSoon } from './style'

type ComingSoonProps = {
  title: string
}

export const ComingSoon = ({ title }: ComingSoonProps) => {
  return (
    <div css={comingSoon}>
      <p className="title">{title}</p>
      <p>Stay tuned! This feature will be launched soon.</p>
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
