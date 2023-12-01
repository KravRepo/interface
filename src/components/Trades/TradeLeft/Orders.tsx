/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { useRootStore } from '../../../store/root'
import BigNumber from 'bignumber.js'
import { useCancelOpenLimitOrder } from '../../../hook/hookV8/useCancelOpenLimitOrder'
import { useMemo } from 'react'
import { useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'

export const Orders = () => {
  const theme = useTheme()
  const { account } = useWeb3React()
  const userOpenLimitList = useRootStore((state) => state.userOpenLimitList)
  const BTCPrice = useRootStore((state) => state.BTCPrice)
  const tradePool = useRootStore((store) => store.tradePool)
  const tradePairIndex = useRootStore((store) => store.tradePairIndex)
  const pairConfig = useRootStore((store) => store.pairConfig)
  const cancelOpenLimitOrder = useCancelOpenLimitOrder(tradePool.tradingT, tradePool.storageT)

  const tradePair = useMemo(() => {
    return pairConfig[tradePairIndex]
  }, [tradePairIndex, pairConfig])

  const getOrderContent = (isBuy: boolean, limitPrice: BigNumber, positionSize: BigNumber, leverage: number) => {
    return positionSize.times(leverage).toFixed(2) + tradePool.symbol
  }
  return (
    <div>
      <div
        className="order-layout"
        css={css`
          color: #617168;
          border-top: ${theme.splitLine.primary};
        `}
      >
        <span>Type</span>
        <span>Order</span>
        <span>Ask Price</span>
        <span>Market Price</span>
        <span>Leverage</span>
        <span>Collateral</span>
        <div>Action</div>
      </div>
      {userOpenLimitList.length === 0 && account && <div className="no-data">No Orders</div>}
      {!account && <div className="no-data">Connect wallet</div>}
      {userOpenLimitList.length > 0 &&
        account &&
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
              <div>${limit.minPrice.toFixed(tradePair.fixDecimals)}</div>
              <div>${BTCPrice.toFixed(tradePair.fixDecimals)}</div>
              <div>{limit.leverage}</div>
              <div>
                {new BigNumber(limit.positionSize).toFixed(2)} {tradePool.symbol}
              </div>
              <div
                css={css`
                  cursor: pointer;
                  text-decoration: underline;
                `}
                onClick={() => cancelOpenLimitOrder(limit.index, limit.pairIndex)}
              >
                Cancel
              </div>
            </div>
          )
        })}
    </div>
  )
}
