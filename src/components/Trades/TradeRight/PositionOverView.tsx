/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { bottomCard } from '../style'
import { useRootStore } from '../../../store/root'

export const PositionOverView = () => {
  const BTCPrice = useRootStore((state) => state.BTCPrice)
  const tradePool = useRootStore((state) => state.tradePool)
  return (
    <div css={bottomCard}>
      <div>Long BTC</div>
      <div
        css={css`
          padding-top: 12px;
        `}
      >
        <p className="card-details">
          <span>Entry Price</span>
          <span>${BTCPrice.toFixed(2)}</span>
        </p>
        <p className="card-details">
          <span>Exit Price</span>
          <span>${BTCPrice.toFixed(2)}</span>
        </p>
        <p className="card-details">
          <span>Borrow Fee</span>
          <span>0.0053%/1h</span>
        </p>
        <p className="card-details">
          <span>Available Liquidity</span>
          <span>
            {tradePool?.poolCurrentBalance?.toFixed(2)} {tradePool?.symbol}
          </span>
        </p>
      </div>
    </div>
  )
}
