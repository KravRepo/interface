/** @jsxImportSource @emotion/react */
import { Select } from '@mui/material'
import { Trans } from '@lingui/macro'

export const SelectNetwork = () => {
  return (
    <Select>
      <div>
        {' '}
        <Trans>Select a network</Trans>{' '}
      </div>
    </Select>
  )
}
