/** @jsxImportSource @emotion/react */
import { HistoryData } from './TradeHistory'
import { align } from '../../../globalStyle'
import { css } from '@emotion/react'
import { eXDecimals } from '../../../utils/math'
import BigNumber from 'bignumber.js'
import { useRootStore } from '../../../store/root'
import { useMemo } from 'react'
import { PoolParams } from '../../../store/FactorySlice'
import { EXCHANGE_CONFIG } from '../../../constant/exchange'

type HistoryItemProps = {
  history: HistoryData
  pool?: PoolParams
}

// enum LimitOrder {
//   MARKET,
//   TP,
//   SL,
//   LIQ,
//   OPEN,
// }

export const HistoryItem = ({ history, pool }: HistoryItemProps) => {
  const tradePool = useRootStore((state) => state.tradePool)

  const pnlValue = useMemo(() => {
    if (history) {
      return new BigNumber(history.percentProfit).isEqualTo(0)
        ? new BigNumber(0)
        : eXDecimals(
            new BigNumber(history.daiSentToTrader).minus(history.tradeInitialPosToken),
            pool ? pool.decimals : tradePool.decimals
          )
    } else return new BigNumber(0)
  }, [history])

  const tradePair = useMemo(() => {
    return EXCHANGE_CONFIG[history.tradePairIndex]
  }, [history])

  const tradeType = useMemo(() => {
    switch (history.limitOrderType.toString()) {
      case '-1':
        return 'MARKET'
      case '0':
        return 'Take Profit'
      case '1':
        return 'StopLoss'
      case '2':
        return 'Liquidate'
      case '3':
        return 'OPEN'
      default:
        return 'MARKET'
    }
  }, [history])

  return (
    <div className="history-layout">
      <div>{history.createTime.split(' ')[0]}</div>
      <div css={align}>
        <img src={tradePair.logoSource.default} height="20" width="20" alt="" />
        <span
          css={css`
            margin-left: 8px;
          `}
        >
          {tradePair.titleSymbol}
        </span>
      </div>
      <div
        css={css`
          color: ${history.tradeBuy ? '#009B72' : '#DB4C40'};
        `}
      >
        {tradeType}
      </div>
      <div>${eXDecimals(history.price, 10).toFixed(tradePair.fixDecimals)}</div>
      <div>{history.tradeLeverage}</div>
      <div>{eXDecimals(history.positionSizeDai, pool ? pool.decimals : tradePool.decimals || 18).toFixed(2)}</div>
      <div
        css={css`
          color: ${pnlValue.isGreaterThan(0) ? '#009B72' : '#DB4C40'};
        `}
      >
        {pnlValue.isEqualTo(0) ? '-' : pnlValue.toFixed(2)}
      </div>
      <div
        css={css`
          color: ${pnlValue.isGreaterThan(0) ? '#009B72' : '#DB4C40'};
        `}
      >
        {pnlValue.isEqualTo(0)
          ? '-'
          : pnlValue
              .div(eXDecimals(history.tradeInitialPosToken, pool ? pool.decimals : tradePool.decimals))
              .times(100)
              .toFixed(2) + '%'}
      </div>
    </div>
  )
}
