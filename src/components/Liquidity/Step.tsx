/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Trans } from '@lingui/macro'
import { useTheme } from '@mui/material'

export const Step = () => {
  const theme = useTheme()
  return (
    <div
      className="table-right"
      css={css`
        background: ${theme.background.second};
        color: ${theme.text.primary};
      `}
    >
      <div className="step">
        <p>
          <Trans>Step 1 Choose Target Market</Trans>
        </p>
        <p>
          <Trans>
            With BTC as the underlying asset, different assets are used as investment products for perpetual option
            transactions. The asset selected by the pool you created now will be used as the transaction asset.
          </Trans>
        </p>
      </div>
      <div className="step">
        <p>
          <Trans>Step 2 Select Token Collateral</Trans>
        </p>
        <p>
          <Trans>
            With BTC as the underlying asset, different assets are used as investment products for perpetual option
            transactions. The asset selected by the pool you created now will be used as the transaction asset.
          </Trans>
        </p>
      </div>
      <div className="step">
        <p>
          <Trans>Step 3 Initial LP Provision</Trans>
        </p>
        <p>
          <Trans>
            The assets you deposit will be part of the liquidity pool and receive fees from each trade placed on the
            platform in exchange for serving as the counterparty to all trades.
          </Trans>
        </p>
      </div>
    </div>
  )
}
