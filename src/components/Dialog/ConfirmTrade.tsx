/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent, useMediaQuery, useTheme } from '@mui/material'
import { dialogContent } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { css } from '@emotion/react'
import { TupleWithTrade } from '../Trades/type'
import { useOpenTrade } from '../../hook/hookV8/useOpenTrade'
import { addDecimals, eXDecimals, getFees, getLiqPrice } from '../../utils/math'
import BigNumber from 'bignumber.js'
import { useRootStore } from '../../store/root'
import { decodeReferral } from '../../utils'
import KRAVLongButton from '../KravUIKit/KravLongButton'
import KRAVShortButton from '../KravUIKit/KravShortButton'
import { TradeMode } from '../../store/TradeSlice'
import { t } from '@lingui/macro'

export type ConfirmTradeDialogProp = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  tuple: TupleWithTrade
  tradeType: number
  openBTCSize: BigNumber
  setPositionSizeDai: Dispatch<React.SetStateAction<BigNumber>>
  setOpenBTCSize: Dispatch<React.SetStateAction<BigNumber>>
  setLeverage: Dispatch<React.SetStateAction<number>>
  entryPrice: string
}

export const ConfirmTrade = ({
  isOpen,
  setIsOpen,
  tuple,
  tradeType,
  openBTCSize,
  setPositionSizeDai,
  setOpenBTCSize,
  setLeverage,
  entryPrice,
}: ConfirmTradeDialogProp) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const tradePool = useRootStore((store) => store.tradePool)
  const slippagePercent = useRootStore((store) => store.slippagePercent)
  const tradeModel = useRootStore((store) => store.tradeModel)
  // const pairConfig = useRootStore((state) => state.pairConfig)
  // const [checked, setChecked] = useState(false)
  const [referralAddress, setReferralAddress] = useState('0x0000000000000000000000000000000000000000')
  // const handleSlippagePChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setChecked(event.target.checked)
  // }

  // const tradePair = useMemo(() => {
  //   return pairConfig[tuple.pairIndex]
  // }, [tuple, pairConfig])

  const openTrade = useOpenTrade({
    tuple: tuple,
    tradeType: tradeType,
    spreadReductionId: 0,
    slippageP: addDecimals(slippagePercent + '', 10).toFixed(),
    referral: referralAddress,
    tradingAddress: tradePool.tradingT,
    storageAddress: tradePool.storageT,
    tokenAddress: tradePool.tokenT,
  })

  useEffect(() => {
    const referral = localStorage.getItem('krav-referral')
    if (referral) {
      setReferralAddress(decodeReferral(referral))
    }
  }, [tuple])

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
          <div className="dialog-header ">
            <span
              css={css`
                font-size: ${isMobile ? '18px' : '20px'};
              `}
            >
              {tradeType === 0 ? (tuple.buy ? t`Confirm Long` : t`Confirm Short`) : t`Confirm Limit Order`}
            </span>
            <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
          </div>
          <div
            css={css`
              padding: 24px;
              border-bottom: ${theme.splitLine.primary};
            `}
          >
            <div
              className="confirm-content-input"
              css={css`
                background: ${theme.background.second};
              `}
            >
              <div>
                <p
                  css={css`
                    margin-bottom: 36px;
                    font-weight: 500;
                    font-size: 32px;
                  `}
                >
                  {t`Pay`} {eXDecimals(tuple.positionSizeDai, 18).toFixed(2)} {tradePool.symbol}
                </p>
              </div>
            </div>
            <div className="confirm-content-info">
              <p>
                <span>{t`Collateral in`}</span>
                <span>{tradePool.symbol}</span>
              </p>
              <p>
                <span>{t`Leverage`}</span>
                <span>{tuple.leverage}x</span>
              </p>
              <p>
                <span>{t`Entry Price`}</span>
                <span>
                  {/* ${eXDecimals(tuple.openPrice, 10).toFixed(tradePair.fixDecimals)} */}
                  {entryPrice}
                </span>
              </p>
              <p>
                <span>{t`Liq. Price`}</span>
                <span>
                  $
                  {parseFloat(
                    getLiqPrice(
                      eXDecimals(tuple.openPrice, 10),
                      eXDecimals(tuple.positionSizeDai, 18),
                      tuple.buy,
                      tuple.leverage
                    ).toString()
                  ).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>
              </p>
              {tuple.leverage <= 50 && (
                <p>
                  <span>{t`Fees`}</span>
                  <span>
                    {eXDecimals(getFees(new BigNumber(tuple.positionSizeDai), tuple.leverage), 18).toFixed(2)}{' '}
                    {tradePool.symbol}
                  </span>
                </p>
              )}
              <p>
                <span>{t`Collateral`}</span>
                <span>{eXDecimals(tuple.positionSizeDai, 18).toFixed(2)}</span>
              </p>
            </div>
          </div>
          <div
            css={css`
              padding: 24px;
            `}
          >
            <div className="confirm-content-info">
              {/*<p>*/}
              {/*  <span>Entry Price</span>*/}
              {/*  <span>${eXDecimals(tuple.openPrice, 10).toFixed(2)}</span>*/}
              {/*</p>*/}
              {/* <p>
                <span>Funding Fee</span>
                <span>{getBorrowFees(tradePool.fundingFeePerBlockP)}%/hr</span>
              </p> */}
              {/*<p>*/}
              {/*  <span>Execution Fee</span>*/}
              {/*  <span>-{tradePool.symbol}</span>*/}
              {/*</p>*/}
              <p>
                <span>{t`Allowed Slippage`}</span>
                <span>{slippagePercent}%</span>
                {/* <span>0.30%</span> */}
              </p>
              <p>
                {/* <span>Allow up to 1% Slippage </span>
                <Checkbox
                  checked={checked}
                  onChange={handleSlippagePChecked}
                  sx={{
                    padding: 0,
                    '&.Mui-checked': {
                      color: theme.palette.mode === 'dark' ? '#2832f5' : '#000',
                    },
                  }}
                /> */}
              </p>
            </div>
            {/*{transactionState !== TransactionState.START_OPEN_TRADE && (*/}
            {/*  <KRAVButton*/}
            {/*    onClick={async () => {*/}
            {/*      setIsOpen(false)*/}
            {/*      await openTrade()*/}
            {/*    }}*/}
            {/*    sx={{ marginTop: '20px' }}*/}
            {/*  >*/}
            {/*    {tuple.buy ? 'Long' : 'Short'}*/}
            {/*  </KRAVButton>*/}
            {/*)}*/}
            {/*{transactionState === TransactionState.START_OPEN_TRADE && (*/}
            {/*  <KRAVButton sx={{ marginTop: '20px' }}>{tuple.buy ? 'Long...' : 'Short...'}</KRAVButton>*/}
            {/*)}*/}
            {tuple.buy ? (
              <KRAVLongButton
                onClick={async () => {
                  setIsOpen(false)
                  await openTrade()
                  setPositionSizeDai(new BigNumber(0))
                  setOpenBTCSize(new BigNumber(0))
                  setLeverage(2)
                }}
                sx={{ marginTop: '20px' }}
              >
                {t`Long`}
              </KRAVLongButton>
            ) : (
              <KRAVShortButton
                onClick={async () => {
                  setIsOpen(false)
                  await openTrade()
                  setPositionSizeDai(new BigNumber(0))
                  setOpenBTCSize(new BigNumber(0))
                  setLeverage(tradeModel === TradeMode.DEGEN ? 51 : 2)
                }}
                sx={{ marginTop: '20px' }}
              >
                {t`Short`}
              </KRAVShortButton>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
