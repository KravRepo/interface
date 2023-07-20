/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { useRootStore } from '../../../store/root'
import BigNumber from 'bignumber.js'
import { useCancelOpenLimitOrder } from 'hook/hookV8/useCancelOpenLimitOrder'

export const Orders = () => {
  const userOpenLimitList = useRootStore((state) => state.userOpenLimitList)
  const BTCPrice = useRootStore((state) => state.BTCPrice)
  const tradePool = useRootStore((store) => store.tradePool)
  const cancelOpenLimitOrder = useCancelOpenLimitOrder(tradePool.tradingT, tradePool.storageT)

  const getOrderContent = (isBuy: boolean, limitPrice: BigNumber, positionSize: BigNumber, leverage: number) => {
    return 'Increase BTC' + (isBuy ? 'Long' : 'Short') + ' by $' + positionSize.times(leverage).toFixed(2)
  }
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
      {userOpenLimitList.length === 0 && <div className="no-data">No Orders</div>}
      {userOpenLimitList.length > 0 &&
        userOpenLimitList.map((limit, index) => {
          return (
            <div className="order-layout" key={index}>
              <div
                css={css`
                  color: #009b72;
                `}
              >
                Limit
              </div>
              <div>{getOrderContent(limit.buy, limit.minPrice, new BigNumber(limit.positionSize), limit.leverage)}</div>
              <div>${limit.minPrice.toFixed(2)}</div>
              <div>${BTCPrice.toFixed(2)}</div>
              <div>{limit.leverage}</div>
              <div>${new BigNumber(limit.positionSize).toFixed(2)}</div>
              <div
                css={css`
                  cursor: pointer;
                `}
                onClick={() => cancelOpenLimitOrder(limit.index)}
              >
                Cancel
              </div>
            </div>
          )
        })}
    </div>
  )
}
