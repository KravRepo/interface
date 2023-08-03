/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { UseAllLimitOrders } from '../../hook/hookV8/useGetUserAllLimitOrders'
import { LimitOrderItem } from './LimitOrderItem'

type LimitOrderProps = {
  useAllLimitOrders: UseAllLimitOrders[]
}

export const LimitOrder = ({ useAllLimitOrders }: LimitOrderProps) => {
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
        <span>Price</span>
        <span>Market Price</span>
        <span>Leverage</span>
        <span>Collateral</span>
        <div>Action</div>
      </div>
      {useAllLimitOrders.length === 0 && <div className="no-data">No open position</div>}
      {useAllLimitOrders.length > 0 &&
        useAllLimitOrders.map((limitOrder, index) => {
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
