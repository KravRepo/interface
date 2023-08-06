/** @jsxImportSource @emotion/react */
import { Tuple } from '../type'
import BigNumber from 'bignumber.js'
import { getLiqPrice, getTakeProfit } from '../../../utils/math'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { useRootStore } from '../../../store/root'
import { useCloseTradeMarket } from '../../../hook/hookV8/useCloseTradeMarket'
import { useMemo } from 'react'
import { css } from '@emotion/react'
import { PoolParams } from '../../../store/FactorySlice'
import KRAVButton from '../../KravUIKit/KravButton'
import { useClaimPendingOrder } from '../../../hook/hookV8/useClaimPendingOrder'

type PositionsItemProps = {
  openTrade: Tuple
  pool?: PoolParams
}

export const PositionsItem = ({ openTrade, pool }: PositionsItemProps) => {
  const BTCPrice = useRootStore((state) => state.BTCPrice)
  const tradePool = useRootStore((state) => state.tradePool)
  const closeTradeMarket = useCloseTradeMarket(
    pool ? pool.tradingT : tradePool.tradingT,
    pool ? pool.storageT : tradePool.storageT
  )
  const claimPosition = useClaimPendingOrder(tradePool.tradingT)
  const positionTp = useMemo(() => {
    if (new BigNumber(openTrade.openPrice).isEqualTo(0)) return new BigNumber(0)
    const tp = getTakeProfit(new BigNumber(openTrade.openPrice), BTCPrice, openTrade.buy, openTrade.leverage, false)
    if (isNaN(tp.toNumber())) return new BigNumber(0)
    else return tp
  }, [BTCPrice, openTrade])
  const liqPrice = useMemo(() => {
    return getLiqPrice(
      openTrade.openPrice as BigNumber,
      openTrade.initialPosToken as BigNumber,
      openTrade.buy,
      openTrade.leverage
    )
  }, [openTrade])

  return (
    <>
      {!openTrade.isPendingOrder && (
        <div className="position-layout">
          <div>
            <p>BTC</p>
            <p>
              <span>{openTrade.leverage}x</span>
              <span
                css={css`
                  color: ${openTrade.buy ? '#009B72' : '#DB4C40'};
                `}
              >
                {openTrade.buy ? ' Long' : ' Short'}
              </span>
            </p>
          </div>
          <div>
            <p
              css={css`
                text-decoration: underline;
              `}
            >
              {new BigNumber(openTrade.initialPosToken)
                .times(openTrade.leverage)
                .div(pool ? pool.proportionBTC : tradePool.proportionBTC)
                .toFixed(6)}
              &nbsp;BTC
            </p>
            <p
              css={css`
                color: ${positionTp.isGreaterThan(0) ? '#009B72' : '#DB4C40'};
                text-decoration: underline;
              `}
            >
              <span>
                {new BigNumber(openTrade.initialPosToken).times(positionTp).div(100).toFixed(2)}{' '}
                {pool ? pool.symbol : tradePool.symbol}
              </span>
              <span>({positionTp.toFixed(2)} %)</span>
            </p>
          </div>
          <div>{new BigNumber(openTrade.initialPosToken).times(openTrade.leverage).toFixed(2)}</div>
          <div>{new BigNumber(openTrade.initialPosToken).toFixed(2)}</div>
          <div>${new BigNumber(openTrade.openPrice).toFixed(2)}</div>
          <div>${BTCPrice.toFixed(2)}</div>
          <div>${liqPrice.toFixed(2)}</div>
          <div>
            <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => closeTradeMarket(openTrade.index)} />
          </div>
        </div>
      )}
      {openTrade.isPendingOrder && openTrade.leverage > 0 && (
        <div className="position-layout">
          <div>
            <p>BTC</p>
            <p>
              <span>{openTrade.leverage}x</span>
              <span
                css={css`
                  color: ${openTrade.buy ? '#009B72' : '#DB4C40'};
                `}
              >
                {openTrade.buy ? ' Long' : ' Short'}
              </span>
            </p>
          </div>
          <div>
            <p
              css={css`
                text-decoration: underline;
              `}
            >
              {new BigNumber(openTrade.initialPosToken)
                .times(openTrade.leverage)
                .div(pool ? pool.proportionBTC : tradePool.proportionBTC)
                .toFixed(6)}
              &nbsp;BTC
            </p>
            <p
              css={css`
                color: ${positionTp.isGreaterThan(0) ? '#009B72' : '#DB4C40'};
                text-decoration: underline;
              `}
            >
              <span>
                {new BigNumber(openTrade.initialPosToken).times(positionTp).div(100).toFixed(2)}{' '}
                {pool ? pool.symbol : tradePool.symbol}
              </span>
              <span>({positionTp.toFixed(2)} %)</span>
            </p>
          </div>
          <div>{new BigNumber(openTrade.initialPosToken).times(openTrade.leverage).toFixed(2)}</div>
          <div>{new BigNumber(openTrade.initialPosToken).toFixed(2)}</div>
          <div>${new BigNumber(openTrade.openPrice).toFixed(2)}</div>
          <div>${BTCPrice.toFixed(2)}</div>
          <div>${liqPrice.toFixed(2)}</div>
          <div>
            <KRAVButton onClick={() => claimPosition(openTrade.orderId!, false)}>Claim</KRAVButton>
          </div>
        </div>
      )}
      {openTrade.isPendingOrder && openTrade.leverage === 0 && (
        <div className="position-layout">
          <div>
            <p>BTC</p>
            <p>
              <span>{openTrade.leverage}x</span>
              <span
                css={css`
                  color: ${openTrade.buy ? '#009B72' : '#DB4C40'};
                `}
              >
                {openTrade.buy ? ' Long' : ' Short'}
              </span>
            </p>
          </div>
          <div>
            <p
              css={css`
                text-decoration: underline;
              `}
            >
              --
            </p>
          </div>
          <div>--</div>
          <div>--</div>
          <div>---</div>
          <div>--</div>
          <div>--</div>
          <div>
            <KRAVButton onClick={() => claimPosition(openTrade.orderId!, true)}>Claim</KRAVButton>
          </div>
        </div>
      )}
    </>
  )
}
