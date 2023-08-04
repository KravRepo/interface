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

type HistoryItemProps = {
  history: HistoryData
  pool?: PoolParams
}

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

  return (
    <div className="position-layout">
      <div>{history.createTime.split(' ')[0]}</div>
      <div css={align}>
        <BTCIcon height="20" width="20" />
        <span
          css={css`
            margin-left: 8px;
          `}
        >
          {pool ? pool.symbol : tradePool.symbol} / BTC
        </span>
      </div>
      <div
        css={css`
          color: ${history.tradeBuy ? '#009B72' : '#DB4C40'};
        `}
      >
        MARKET
      </div>
      <div>${eXDecimals(history.price, 10).toFixed(2)}</div>
      <div>{history.tradeLeverage}</div>
      <div>{eXDecimals(history.positionSizeDai, pool ? pool.decimals : tradePool.decimals).toFixed(2)}</div>
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
