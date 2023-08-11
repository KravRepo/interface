/** @jsxImportSource @emotion/react */
import { TradingRewards } from './componets/TradingRewards'
import { LiquidityRewards } from './componets/LiquidityRewards'
import { stake } from './style'

export const NewFarm = () => {
  return (
    <div css={stake}>
      <TradingRewards />
      <LiquidityRewards />
    </div>
  )
}
