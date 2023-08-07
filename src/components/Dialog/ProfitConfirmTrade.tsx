/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent, Input } from '@mui/material'
import { dialogContent } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import KRAVButton from '../KravUIKit/KravButton'
import { css } from '@emotion/react'
import { useRootStore } from '../../store/root'
import { getBigNumberStr } from '../../utils'
import BigNumber from 'bignumber.js'
import { getReachPrice, getTakeProfit } from '../../utils/math'
import { activeTab, normalTab } from '../Trades/TradeRight/style'
import { Tuple } from '../Trades/type'
import { useUpdateTradeMarket } from '../../hook/hookV8/useCloseTradeMarket'
import { PoolParams } from '../../store/FactorySlice'

export type ConfirmTradeDialogProp = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  lqPrice: BigNumber
  btcPrice: BigNumber
  openTrade: Tuple
  pool: PoolParams | undefined
}

export const ProfitConfirmTrade = ({
  isOpen,
  setIsOpen,
  lqPrice,
  btcPrice,
  openTrade,
  pool,
}: ConfirmTradeDialogProp) => {
  const tradePool = useRootStore((store) => store.tradePool)
  const [slUsePercentage, setUseSlPercentage] = useState(BigNumber(openTrade.tp).gt(0) ? false : true)
  const [tpUsePercentage, setTpUsePercentage] = useState(BigNumber(openTrade.sl).gt(0) ? false : true)
  const [tpSetting, setTpSetting] = useState(0)
  const [slSetting, setSlSetting] = useState(0)
  const [slPrice, setSlPrice] = useState<BigNumber | string>(openTrade.sl)
  const [tpPrice, setTpPrice] = useState<BigNumber | string>(openTrade.tp)

  console.log(tradePool)
  const targetSl = useMemo(() => {
    return slUsePercentage
      ? slSetting === 0
        ? new BigNumber(0)
        : getReachPrice(openTrade.leverage, openTrade.buy, slSetting, btcPrice)
      : new BigNumber(slPrice)
  }, [slUsePercentage, openTrade.leverage, openTrade.buy, slSetting, btcPrice, slPrice])

  const targetTp = useMemo(() => {
    return tpUsePercentage
      ? tpSetting === 0
        ? new BigNumber(0)
        : getReachPrice(openTrade.leverage, openTrade.buy, tpSetting, btcPrice)
      : new BigNumber(tpPrice)
  }, [tpUsePercentage, openTrade.leverage, openTrade.buy, tpSetting, btcPrice, tpPrice])

  const slPercentage = useMemo(() => {
    return getTakeProfit(btcPrice, targetSl, openTrade.buy, openTrade.leverage, true)
  }, [btcPrice, openTrade.buy, openTrade.leverage, targetSl])

  const tpPercentage = useMemo(() => {
    return getTakeProfit(btcPrice, targetTp, openTrade.buy, openTrade.leverage, false)
  }, [btcPrice, openTrade.buy, openTrade.leverage, targetTp])

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

  return (
    <Dialog
      sx={{
        '.MuiDialog-paper': {
          width: '440px',
          borderRadius: '8px',
          background: '#fff',
          // backgroundColor: theme.palette.mode === 'dark' ? '#1B1E24' : '',
        },
      }}
      open={isOpen}
    >
      <DialogContent sx={{ padding: 0, color: '#000' }}>
        <div css={dialogContent}>
          <div className="dialog-header ">
            <span>BTC/USDT(Update SL/TP)</span>
            <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
          </div>
          <div
            css={css`
              padding: 24px 0 0;
              border-bottom: 1px solid #f6f6f6;
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
                        StopLoss{' '}
                        <span
                          css={css`
                            color: #db4c40;
                          `}
                        >
                          (
                          {slUsePercentage
                            ? '$' + getBigNumberStr(targetSl, 2)
                            : getBigNumberStr(slPercentage, 2) + '%'}
                          )
                        </span>
                      </div>
                      <span>
                        {isNaN(slPercentage.times(openTrade.initialPosToken).div(100).toNumber())
                          ? '--'
                          : getBigNumberStr(slPercentage.times(openTrade.initialPosToken).div(100), 2)}
                        {tradePool.symbol}
                      </span>
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
                        StopLoss{' '}
                        <span
                          css={css`
                            color: #db4c40;
                          `}
                        >
                          (None)
                        </span>
                      </div>
                      <span
                        css={css`
                          color: #db4c40;
                        `}
                      >
                        None
                      </span>
                    </div>
                  )}
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      background: #f7f7f7;
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
                      placeholder="Price |"
                      disableUnderline={true}
                      value={slPrice}
                      onChange={(event) => {
                        setSlPrice(new BigNumber(event.target.value))
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
                          background: '#fff!important',
                          padding: '0px 0px 0px 4px',
                          margin: '4px 4px 5px 0',
                        },
                      }}
                    />
                  </div>
                  <KRAVButton
                    onClick={async () => {
                      setIsOpen(false)
                      closeTradeMarket(true, targetSl, openTrade.index)
                    }}
                    sx={{ marginTop: '20px' }}
                  >
                    Update
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
                        Take Profit{' '}
                        <span
                          css={css`
                            color: #009b72;
                          `}
                        >
                          (
                          {tpUsePercentage
                            ? '$' + getBigNumberStr(targetTp, 2)
                            : getBigNumberStr(tpPercentage, 2) + '%'}
                          )
                        </span>
                      </div>
                      {isNaN(tpPercentage.times(openTrade.initialPosToken).div(100).toNumber())
                        ? '--'
                        : getBigNumberStr(tpPercentage.times(openTrade.initialPosToken).div(100), 2)}
                      {tradePool.symbol}
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
                          Take Profit{' '}
                          <span
                            css={css`
                              color: #009b72;
                            `}
                          >
                            (None)
                          </span>
                        </div>
                        <span
                          css={css`
                            color: #009b72;
                          `}
                        >
                          None
                        </span>
                      </div>
                    </>
                  )}
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                      background: #f7f7f7;
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
                      placeholder="Price |"
                      disableUnderline={true}
                      value={tpPrice}
                      onChange={(event) => {
                        setTpPrice(new BigNumber(event.target.value))
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
                          background: '#fff!important',
                          padding: '0px 0px 0px 4px',
                          margin: '4px 4px 5px 0',
                        },
                      }}
                    />
                  </div>
                  <KRAVButton
                    onClick={async () => {
                      setIsOpen(false)
                      closeTradeMarket(false, targetTp, openTrade.index)
                    }}
                    sx={{ marginTop: '20px' }}
                  >
                    Update
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
                <span>Current price</span>
                <span>${btcPrice.toFixed(2)}</span>
              </p>
              <p>
                <span>Liquidation price</span>
                <span>${lqPrice.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
