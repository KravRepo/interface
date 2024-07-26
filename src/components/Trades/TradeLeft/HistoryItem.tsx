/** @jsxImportSource @emotion/react */
import { HistoryData } from './TradeHistory'
import { align } from '../../../globalStyle'
import { ReactComponent as BTCIcon } from '../../../assets/imgs/tokens/bitcoin.svg'
import { css } from '@emotion/react'
import { eXDecimals } from '../../../utils/math'
import BigNumber from 'bignumber.js'
import { useRootStore } from '../../../store/root'
import { useMemo } from 'react'
import { PoolParams } from '../../../store/FactorySlice'
import { msg } from '@lingui/macro'
import { useLingui } from '@lingui/react'

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

const tradeTypeMsg = {
  MARKET: msg`MARKET`,
  'Take Profit': msg`Take Profit`,
  StopLoss: msg`StopLoss`,
  Liquidate: msg`Liquidate`,
  OPEN: msg`OPEN`,
}

export const HistoryItem = ({ history, pool }: HistoryItemProps) => {
  const { i18n } = useLingui()
  const tradePool = useRootStore((state) => state.tradePool)
  const pairConfig = useRootStore((state) => state.pairConfig)
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

  const tradeSymbol = useMemo(() => {
    return pairConfig[history.tradePairIndex].titleSymbol
  }, [history, pairConfig])

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
      <div>{new Date(history.createTime).toLocaleDateString()}</div>
      <div>{new Date(history.createTime).toLocaleTimeString()}</div>

      <div css={align}>
        <BTCIcon height="20" width="20" />
        <span
          css={css`
            margin-left: 8px;
          `}
        >
          {tradeSymbol}
        </span>
      </div>
      <div
        css={css`
          color: ${history.tradeBuy && tradeType !== 'Liquidate' ? '#009B72' : '#DB4C40'};
        `}
      >
        {i18n.t(tradeTypeMsg[tradeType])} {history.tradeBuy ? '(L)' : '(S)'}
      </div>
      <div>${eXDecimals(history.tradeOpenPrice, 10).toFixed(2)}</div>
      <div>${eXDecimals(history.price, 10).toFixed(2)}</div>
      <div>{history.tradeLeverage}x</div>
      <div>
        {eXDecimals(history.positionSizeDai, pool ? pool.decimals : tradePool.decimals || 18).toFixed(2)}{' '}
        {tradePool.symbol}
      </div>
      <div
        css={css`
          color: ${pnlValue.isGreaterThan(0) ? '#009B72' : '#DB4C40'};
        `}
      >
        {pnlValue.isEqualTo(0) ? '-' : pnlValue.toFixed(2)} {tradePool.symbol}
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
