/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useRootStore } from '../../../store/root'
import { PositionsItem } from './PositionsItem'
import { useTheme } from '@mui/material'

export const Positions = () => {
  const userOpenTradeList = useRootStore((state) => state.userOpenTradeList)
  const theme = useTheme()
  return (
    <div>
      <div
        className="position-layout"
        css={css`
          color: #617168;
          border-top: ${theme.splitLine.primary};
        `}
      >
        <span>Position</span>
        <span>PnL</span>
        {/* <span>Size</span> */}
        <span>Collateral</span>
        <span>Entry price</span>
        <span>Mark price</span>
        <span>Liq.price</span>
        <span>Take profit</span>
        <span>Close</span>
      </div>
      {userOpenTradeList.length === 0 && <div className="no-data">No open position</div>}
      {userOpenTradeList.length > 0 &&
        userOpenTradeList.map((openTrade, index) => {
          return <PositionsItem openTrade={openTrade} key={index} />
        })}
    </div>
  )
}
