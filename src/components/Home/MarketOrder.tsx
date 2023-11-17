/** @jsxImportSource @emotion/react */
import { css } from '@mui/material'
import { PositionsItem } from './OrderItem'
import { useRootStore } from '../../store/root'

export const MarketOrder = () => {
  const useAllOpenTrades = useRootStore((state) => state.userAllOpenTradeList)
  return (
    <div>
      <div
        className="position-layout"
        css={css`
          color: #617168;
        `}
      >
        <span>Position</span>
        {/*<span>PnL</span>*/}
        <span>Size</span>
        <span>Collateral</span>
        <span>Entry price</span>
        {/*<span>Mark price</span>*/}
        <span>Liq.price</span>
        <span>Close</span>
      </div>
      {useAllOpenTrades.length === 0 && <div className="no-data">No open position</div>}
      {useAllOpenTrades.length > 0 &&
        useAllOpenTrades.map((openTrade, index) => {
          return openTrade.tuple.map((pool, tradeIndex) => {
            return (
              <PositionsItem
                openTrade={pool}
                pool={openTrade.pool}
                key={openTrade.pool.tradingT + index + tradeIndex}
              />
            )
          })
        })}
    </div>
  )
}
