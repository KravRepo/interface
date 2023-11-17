import { css } from '@emotion/react'
import BigNumber from 'bignumber.js'
import { useCancelOpenLimitOrder } from '../../hook/hookV8/useCancelOpenLimitOrder'
import { TupleLimitOrder } from '../Trades/type'
import { PoolParams } from '../../store/FactorySlice'
import { EXCHANGE_CONFIG } from '../../constant/exchange'

/** @jsxImportSource @emotion/react */

type LimitOrderItemProps = {
  limit: TupleLimitOrder
  pool: PoolParams
}

export const LimitOrderItem = ({ limit, pool }: LimitOrderItemProps) => {
  const cancelOpenLimitOrder = useCancelOpenLimitOrder(pool.tradingT, pool.storageT)

  const getOrderContent = (
    isBuy: boolean,
    limitPrice: BigNumber,
    positionSize: BigNumber,
    leverage: number,
    symbol: string
  ) => {
    return positionSize.times(leverage).toFixed(2) + '' + symbol
  }
  return (
    <div className="order-layout">
      <div
        css={css`
          color: #009b72;
        `}
      >
        Limit
      </div>
      <div>
        {getOrderContent(limit.buy, limit.minPrice, new BigNumber(limit.positionSize), limit.leverage, pool.symbol)}
      </div>
      <div>{EXCHANGE_CONFIG[limit.pairIndex].symbol}</div>
      <div>${limit.minPrice.toFixed(EXCHANGE_CONFIG[limit.pairIndex].fixDecimals)}</div>
      <div>{limit.leverage}</div>
      <div>{new BigNumber(limit.positionSize).toFixed(2)}</div>
      <div
        css={css`
          cursor: pointer;
          text-decoration: underline;
        `}
        onClick={() => cancelOpenLimitOrder(limit.index)}
      >
        Cancel
      </div>
    </div>
  )
}
