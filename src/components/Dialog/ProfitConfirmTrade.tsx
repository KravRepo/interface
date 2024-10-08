/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent, Input, useTheme } from '@mui/material'
import { dialogContent } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import KRAVButton from '../KravUIKit/KravButton'
import { css } from '@emotion/react'
import { useRootStore } from '../../store/root'
import { getBigNumberStr } from '../../utils'
import BigNumber from 'bignumber.js'
import { getReachPrice, getTakeProfit } from '../../utils/math'
import { useGetTakeProfit } from '../../hook/hookV8/useGetTakeProfit'
import { normalTab } from '../Trades/TradeRight/style'
import { Tuple } from '../Trades/type'
import { useUpdateTradeMarket } from '../../hook/hookV8/useCloseTradeMarket'
import { PoolParams } from '../../store/FactorySlice'
import { Trans, msg, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { PairInfosABI } from '../../abi/deployed/PairInfosABI'
import { useContract } from '../../hook/hookV8/useContract'

export type ConfirmTradeDialogProp = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  lqPrice: BigNumber
  btcPrice: BigNumber
  openTrade: Tuple
  pool: PoolParams | undefined
}

enum SlLimitState {
  'UPDATE',
  'SL_GT_OPEN_PRICE',
  'SL_LT_OPEN_PRICE',
  'MAX_SL_LIMIT',
  'INVALID',
  'SL_GT_MARKET_PRICE',
  'SL_LT_MARKET_PRICE',
}

enum TpLimitState {
  'UPDATE',
  'TP_GT_OPEN_PRICE',
  'TP_LT_OPEN_PRICE',
  'MAX_TP_LIMIT',
  'INVALID',
  'TP_GT_MARKET_PRICE',
  'TP_LT_MARKET_PRICE',
}

const TpButtonText = {
  UPDATE: msg`update`,
  TP_GT_OPEN_PRICE: msg`Take profit greater then open price`,
  TP_LT_OPEN_PRICE: msg`Take profit less then open price`,
  MAX_TP_LIMIT: msg`The maximum percentage cannot exceed 900%`,
  INVALID: msg`Invalid number`,
  TP_GT_MARKET_PRICE: msg`Take profit greater then market price`,
  TP_LT_MARKET_PRICE: msg`Take profit less then market price`,
}

const SlButtonText = {
  UPDATE: msg`update`,
  SL_GT_OPEN_PRICE: msg`Stop loss greater then open price`,
  SL_LT_OPEN_PRICE: msg`Stop loss less then open price`,
  MAX_SL_LIMIT: msg`The maximum percentage cannot exceed 75%`,
  INVALID: msg`Invalid number`,
  SL_GT_MARKET_PRICE: msg`Stop loss greater then market price`,
  SL_LT_MARKET_PRICE: msg`Stop loss less then market price`,
}

export const ProfitConfirmTrade = ({
  isOpen,
  setIsOpen,
  lqPrice,
  btcPrice,
  openTrade,
  pool,
}: ConfirmTradeDialogProp) => {
  const theme = useTheme()
  const { i18n } = useLingui()
  const tradePool = useRootStore((store) => store.tradePool)
  const pairConfig = useRootStore((store) => store.pairConfig)
  const [slUsePercentage, setUseSlPercentage] = useState(true)
  const [tpUsePercentage, setTpUsePercentage] = useState(true)
  const [tpSetting, setTpSetting] = useState(0)
  const [slSetting, setSlSetting] = useState(0)
  const [slPrice, setSlPrice] = useState<BigNumber | string | number>(openTrade.sl)
  const [tpPrice, setTpPrice] = useState<BigNumber | string | number>(openTrade.tp)

  const activeTab = useMemo(() => {
    return css`
      color: ${theme.text.primary};
      font-weight: 700;
    `
  }, [theme])

  const tradePair = useMemo(() => {
    return pairConfig[openTrade.pairIndex]
  }, [openTrade, pairConfig])

  const targetSl = useMemo(() => {
    return slUsePercentage
      ? slSetting === 0
        ? new BigNumber(0)
        : getReachPrice(openTrade.leverage, openTrade.buy, slSetting, new BigNumber(openTrade.openPrice))
      : new BigNumber(slPrice)
  }, [slUsePercentage, slSetting, openTrade.leverage, openTrade.buy, openTrade.openPrice, slPrice])

  const targetTp = useMemo(() => {
    return tpUsePercentage
      ? tpSetting === 0
        ? new BigNumber(0)
        : getReachPrice(openTrade.leverage, openTrade.buy, tpSetting, new BigNumber(openTrade.openPrice))
      : new BigNumber(tpPrice)
  }, [tpUsePercentage, tpSetting, openTrade.leverage, openTrade.buy, openTrade.openPrice, tpPrice])

  const pairContract = useContract(tradePool?.pairInfoT ?? null, PairInfosABI)

  const openPrice = useMemo(() => {
    return new BigNumber(openTrade.openPrice)
  }, [openTrade.openPrice])

  const slTakeProfit = useGetTakeProfit(
    openPrice,
    btcPrice,
    openTrade.buy,
    openTrade.leverage,
    true,
    openTrade.trader,
    openTrade.positionSizeDai,
    openTrade.index,
    openTrade.pairIndex,
    pairContract
  )
  const slPercentage = slTakeProfit.takeProfit

  const tpTakeProfit = useGetTakeProfit(
    openPrice,
    btcPrice,
    openTrade.buy,
    openTrade.leverage,
    false,
    openTrade.trader,
    openTrade.positionSizeDai,
    openTrade.index,
    openTrade.pairIndex,
    pairContract
  )
  const tpPercentage = tpTakeProfit.takeProfit

  const handleTpSLSetting = (isSl: boolean, value: number) => {
    if (isSl) {
      setSlSetting(value)
      setUseSlPercentage(true)
      setSlPrice('')
    } else {
      setTpSetting(value)
      setTpUsePercentage(true)
      setTpPrice('')
    }
  }

  const closeTradeMarket = useUpdateTradeMarket(
    pool ? pool.tradingT : tradePool.tradingT,
    pool ? pool.storageT : tradePool.storageT
  )

  const slLimit = useMemo(() => {
    if (targetSl.gt(btcPrice) && openTrade.buy) {
      return SlLimitState.SL_GT_MARKET_PRICE
    }
    if (targetSl.lt(btcPrice) && !openTrade.buy) {
      return SlLimitState.SL_LT_MARKET_PRICE
    }
    const percentage = getTakeProfit(btcPrice, targetSl, openTrade.buy, openTrade.leverage, true)
    if (new BigNumber(targetSl).isGreaterThanOrEqualTo(openTrade.openPrice) && openTrade.buy && !targetSl.isEqualTo(0))
      return SlLimitState.SL_GT_OPEN_PRICE
    if (new BigNumber(targetSl).isLessThanOrEqualTo(openTrade.openPrice) && !openTrade.buy && !targetSl.isEqualTo(0))
      return SlLimitState.SL_LT_OPEN_PRICE
    if (isNaN(targetSl.toNumber()) || targetSl.isLessThan(0)) return SlLimitState.INVALID
    const feePercentage = 2 * openTrade.leverage * 0.08 * -1
    if (percentage.isLessThan(-75 + feePercentage) && !targetSl.isEqualTo(0)) return SlLimitState.MAX_SL_LIMIT
    return SlLimitState.UPDATE
  }, [btcPrice, targetSl, openTrade.buy, openTrade.leverage, openTrade.openPrice])

  const tpLimit = useMemo(() => {
    const percentage = getTakeProfit(btcPrice, targetTp, openTrade.buy, openTrade.leverage, false)
    if (targetTp.gt(btcPrice) && !openTrade.buy) {
      return TpLimitState.TP_GT_MARKET_PRICE
    }
    if (targetTp.lt(btcPrice) && openTrade.buy) {
      return TpLimitState.TP_LT_MARKET_PRICE
    }
    if (isNaN(targetTp.toNumber()) || targetTp.isLessThan(0)) return TpLimitState.INVALID
    if (targetTp.isLessThanOrEqualTo(openTrade.openPrice) && openTrade.buy) return TpLimitState.TP_LT_OPEN_PRICE
    if (targetTp.isGreaterThanOrEqualTo(openTrade.openPrice) && !openTrade.buy) return TpLimitState.TP_GT_OPEN_PRICE
    const feePercentage = 2 * openTrade.leverage * 0.08 * 1
    if (percentage.isGreaterThan(900 + feePercentage)) return TpLimitState.MAX_TP_LIMIT
    return TpLimitState.UPDATE
  }, [btcPrice, targetTp, openTrade.buy, openTrade.leverage, openTrade.openPrice])

  const tpButtonText = useMemo(() => {
    if (tpLimit === TpLimitState.TP_GT_MARKET_PRICE) return TpButtonText.TP_GT_MARKET_PRICE
    if (tpLimit === TpLimitState.TP_LT_MARKET_PRICE) return TpButtonText.TP_LT_MARKET_PRICE
    if (tpLimit === TpLimitState.MAX_TP_LIMIT) return TpButtonText.MAX_TP_LIMIT
    if (tpLimit === TpLimitState.TP_LT_OPEN_PRICE) return TpButtonText.TP_LT_OPEN_PRICE
    if (tpLimit === TpLimitState.TP_GT_OPEN_PRICE) return TpButtonText.TP_GT_OPEN_PRICE
    if (tpLimit === TpLimitState.INVALID) return TpButtonText.INVALID
    return TpButtonText.UPDATE
  }, [tpLimit])

  const slButtonText = useMemo(() => {
    if (slLimit === SlLimitState.SL_GT_MARKET_PRICE) return SlButtonText.SL_GT_MARKET_PRICE
    if (slLimit === SlLimitState.SL_LT_MARKET_PRICE) return SlButtonText.SL_LT_MARKET_PRICE
    if (slLimit === SlLimitState.MAX_SL_LIMIT) return SlButtonText.MAX_SL_LIMIT
    if (slLimit === SlLimitState.SL_LT_OPEN_PRICE) return SlButtonText.SL_LT_OPEN_PRICE
    if (slLimit === SlLimitState.SL_GT_OPEN_PRICE) return SlButtonText.SL_GT_OPEN_PRICE
    if (slLimit === SlLimitState.INVALID) return SlButtonText.INVALID
    return SlButtonText.UPDATE
  }, [slLimit])

  const tpAction = useCallback(async () => {
    setIsOpen(false)
    await closeTradeMarket(false, targetTp, openTrade.index)
  }, [closeTradeMarket, openTrade.index, setIsOpen, targetTp])

  const slAction = useCallback(async () => {
    setIsOpen(false)
    await closeTradeMarket(true, targetSl, openTrade.index)
  }, [closeTradeMarket, openTrade.index, setIsOpen, targetSl])

  const onCloseAction = useCallback(() => setIsOpen(false), [setIsOpen])

  return (
    <Dialog
      sx={{
        '.MuiDialog-paper': {
          width: '440px',
          borderRadius: '8px',
          background: theme.background.primary,
          // backgroundColor: theme.palette.mode === 'dark' ? '#1B1E24' : '',
        },
      }}
      open={isOpen}
    >
      <DialogContent sx={{ padding: 0, color: theme.text.primary }}>
        <div css={dialogContent}>
          <div
            className="dialog-header"
            css={css`
              border-bottom: ${theme.splitLine.primary};
            `}
          >
            <span>
              <Trans>BTC/USDT(Update SL/TP)</Trans>
            </span>
            <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={onCloseAction} />
          </div>
          <div
            css={css`
              padding: 24px 0 0;
              border-bottom: ${theme.splitLine.primary};
            `}
          >
            <div className="confirm-content-input">
              <div
                css={css`
                  padding: 0 24px;
                  margin-bottom: 16px;
                `}
              >
                <div>
                  {(slSetting !== 0 || !slUsePercentage) && (
                    <div
                      css={css`
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 8px 0;
                      `}
                    >
                      <div>
                        {t`StopLoss`}{' '}
                        <span
                          css={css`
                            color: #db4c40;
                          `}
                        >
                          (
                          {slUsePercentage
                            ? '$' + getBigNumberStr(targetSl, tradePair.fixDecimals)
                            : getBigNumberStr(slPercentage, 2) + '%'}
                          )
                        </span>
                      </div>
                      {/* <span>
                        {isNaN(slPercentage.times(openTrade.initialPosToken).div(100).toNumber())
                          ? '--'
                          : getBigNumberStr(slPercentage.times(openTrade.initialPosToken).div(100), 2)}
                        {tradePool.symbol}
                      </span> */}
                    </div>
                  )}
                  {slSetting === 0 && slUsePercentage && (
                    <div
                      css={css`
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 8px 0;
                      `}
                    >
                      <div>
                        {t`StopLoss`}{' '}
                        <span
                          css={css`
                            color: #db4c40;
                          `}
                        >
                          ({t`None`})
                        </span>
                      </div>
                      {/* <span
                        css={css`
                          color: #db4c40;
                        `}
                      >
                        {t`None`}
                      </span> */}
                    </div>
                  )}
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      background: ${theme.background.second};
                      > span {
                        cursor: pointer;
                      }
                    `}
                  >
                    <span
                      css={slSetting === 0 && slUsePercentage ? activeTab : normalTab}
                      onClick={() => handleTpSLSetting(true, 0)}
                    >
                      None
                    </span>
                    <span
                      css={slSetting === -10 && slUsePercentage ? activeTab : normalTab}
                      onClick={() => handleTpSLSetting(true, -10)}
                    >
                      -10%
                    </span>
                    <span
                      css={slSetting === -25 && slUsePercentage ? activeTab : normalTab}
                      onClick={() => handleTpSLSetting(true, -25)}
                    >
                      -25%
                    </span>
                    <span
                      css={slSetting === -50 && slUsePercentage ? activeTab : normalTab}
                      onClick={() => handleTpSLSetting(true, -50)}
                    >
                      -50%
                    </span>
                    <span
                      css={slSetting === -75 && slUsePercentage ? activeTab : normalTab}
                      onClick={() => handleTpSLSetting(true, -75)}
                    >
                      -75%
                    </span>
                    <Input
                      type="number"
                      placeholder="Price"
                      disableUnderline={true}
                      value={slPrice}
                      onChange={(event) => {
                        const num = +event.target.value
                        if (!isNaN(num)) {
                          setSlSetting(num)
                          setSlPrice(new BigNumber(event.target.value))
                        }
                      }}
                      onClick={() => setUseSlPercentage(false)}
                      sx={{
                        height: '28px',
                        fontSize: '14px',
                        minHeight: '28px',
                        width: '73px',
                        '& .MuiOutlinedInput-root': {
                          height: '28px',
                          minHeight: '28px',
                          padding: 0,
                        },
                        '& .MuiInputBase-input': {
                          background: theme.background.second,
                          color: theme.text.primary,
                          padding: '0px 0px 0px 4px',
                          margin: '4px 4px 5px 0',
                        },
                      }}
                    />
                  </div>
                  <KRAVButton disabled={slLimit !== SlLimitState.UPDATE} onClick={slAction} sx={{ marginTop: '20px' }}>
                    {i18n.t(slButtonText)}
                  </KRAVButton>
                </div>
                <div>
                  {(tpSetting !== 0 || !tpUsePercentage) && (
                    <div
                      css={css`
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 16px 0 8px;
                      `}
                    >
                      <div>
                        {t`Take Profit`}{' '}
                        <span
                          css={css`
                            color: #009b72;
                          `}
                        >
                          (
                          {tpUsePercentage
                            ? '$' + getBigNumberStr(targetTp, tradePair.fixDecimals)
                            : getBigNumberStr(tpPercentage, 2) + '%'}
                          )
                        </span>
                      </div>
                      {/* {isNaN(tpPercentage.times(openTrade.initialPosToken).div(100).toNumber())
                        ? '--'
                        : getBigNumberStr(tpPercentage.times(openTrade.initialPosToken).div(100), 2)}
                      {tradePool.symbol} */}
                    </div>
                  )}
                  {tpSetting === 0 && tpUsePercentage && (
                    <>
                      <div
                        css={css`
                          display: flex;
                          align-items: center;
                          justify-content: space-between;
                          padding: 16px 0 8px;
                        `}
                      >
                        <div>
                          {t`Take Profit`}{' '}
                          <span
                            css={css`
                              color: #009b72;
                            `}
                          >
                            (None)
                          </span>
                        </div>
                        {/* <span
                          css={css`
                            color: #009b72;
                          `}
                        >
                          {t`None`}
                        </span> */}
                      </div>
                    </>
                  )}
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                      background: ${theme.background.second};
                      justify-content: space-between;
                      > span {
                        cursor: pointer;
                      }
                    `}
                  >
                    <span
                      css={tpSetting === 25 && tpUsePercentage ? activeTab : normalTab}
                      onClick={() => handleTpSLSetting(false, 25)}
                    >
                      25%
                    </span>
                    <span
                      css={tpSetting === 50 && tpUsePercentage ? activeTab : normalTab}
                      onClick={() => handleTpSLSetting(false, 50)}
                    >
                      50%
                    </span>
                    <span
                      css={tpSetting === 100 && tpUsePercentage ? activeTab : normalTab}
                      onClick={() => handleTpSLSetting(false, 100)}
                    >
                      100%
                    </span>
                    <span
                      css={tpSetting === 300 && tpUsePercentage ? activeTab : normalTab}
                      onClick={() => handleTpSLSetting(false, 300)}
                    >
                      300%
                    </span>
                    <span
                      css={tpSetting === 900 && tpUsePercentage ? activeTab : normalTab}
                      onClick={() => handleTpSLSetting(false, 900)}
                    >
                      900%
                    </span>
                    <Input
                      type="number"
                      placeholder="Price"
                      disableUnderline={true}
                      value={tpPrice}
                      onChange={(event) => {
                        const num = +event.target.value
                        if (!isNaN(num)) {
                          setTpSetting(num)
                          setTpPrice(new BigNumber(event.target.value))
                        }
                      }}
                      onClick={() => setTpUsePercentage(false)}
                      sx={{
                        height: '28px',
                        fontSize: '14px',
                        minHeight: '28px',
                        width: '73px',
                        '& .MuiOutlinedInput-root': {
                          height: '28px',
                          minHeight: '28px',
                          padding: 0,
                        },
                        '& .MuiInputBase-input': {
                          background: theme.background.second,
                          color: theme.text.primary,
                          padding: '0px 0px 0px 4px',
                          margin: '4px 4px 5px 0',
                        },
                      }}
                    />
                  </div>
                  <KRAVButton disabled={tpLimit !== TpLimitState.UPDATE} onClick={tpAction} sx={{ marginTop: '20px' }}>
                    {i18n._(tpButtonText)}
                  </KRAVButton>
                </div>
              </div>
            </div>
          </div>
          <div
            css={css`
              padding: 24px;
            `}
          >
            <div className="confirm-content-info">
              <p>
                <span>{t`Entry price`}</span>
                <span>
                  ${typeof openTrade.openPrice === 'string' ? openTrade.openPrice : openTrade.openPrice.toFixed(2, 3)}
                </span>
              </p>
              <p>
                <span>{t`Current price`}</span>
                <span>${btcPrice.toFixed(tradePair.fixDecimals)}</span>
              </p>
              <p>
                <span>{t`Current TP`}</span>
                <span>${new BigNumber(openTrade.tp).toFixed(tradePair.fixDecimals)}</span>
              </p>
              <p>
                <span>{t`Current SL`}</span>
                <span>${new BigNumber(openTrade.sl).toFixed(tradePair.fixDecimals)}</span>
              </p>
              <p>
                <span>{t`Liquidation Price`}</span>
                <span>${lqPrice.toFixed(tradePair.fixDecimals)}</span>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// const useTpLimit = (
//   openTrade: any,
//   targetTp: any,
//   tpUsePercentage: any,
//   tpPrice: any,
//   tpPercentage: any,
//   btcPrice: any,
//   pairContract: any
// ) => {
//   const openPrice = useMemo(() => new BigNumber(openTrade.openPrice), [openTrade.openPrice])
//   const { takeProfit: percentage } = useGetTakeProfit(
//     openPrice,
//     targetTp,
//     openTrade.buy,
//     openTrade.leverage,
//     false,
//     openTrade.trader,
//     openTrade.positionSizeDai,
//     openTrade.index,
//     openTrade.pairIndex,
//     pairContract
//   )

//   const tpLimit = useMemo(() => {
//     if (isNaN(targetTp.toNumber()) || targetTp.isLessThan(0)) return TpLimitState.INVALID
//     if (targetTp.isLessThanOrEqualTo(openTrade.openPrice) && openTrade.buy) return TpLimitState.TP_LT_OPEN_PRICE
//     if (targetTp.isGreaterThanOrEqualTo(openTrade.openPrice) && !openTrade.buy) return TpLimitState.TP_GT_OPEN_PRICE
//     if (percentage.isGreaterThan(900)) return TpLimitState.MAX_TP_LIMIT
//     return TpLimitState.UPDATE
//   }, [targetTp, openTrade.buy, percentage, openTrade.openPrice])

//   return tpLimit
// }

// const useSlLimit = (
//   openTrade: any,
//   targetSl: any,
//   slUsePercentage: any,
//   slPrice: any,
//   slPercentage: any,
//   btcPrice: any,
//   pairContract: any
// ) => {
//   const openPrice = useMemo(() => new BigNumber(openTrade.openPrice), [openTrade.openPrice])

//   const { takeProfit: percentage } = useGetTakeProfit(
//     openPrice,
//     targetSl,
//     openTrade.buy,
//     openTrade.leverage,
//     true,
//     openTrade.trader,
//     openTrade.positionSizeDai,
//     openTrade.index,
//     openTrade.pairIndex,
//     pairContract
//   )

//   const slLimit = useMemo(() => {
//     if (isNaN(targetSl.toNumber()) || targetSl.isLessThan(0)) return SlLimitState.INVALID
//     if (targetSl.isLessThanOrEqualTo(openTrade.openPrice) && openTrade.buy) return SlLimitState.SL_LT_OPEN_PRICE
//     if (targetSl.isGreaterThanOrEqualTo(openTrade.openPrice) && !openTrade.buy) return SlLimitState.SL_GT_OPEN_PRICE
//     if (percentage.isGreaterThan(75)) return SlLimitState.MAX_SL_LIMIT
//     return SlLimitState.UPDATE
//   }, [targetSl, openTrade.buy, percentage, openTrade.openPrice])

//   return slLimit
// }
