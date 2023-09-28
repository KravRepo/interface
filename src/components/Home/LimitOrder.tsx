/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LimitOrderItem } from './LimitOrderItem'
import { useRootStore } from '../../store/root'

export const LimitOrder = () => {
  const userAllOpenLimitList = useRootStore((store) => store.userAllOpenLimitList)

  return (
    <div>
      <div
        className="order-layout"
        css={css`
          color: #617168;
        `}
      >
        <span>Type</span>
        <span>Order</span>
        <span>pair</span>
        <span>Ask Price</span>
        <span>Leverage</span>
        <span>Collateral</span>
        <div>Action</div>
      </div>
      {userAllOpenLimitList.length === 0 && <div className="no-data">No open position</div>}
      {userAllOpenLimitList.length > 0 &&
        userAllOpenLimitList.map((limitOrder, index) => {
          return limitOrder.tuple.map((limit, limitIndex) => {
            return (
              <LimitOrderItem
                limit={limit}
                pool={limitOrder.pool}
                key={limitOrder.pool.tradingT + index + limitIndex}
              />
            )
          })
        })}
    </div>
  )
}
