/** @jsxImportSource @emotion/react */
import { Checkbox, Dialog, DialogContent } from '@mui/material'
import { dialogContent } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import KRAVButton from '../KravUIKit/KravButton'
import { css } from '@emotion/react'
import { Tuple } from '../Trades/type'
import { useOpenTrade } from '../../hook/hookV8/useOpenTrade'
import { eXDecimals, getBorrowFees, getLiqPrice } from '../../utils/math'
import { OPEN_FEES } from '../../constant/math'
import BigNumber from 'bignumber.js'
import { useRootStore } from '../../store/root'
import { ReactComponent as ArrowDownIcon } from 'assets/imgs/arrowDown.svg'
import { decodeReferral } from '../../utils'

export type ConfirmTradeDialogProp = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  tuple: Tuple
  tradeType: number
  openBTCSize: BigNumber
  setPositionSizeDai: Dispatch<React.SetStateAction<BigNumber>>
  setOpenBTCSize: Dispatch<React.SetStateAction<BigNumber>>
  setLeverage: Dispatch<React.SetStateAction<number>>
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
}: ConfirmTradeDialogProp) => {
  const tradePool = useRootStore((store) => store.tradePool)
  const [checked, setChecked] = useState(false)
  const [referralAddress, setReferralAddress] = useState('0x0000000000000000000000000000000000000000')
  const handleSlippagePChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  const openTrade = useOpenTrade({
    tuple: tuple,
    tradeType: tradeType,
    spreadReductionId: 0,
    slippageP: checked ? '10400000000' : '3399999999',
    referral: referralAddress,
    tradingAddress: tradePool.tradingT,
    storageAddress: tradePool.storageT,
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
          background: '#fff',
          // backgroundColor: theme.palette.mode === 'dark' ? '#1B1E24' : '',
        },
      }}
      open={isOpen}
    >
      <DialogContent sx={{ padding: 0, color: '#000' }}>
        <div css={dialogContent}>
          <div className="dialog-header ">
            <span>{tradeType === 0 ? (tuple.buy ? 'Confirm Long' : 'Confirm Short') : 'Confirm Limit Order'}</span>
            <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
          </div>
          <div
            css={css`
              padding: 24px;
              border-bottom: 1px solid #f6f6f6;
            `}
          >
            <div className="confirm-content-input">
              <div>
                <p
                  css={css`
                    margin-bottom: 36px;
                  `}
                >
                  Pay {eXDecimals(tuple.positionSizeDai, 18).toFixed(2)} {tradePool.symbol} ($
                  {eXDecimals(tuple.positionSizeDai, 18).toFixed(2)})
                </p>
                <p>
                  <ArrowDownIcon />
                </p>
                <p>
                  {tuple.buy ? 'Long' : 'Short'} {openBTCSize.toFixed(4)} BTC($
                  {openBTCSize.times(eXDecimals(tuple.openPrice, 18)).toFixed(2)})
                </p>
              </div>
            </div>
            <div className="confirm-content-info">
              <p>
                <span>Collateral in</span>
                <span>{tradePool.symbol}</span>
              </p>
              <p>
                <span>Leverage</span>
                <span>{tuple.leverage}x</span>
              </p>
              <p>
                <span>Entry Price</span>
                <span>${eXDecimals(tuple.openPrice, 10).toFixed(2)}</span>
              </p>
              <p>
                <span>Liq. Price</span>
                <span>
                  $
                  {getLiqPrice(
                    eXDecimals(tuple.openPrice, 10),
                    eXDecimals(tuple.positionSizeDai, 18),
                    tuple.buy,
                    tuple.leverage
                  ).toFixed(2)}
                </span>
              </p>
              <p>
                <span>Fees</span>
                <span>
                  {eXDecimals(tuple.positionSizeDai, 18).times(OPEN_FEES).toFixed(2)} {tradePool.symbol}
                </span>
              </p>
              <p>
                <span>Collateral</span>
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
              <p>
                <span>Spread</span>
                <span>0.00%</span>
              </p>
              <p>
                <span>Entry Price</span>
                <span>${eXDecimals(tuple.openPrice, 18).toFixed(2)}</span>
              </p>
              <p>
                <span>Borrow Fee</span>
                <span>{getBorrowFees(tradePool.fundingFeePerBlockP)}%/1h</span>
              </p>
              {/*<p>*/}
              {/*  <span>Execution Fee</span>*/}
              {/*  <span>-{tradePool.symbol}</span>*/}
              {/*</p>*/}
              <p>
                <span>Allowed Slippage</span>
                <span>0.30%</span>
              </p>
              <p>
                <span>Allow up to 1% Slippage </span>
                <Checkbox
                  checked={checked}
                  onChange={handleSlippagePChecked}
                  sx={{
                    padding: 0,
                    '&.Mui-checked': {
                      color: '#000',
                    },
                  }}
                />
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
            <KRAVButton
              onClick={async () => {
                setIsOpen(false)
                await openTrade()
                setPositionSizeDai(new BigNumber(0))
                setOpenBTCSize(new BigNumber(0))
                setLeverage(2)
              }}
              sx={{ marginTop: '20px' }}
            >
              {tuple.buy ? 'Long' : 'Short'}
            </KRAVButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
