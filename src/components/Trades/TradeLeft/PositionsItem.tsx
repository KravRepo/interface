/** @jsxImportSource @emotion/react */
import { Tuple } from '../type'
import BigNumber from 'bignumber.js'
import { getLiqPrice, getTakeProfit } from '../../../utils/math'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { useRootStore } from '../../../store/root'
import { useCloseTradeMarket } from '../../../hook/hookV8/useCloseTradeMarket'
import { useMemo, useState } from 'react'
import { css } from '@emotion/react'
import { PoolParams } from '../../../store/FactorySlice'
import KRAVButton from '../../KravUIKit/KravButton'
import { useClaimPendingOrder } from '../../../hook/hookV8/useClaimPendingOrder'
import { ProfitConfirmTrade } from '../../Dialog/ProfitConfirmTrade'
import { useTheme } from '@mui/material'

type PositionsItemProps = {
  openTrade: Tuple
  index: number
  pool?: PoolParams
}

export const PositionsItem = ({ openTrade, index, pool }: PositionsItemProps) => {
  const theme = useTheme()
  const BTCPrice = useRootStore((state) => state.BTCPrice)
  const tradePool = useRootStore((state) => state.tradePool)
  const tradePairIndex = useRootStore((state) => state.tradePairIndex)
  const pairConfig = useRootStore((state) => state.pairConfig)

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

  const tradePair = useMemo(() => {
    return pairConfig[tradePairIndex]
  }, [tradePairIndex, pairConfig])

  const liqPrice = useMemo(() => {
    return getLiqPrice(
      openTrade.openPrice as BigNumber,
      openTrade.initialPosToken as BigNumber,
      openTrade.buy,
      openTrade.leverage
    )
  }, [openTrade])

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {!openTrade.isPendingOrder && (
        <div
          className="position-layout"
          css={css`
            background: ${(index + 1) % 2 !== 0 ? (theme.palette.mode === 'dark' ? '#0f1114' : '#f1f1f1') : ''};
            border-radius: 24px;
          `}
        >
          <div>
            <p>
              {tradePair.symbol}&nbsp;
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
                color: ${positionTp.isGreaterThan(0) ? '#009B72' : '#DB4C40'};
                text-decoration: underline;
              `}
            >
              {BTCPrice.isEqualTo(0) && <span>----</span>}
              {BTCPrice.isGreaterThan(0) && (
                <>
                  <span>
                    {new BigNumber(openTrade.initialPosToken).times(positionTp).div(100).toFixed(2)}{' '}
                    {pool ? pool.symbol : tradePool.symbol}
                  </span>
                  <span>({positionTp.toFixed(2)} %)</span>
                </>
              )}
            </p>
          </div>
          <div>
            {new BigNumber(openTrade.initialPosToken).toFixed(2)} {pool ? pool.symbol : tradePool.symbol}
          </div>
          <div>${new BigNumber(openTrade.openPrice).toFixed(tradePair.fixDecimals)}</div>
          <div
            css={css`
              color: #ffb800;
            `}
          >
            ${BTCPrice.toFixed(tradePair.fixDecimals)}
          </div>
          <div style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsOpen(true)}>
            {openTrade.sl.toString() === '0'
              ? `$${liqPrice.toFixed(tradePair.fixDecimals)}`
              : `$${BigNumber(openTrade.sl).toFixed(tradePair.fixDecimals)}`}
          </div>
          <div style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsOpen(true)}>
            ${BigNumber(openTrade.tp).toFixed(tradePair.fixDecimals)}
          </div>
          <div>
            {openTrade.beingMarketClosed && (
              <div>
                <div
                  css={css`
                    border: 3px solid transparent;
                    border-bottom-color: ${theme.text.primary};
                  `}
                  className="loading"
                />
                <span>closing...</span>
              </div>
            )}
            {!openTrade.beingMarketClosed && (
              <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => closeTradeMarket(openTrade.index)} />
            )}
          </div>
        </div>
      )}
      {openTrade.isPendingOrder && openTrade.leverage > 0 && (
        <div className="position-layout">
          <div>
            <p>{tradePair.symbol}</p>
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
          <div>
            {new BigNumber(openTrade.initialPosToken).toFixed(2)} {tradePool.symbol}
          </div>
          <div>${new BigNumber(openTrade.openPrice).toFixed(tradePair.fixDecimals)}</div>
          <div
            css={css`
              color: #ffb800;
            `}
          >
            ${BTCPrice.toFixed(tradePair.fixDecimals)}
          </div>
          <div>
            {openTrade.sl.toString() === '0'
              ? `$${liqPrice.toFixed(tradePair.fixDecimals)}`
              : `$${BigNumber(openTrade.sl).toFixed(tradePair.fixDecimals)}`}
          </div>
          <div>${BigNumber(openTrade.tp).toFixed(2)}</div>
          {openTrade?.isInPending && (
            <div>
              <div
                css={css`
                  border: 3px solid transparent;
                  border-bottom-color: ${theme.text.primary};
                `}
                className="loading"
              />
              <span>opening...</span>
            </div>
          )}
          {!openTrade?.isInPending && (
            <div>
              <KRAVButton onClick={() => claimPosition(openTrade.orderId!, false)}>Claim</KRAVButton>
            </div>
          )}
        </div>
      )}
      {/*{openTrade.isPendingOrder && openTrade.leverage === 0 && !openTrade?.isInPending && (*/}
      {/*  <div className="position-layout">*/}
      {/*    <div>*/}
      {/*      <p>BTC</p>*/}
      {/*      <p>*/}
      {/*        <span>{openTrade.leverage}x</span>*/}
      {/*        <span*/}
      {/*          css={css`*/}
      {/*            color: ${openTrade.buy ? '#009B72' : '#DB4C40'};*/}
      {/*          `}*/}
      {/*        >*/}
      {/*          {openTrade.buy ? ' Long' : ' Short'}*/}
      {/*        </span>*/}
      {/*      </p>*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <p*/}
      {/*        css={css`*/}
      {/*          text-decoration: underline;*/}
      {/*        `}*/}
      {/*      >*/}
      {/*        --*/}
      {/*      </p>*/}
      {/*    </div>*/}
      {/*    <div>--</div>*/}
      {/*    <div>--</div>*/}
      {/*    <div>---</div>*/}
      {/*    <div>--</div>*/}
      {/*    <div>--</div>*/}
      {/*    <div>*/}
      {/*      <KRAVButton onClick={() => claimPosition(openTrade.orderId!, true)}>Claim</KRAVButton>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}
      {!openTrade.isPendingOrder && (
        <ProfitConfirmTrade
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          lqPrice={liqPrice}
          btcPrice={BTCPrice}
          openTrade={openTrade}
          pool={pool}
        />
      )}
    </>
  )
}
