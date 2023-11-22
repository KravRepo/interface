/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { useMemo } from 'react'
import { css } from '@emotion/react'
// import { useRootStore } from '../../store/root'
import { PoolParams } from '../../store/FactorySlice'
import { useCloseTradeMarket } from '../../hook/hookV8/useCloseTradeMarket'
import { getLiqPrice } from '../../utils/math'
import { Tuple } from '../Trades/type'
import { useRootStore } from '../../store/root'

type PositionsItemProps = {
  openTrade: Tuple
  pool: PoolParams
}
export const PositionsItem = ({ openTrade, pool }: PositionsItemProps) => {
  const pairConfig = useRootStore((state) => state.pairConfig)
  const closeTradeMarket = useCloseTradeMarket(pool.tradingT, pool.storageT)
  // const positionTp = useMemo(() => {
  //   const tp = getTakeProfit(new BigNumber(openTrade.openPrice), BTCPrice, openTrade.buy, openTrade.leverage, false)
  //   if (isNaN(tp.toNumber())) return new BigNumber(0)
  //   else return tp
  // }, [BTCPrice, openTrade])
  const liqPrice = useMemo(() => {
    return getLiqPrice(
      openTrade.openPrice as BigNumber,
      openTrade.initialPosToken as BigNumber,
      openTrade.buy,
      openTrade.leverage
    )
  }, [openTrade])

  return (
    <div className="position-layout">
      <div>
        <p>{pairConfig[openTrade.pairIndex].symbol}</p>
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
      {/*<div>*/}
      {/*  /!*<p*!/*/}
      {/*  /!*  css={css`*!/*/}
      {/*  /!*    text-decoration: underline;*!/*/}
      {/*  /!*  `}*!/*/}
      {/*  /!*>*!/*/}
      {/*  /!*  {new BigNumber(openTrade.initialPosToken).times(openTrade.leverage).div(pool.proportionBTC).toFixed(6)}*!/*/}
      {/*  /!*  &nbsp;BTC*!/*/}
      {/*  /!*</p>*!/*/}
      {/*  <p*/}
      {/*    css={css`*/}
      {/*      color: ${positionTp.isGreaterThan(0) ? '#009B72' : '#DB4C40'};*/}
      {/*      text-decoration: underline;*/}
      {/*    `}*/}
      {/*  >*/}
      {/*    <span>*/}
      {/*      {new BigNumber(openTrade.initialPosToken).times(positionTp).div(100).toFixed(2)} {pool.symbol}*/}
      {/*    </span>*/}
      {/*    <span>({positionTp.toFixed(2)} %)</span>*/}
      {/*  </p>*/}
      {/*</div>*/}
      <div>
        {new BigNumber(openTrade.initialPosToken).times(openTrade.leverage).toFixed(2)} {pool.symbol}
      </div>
      <div>
        {new BigNumber(openTrade.initialPosToken).toFixed(2)} {pool.symbol}
      </div>
      <div>${new BigNumber(openTrade.openPrice).toFixed(pairConfig[openTrade.pairIndex].fixDecimals)}</div>
      {/*<div>${BTCPrice.toFixed(2)}</div>*/}
      <div>${liqPrice.toFixed(pairConfig[openTrade.pairIndex].fixDecimals)}</div>
      <div>
        <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => closeTradeMarket(openTrade.index)} />
      </div>
    </div>
  )
}
