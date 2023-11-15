/** @jsxImportSource @emotion/react */
import { Slider, TextField, useTheme } from '@mui/material'
import { css } from '@emotion/react'
import { Trans } from '@lingui/macro'
import { align } from '../../../globalStyle'
import { attention, input, orderParamsTab } from './style'
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import KRAVButton from '../../KravUIKit/KravButton'
import { ConfirmTrade } from '../../../components/Dialog/ConfirmTrade'
import { useApprove } from '../../../hook/hookV8/useApprove'
import { useRootStore } from '../../../store/root'
import { useWeb3React } from '@web3-react/core'
import { addDecimals, getFees, getLongOrShortUSD } from '../../../utils/math'
import { ReactComponent as AttentionIcon } from '../../../assets/imgs/attention.svg'
import { TransactionAction, TransactionState } from '../../../store/TransactionSlice'
import { useMaxPositionCheck } from '../../../hook/hookV8/useMaxPositionCheck'
import { POSITION_LIMITS } from '../../../constant/math'
import { getBigNumberStr } from '../../../utils'
import { useGetOrderLimit } from '../../../hook/hookV8/useGetOrderLimt'
import KravLongButton from '../../KravUIKit/KravLongButton'
import KravShortButton from '../../KravUIKit/KravShortButton'
import { TradeMode } from '../../../store/TradeSlice'
import { ReactComponent as AlertIcon } from '../../../assets/imgs/alert.svg'
import { useInterval } from '../../../hook/hookV8/useInterval'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

type OrderParamsCardProps = {
  leverage: number
  setLeverage: React.Dispatch<React.SetStateAction<number>>
  positionSizeDai: BigNumber
  setPositionSizeDai: React.Dispatch<React.SetStateAction<BigNumber>>
  tpPrice: BigNumber | string
  setTpPrice: React.Dispatch<React.SetStateAction<string | BigNumber>>
  slPrice: BigNumber | string
  setSlPrice: React.Dispatch<React.SetStateAction<string | BigNumber>>
  isBuy: boolean
  limitPrice: string | BigNumber
  setLimitPrice: React.Dispatch<React.SetStateAction<string | BigNumber>>
  tradeType: number
  setTradeType: React.Dispatch<React.SetStateAction<number>>
}

enum ButtonText {
  CONNECT_WALLET = 'Connect Wallet',
  ENTER_AMOUNT = 'Enter an amount',
  APPROVE = 'Approve ...',
  CHECK_APPROVE = 'Check approve',
  LONG = 'Long',
  SHORT = 'Short',
  INSUFFICIENT_BALANCE = 'Insufficient Balance',
  REACHED_LIMIT = 'Reached max positions limit',
  MIN_SIZE = 'Min position size is 1500',
}

//TODO Add sl and tp setting
export const OrderParamsCard = ({
  leverage,
  setLeverage,
  positionSizeDai,
  setPositionSizeDai,
  tpPrice,
  setTpPrice,
  slPrice,
  setSlPrice,
  isBuy,
  limitPrice,
  setLimitPrice,
  tradeType,
  setTradeType,
}: OrderParamsCardProps) => {
  const theme = useTheme()
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [openBTCSize, setOpenBTCSize] = useState(new BigNumber(0))
  const [tabIndex, setTabIndex] = useState(0)
  const { provider } = useWeb3React()
  // const [slSetting, setSlSetting] = useState(0)
  const [slUsePercentage, setUseSlPercentage] = useState(true)
  // const [tpSetting, setTpSetting] = useState(0)
  const [tpUsePercentage, setTpUsePercentage] = useState(true)
  const [showConfirmTip, setShowConfirmTip] = useState(false)
  const { orderLimit, getOrderLimit } = useGetOrderLimit()
  const {
    BTCPrice,
    transactionState,
    isLoadingFactory,
    tradePool,
    setErrorContent,
    setWalletDialogVisibility,
    userOpenLimitList,
    userOpenTradeList,
    tradeModel,
    userPositionDatas,
    setIsOpenSelectToken,
    tradePairIndex,
  } = useRootStore((state) => ({
    BTCPrice: state.BTCPrice,
    transactionState: state.transactionState,
    isLoadingFactory: state.isLoadingFactory,
    tradePool: state.tradePool,
    setErrorContent: state.setErrorContent,
    setWalletDialogVisibility: state.setWalletDialogVisibility,
    userOpenLimitList: state.userOpenLimitList,
    userOpenTradeList: state.userOpenTradeList,
    tradeModel: state.tradeModel,
    userPositionDatas: state.userPositionDatas,
    setIsOpenSelectToken: state.setIsOpenSelectToken,
    tradePairIndex: state.tradePairIndex,
  }))

  const PoolWalletBalance = useMemo(() => {
    return (
      userPositionDatas.find((item) => item.pool?.tradingT === tradePool?.tradingT)?.walletBalance ?? new BigNumber(0)
    )
  }, [tradePool, userPositionDatas])

  const { account } = useWeb3React()
  const [buttonState, setButtonState] = useState<ButtonText>(ButtonText.CONNECT_WALLET)
  const testTuple = useMemo(() => {
    return {
      trader: account!,
      // sl: addDecimals(targetSl, 10).toFixed(0),
      // tp: addDecimals(targetTp, 10).toFixed(0),
      sl: '0',
      tp: '0',
      pairIndex: tradePairIndex,
      openPrice: addDecimals(tradeType === 0 ? BTCPrice : limitPrice, 10).toFixed(0, 1),
      leverage: leverage,
      initialPosToken: 0,
      index: 0,
      buy: isBuy,
      positionSizeDai: addDecimals(positionSizeDai, tradePool.decimals).toString(),
    }
  }, [
    account,
    tradeType,
    BTCPrice,
    limitPrice,
    leverage,
    positionSizeDai,
    // slSetting,
    slUsePercentage,
    // tpSetting,
    tpPrice,
    tpUsePercentage,
    tradePairIndex,
  ])

  const approve = useApprove(tradePool.tokenT, tradePool.tradingT, tradePool.storageT)
  const maxPositionCheck = useMaxPositionCheck()

  const handleButtonClick = async () => {
    try {
      const passCheck = await maxPositionCheck(positionSizeDai, leverage)
      if (!passCheck.state) {
        setErrorContent({
          dialogVisibility: true,
          action: TransactionAction.OPEN_TRADE,
          reason: 'Maximum position limit exceeded! max amount : ' + passCheck.maxAmount?.toFixed(2),
        })
        return
      }
      await approve(setOpenConfirmDialog, addDecimals(positionSizeDai, tradePool.decimals))
    } catch (e) {
      setErrorContent({
        dialogVisibility: true,
        action: TransactionAction.OPEN_TRADE,
      })
    }
  }

  const handleLeverageChange = (event: Event, value: number | number[], activeThumb: number) => {
    const newLeverage = value as number
    setLeverage(value as number)
    const outputAmount = getLongOrShortUSD(
      newLeverage,
      positionSizeDai,
      getFees(positionSizeDai, newLeverage),
      BTCPrice,
      tradePool?.proportionBTC
    )
    setOpenBTCSize(outputAmount)
  }

  const handleSliderClick = () => {
    const outputAmount = getLongOrShortUSD(
      leverage,
      positionSizeDai,
      getFees(positionSizeDai, leverage),
      BTCPrice,
      tradePool?.proportionBTC
    )
    setOpenBTCSize(outputAmount)
  }

  const handlePositionDAIInput = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newValue = new BigNumber(event.target.value)
    setPositionSizeDai(newValue)
    const outputAmount = getLongOrShortUSD(
      leverage,
      newValue,
      getFees(newValue, leverage),
      BTCPrice,
      tradePool?.proportionBTC
    )
    setOpenBTCSize(outputAmount)
  }

  const handleMaxInput = () => {
    setPositionSizeDai(PoolWalletBalance)
    const outputAmount = getLongOrShortUSD(
      leverage,
      PoolWalletBalance,
      getFees(PoolWalletBalance, leverage),
      BTCPrice,
      tradePool?.proportionBTC
    )
    setOpenBTCSize(outputAmount)
  }

  useEffect(() => {
    if (!account) setButtonState(ButtonText.CONNECT_WALLET)
    else if (userOpenLimitList.length + userOpenTradeList.length === POSITION_LIMITS)
      setButtonState(ButtonText.REACHED_LIMIT)
    else if (positionSizeDai.isGreaterThan(PoolWalletBalance)) setButtonState(ButtonText.INSUFFICIENT_BALANCE)
    else if (!positionSizeDai.isEqualTo(0) && positionSizeDai.times(leverage).isLessThan(tradePool.minPositionLev))
      setButtonState(ButtonText.MIN_SIZE)
    else if (!positionSizeDai.isGreaterThan(0)) setButtonState(ButtonText.ENTER_AMOUNT)
    else if (isBuy) setButtonState(ButtonText.LONG)
    else if (!isBuy) setButtonState(ButtonText.SHORT)
  }, [account, isBuy, isLoadingFactory, userOpenLimitList, userOpenTradeList, leverage, positionSizeDai, tradePool])

  useEffect(() => {
    if (transactionState === TransactionState.CHECK_APPROVE) setButtonState(ButtonText.CHECK_APPROVE)
    if (transactionState === TransactionState.APPROVE) setButtonState(ButtonText.APPROVE)
    if (transactionState === TransactionState.APPROVE_SUCCESS) {
      isBuy ? setButtonState(ButtonText.LONG) : setButtonState(ButtonText.SHORT)
    }
  }, [transactionState])

  useEffect(() => {
    setLeverage(tradeModel === TradeMode.DEGEN ? 51 : 2)
    setPositionSizeDai(new BigNumber(0))
    setUseSlPercentage(false)
    setSlPrice(new BigNumber(0))
    setTpUsePercentage(false)
    setTpPrice(new BigNumber(0))
  }, [tradeModel])

  useEffect(() => {
    setPositionSizeDai(new BigNumber(0))
    setOpenBTCSize(new BigNumber(0))
    setLeverage(tradeModel === TradeMode.DEGEN ? 51 : 2)
  }, [isBuy])

  useEffect(() => {
    const firstOpenTrade = localStorage?.getItem('krav-first-open-trade')
    if (!firstOpenTrade) {
      setShowConfirmTip(true)
      localStorage?.setItem('krav-first-open-trade', 'false')
    }
  }, [])

  useInterval(getOrderLimit, 15000)

  useEffect(() => {
    if (tradePool.pairStorageT && tradePool.poolCurrentBalance && provider) {
      getOrderLimit().then()
    }
  }, [tradePool, provider, tradePairIndex])

  return (
    <>
      <ConfirmTrade
        isOpen={openConfirmDialog}
        setIsOpen={setOpenConfirmDialog}
        tuple={testTuple}
        tradeType={tradeType}
        openBTCSize={openBTCSize}
        setPositionSizeDai={setPositionSizeDai}
        setOpenBTCSize={setOpenBTCSize}
        setLeverage={setLeverage}
      />
      {!showConfirmTip && (
        <div
          css={css`
            font-size: 14px;
          `}
        >
          <div
            css={css`
              display: flex;
              padding: 6px;
              margin: 16px 0;
              background: ${theme.background.second};
            `}
          >
            <span
              css={[
                orderParamsTab,
                css`
                  color: ${tabIndex === 0 ? 'white' : ''};
                  background: ${tabIndex === 0 ? theme.background.third : ''};
                  margin-right: 13px;
                `,
              ]}
              onClick={() => {
                setTabIndex(0)
                setTradeType(0)
              }}
            >
              Market
            </span>
            <span
              css={[
                orderParamsTab,
                css`
                  color: ${tabIndex === 1 ? 'white' : ''};
                  background: ${tabIndex === 1 ? theme.background.third : ''};
                `,
              ]}
              onClick={() => {
                setTabIndex(1)
                setTradeType(1)
              }}
            >
              Limit
            </span>
          </div>
          <div
            css={css`
              margin-bottom: 8px;
              color: ${theme.text.primary};
            `}
          >
            <span
              css={css`
                color: #757575;
              `}
            >
              Available:
            </span>{' '}
            {getBigNumberStr(PoolWalletBalance, 6) || '0'} {tradePool?.symbol}
          </div>
          <div
            css={css`
              margin-bottom: 12px;
            `}
          >
            <span
              css={css`
                color: #757575;
              `}
            >
              Order limit:
            </span>{' '}
            <span
              css={css`
                color: #2832f5;
              `}
            >
              {getBigNumberStr(orderLimit, 6) || '0'} {tradePool?.symbol}
            </span>
          </div>
          <>
            <div>
              <div
                css={[
                  input,
                  css`
                    background: ${theme.background.second};
                  `,
                ]}
              >
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                    width: 100%;
                    justify-content: space-between;
                  `}
                >
                  <span
                    css={css`
                      color: #757575;
                    `}
                  >
                    Pay
                  </span>
                </div>
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                    width: 100%;
                    justify-content: space-between;
                  `}
                >
                  <TextField
                    variant="standard"
                    type="number"
                    value={positionSizeDai}
                    onChange={handlePositionDAIInput}
                    InputProps={{
                      disableUnderline: true,
                    }}
                    sx={{
                      height: '28px',
                      fontSize: '20px',
                      minHeight: '28px',
                      '& .MuiOutlinedInput-root': {
                        height: '28px',
                        minHeight: '28px',
                        padding: 0,
                      },
                    }}
                  />
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                    `}
                  >
                    <div
                      css={css`
                        border-radius: 2px;
                        color: ${theme.text.primary};
                        background: ${theme.palette.mode === 'dark' ? '#2832f5' : '#a4a8fe'};
                        padding: 2px 6px;
                        font-size: 12px;
                        cursor: pointer;
                      `}
                      onClick={handleMaxInput}
                    >
                      MAX
                    </div>
                    <div
                      onClick={() => setIsOpenSelectToken(true)}
                      css={[
                        align,
                        css`
                          cursor: pointer;
                        `,
                      ]}
                    >
                      <span
                        css={css`
                          margin: 0 4px;
                          color: ${theme.palette.mode === 'dark' ? '#727272' : '#000'};
                        `}
                      >
                        {tradePool?.symbol}
                      </span>
                      <img
                        css={css`
                          border-radius: 50%;
                          background: ${theme.palette.mode === 'dark' ? '#fff' : ''};
                        `}
                        src={tradePool.logoSource}
                        height="16"
                        width="16"
                      />
                      <div
                        css={css`
                          background: linear-gradient(180deg, #84ff9f 0%, #ffe071 49.53%, #f96262 96.35%);
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          border-radius: 4px;
                          height: 16px;
                          width: 16px;
                          margin-left: 8px;
                        `}
                      >
                        <KeyboardArrowDownIcon sx={{ color: '#000', height: '16px', width: '16px' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*<div*/}
              {/*  css={css`*/}
              {/*    display: flex;*/}
              {/*    align-items: center;*/}
              {/*    justify-content: center;*/}
              {/*    margin: -13px 0 -10px;*/}
              {/*  `}*/}
              {/*>*/}
              {/*  /!*<ArrowDownIcon />*!/*/}
              {/*</div>*/}
              {/*<div css={input}>*/}
              {/*  <div*/}
              {/*    css={css`*/}
              {/*      display: flex;*/}
              {/*      align-items: center;*/}
              {/*      justify-content: space-between;*/}
              {/*      width: 100%;*/}
              {/*    `}*/}
              {/*  >*/}
              {/*    <span*/}
              {/*      css={css`*/}
              {/*        color: #757575;*/}
              {/*      `}*/}
              {/*    >*/}
              {/*      {isBuy ? 'Long' : 'Short'}*/}
              {/*    </span>*/}
              {/*    <div>*/}
              {/*      <span>Leverage: </span>*/}
              {/*      <span>{leverage}x</span>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*  <div*/}
              {/*    css={css`*/}
              {/*      display: flex;*/}
              {/*      align-items: center;*/}
              {/*      justify-content: space-between;*/}
              {/*      width: 100%;*/}
              {/*    `}*/}
              {/*  >*/}
              {/*    <TextField*/}
              {/*      variant="standard"*/}
              {/*      type="number"*/}
              {/*      value={openBTCSize}*/}
              {/*      InputProps={{*/}
              {/*        disableUnderline: true,*/}
              {/*      }}*/}
              {/*      sx={{*/}
              {/*        height: '28px',*/}
              {/*        fontSize: '20px',*/}
              {/*        minHeight: '28px',*/}
              {/*        '& .MuiOutlinedInput-root': {*/}
              {/*          height: '28px',*/}
              {/*          minHeight: '28px',*/}
              {/*          padding: 0,*/}
              {/*        },*/}
              {/*      }}*/}
              {/*    />*/}
              {/*    <div>*/}
              {/*      <span>BTC</span>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}
              {tabIndex === 1 && (
                <div
                  css={[
                    input,
                    css`
                      background: ${theme.background.second};
                      color: ${theme.text.primary};
                    `,
                  ]}
                >
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      width: 100%;
                    `}
                  >
                    <span
                      css={css`
                        color: #757575;
                      `}
                    >
                      Price
                    </span>
                    <div>
                      <span
                        css={css`
                          color: #757575;
                        `}
                      >
                        Leverage:
                      </span>
                      <span>{leverage}x</span>
                    </div>
                  </div>
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      width: 100%;
                    `}
                  >
                    <TextField
                      variant="standard"
                      type="number"
                      value={limitPrice}
                      onChange={(event) => {
                        setLimitPrice(event.target.value)
                      }}
                      InputProps={{
                        disableUnderline: true,
                      }}
                      sx={{
                        height: '28px',
                        fontSize: '20px',
                        minHeight: '28px',
                        '& .MuiOutlinedInput-root': {
                          height: '28px',
                          minHeight: '28px',
                          padding: 0,
                        },
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div>
              <p
                css={css`
                  color: ${theme.text.primary};
                `}
              >
                Leverage Slider
              </p>
              <Slider
                defaultValue={tradeModel === TradeMode.DEGEN ? 51 : 2}
                step={1}
                // marks={tradeModel === TradeMode.DEGEN ? DegenMarks : marks}
                min={tradeModel === TradeMode.DEGEN ? 51 : 2}
                max={tradeModel === TradeMode.DEGEN ? 200 : 50}
                value={leverage}
                disabled={isLoadingFactory}
                onClick={handleSliderClick}
                onChange={handleLeverageChange}
                // color="#2832F5"
                valueLabelDisplay="auto"
                sx={{
                  height: '12px',
                  '& .MuiSlider-root': {
                    color: '#757575',
                  },
                  '& .MuiSlider-rail': {
                    opacity: 1,
                    background:
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(172deg, #84FF9F -6.76%, #FFE071 46.7%, #F96262 97.25%)'
                        : 'linear-gradient(270deg, #E9FF84 0.81%, #FFE071 49.85%, #F96262 99.84%)',
                  },
                  '& .MuiSlider-track': {
                    border: 'unset',
                    background:
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(172deg, #84FF9F -6.76%, #FFE071 46.7%, #F96262 97.25%)'
                        : 'linear-gradient(270deg, #E9FF84 0.81%, #FFE071 49.85%, #F96262 99.84%)',
                  },
                  '& .MuiSlider-thumb': {
                    height: '19px',
                    width: '19px',
                    background: '#fff',
                    border: `4px solid ${theme.palette.mode === 'dark' ? '#2832F5' : '#2E2E2E'}`,
                  },
                  '& .MuiSlider-markActive': {
                    background: theme.palette.mode === 'dark' ? '#2832F5' : '#000000',
                  },
                  '& .MuiSlider-markLabel': {
                    fontSize: '12px',
                    color: '#757575',
                  },
                }}
              />
            </div>
            <div
              css={css`
                > p {
                  padding-bottom: 8px;
                }
              `}
            >
              <p
                css={[
                  align,
                  css`
                    justify-content: space-between;
                    color: ${theme.text.primary};
                  `,
                ]}
              >
                <span>Collateral In</span>
                <span>
                  {isNaN(positionSizeDai.toNumber()) ? '--' : getBigNumberStr(positionSizeDai, 6)} {tradePool?.symbol}
                </span>
              </p>
              <p
                css={[
                  align,
                  css`
                    justify-content: space-between;
                    color: ${theme.text.primary};
                  `,
                ]}
              >
                <span>Leverage</span>
                <span>{leverage}</span>
              </p>
              {tradeModel === TradeMode.DEGEN && (
                <div>
                  <AlertIcon />
                  <p
                    css={css`
                      color: ${theme.text.primary};
                      padding-bottom: 8px;
                    `}
                  >
                    A fraction of your profits(if any)is taken when you close the trade
                  </p>
                </div>
              )}
              {/*<p*/}
              {/*  css={[*/}
              {/*    align,*/}
              {/*    css`*/}
              {/*      justify-content: space-between;*/}
              {/*    `,*/}
              {/*  ]}*/}
              {/*>*/}
              {/*  <span>Entry Price</span>*/}
              {/*  <span>${BTCPrice.toFixed(2)}</span>*/}
              {/*</p>*/}
              {/*<p*/}
              {/*  css={[*/}
              {/*    align,*/}
              {/*    css`*/}
              {/*      justify-content: space-between;*/}
              {/*    `,*/}
              {/*  ]}*/}
              {/*>*/}
              {/*  <span>Liq. Price</span>*/}
              {/*  <span>${getBigNumberStr(getLiqPrice(BTCPrice, positionSizeDai, isBuy, leverage), 4)}</span>*/}
              {/*</p>*/}
              {/*<p*/}
              {/*  css={[*/}
              {/*    align,*/}
              {/*    css`*/}
              {/*      justify-content: space-between;*/}
              {/*    `,*/}
              {/*  ]}*/}
              {/*>*/}
              {/*  <span>Fees</span>*/}
              {/*  <span>*/}
              {/*    {isNaN(getFees(positionSizeDai, leverage).toNumber())*/}
              {/*      ? '--'*/}
              {/*      : getBigNumberStr(getFees(positionSizeDai, leverage), 2)}*/}
              {/*  </span>*/}
              {/*</p>*/}
            </div>
            {/*{tradeModel && (*/}
            {/*  <div*/}
            {/*    css={css`*/}
            {/*      margin-bottom: 16px;*/}
            {/*    `}*/}
            {/*  >*/}
            {/*    <div>*/}
            {/*      {(slSetting !== 0 || !slUsePercentage) && (*/}
            {/*        <div*/}
            {/*          css={css`*/}
            {/*            display: flex;*/}
            {/*            align-items: center;*/}
            {/*            justify-content: space-between;*/}
            {/*            padding: 8px 0;*/}
            {/*          `}*/}
            {/*        >*/}
            {/*          <div>*/}
            {/*            StopLoss{' '}*/}
            {/*            <span*/}
            {/*              css={css`*/}
            {/*                color: #db4c40;*/}
            {/*              `}*/}
            {/*            >*/}
            {/*              (*/}
            {/*              {slUsePercentage*/}
            {/*                ? '$' + getBigNumberStr(targetSl, 2)*/}
            {/*                : getBigNumberStr(slPercentage, 2) + '%'}*/}
            {/*              )*/}
            {/*            </span>*/}
            {/*          </div>*/}
            {/*          <span>*/}
            {/*            {isNaN(slPercentage.times(positionSizeDai.div(100)).toNumber())*/}
            {/*              ? '--'*/}
            {/*              : getBigNumberStr(slPercentage.times(positionSizeDai.div(100)), 2)}*/}
            {/*            {tradePool.symbol}*/}
            {/*          </span>*/}
            {/*        </div>*/}
            {/*      )}*/}
            {/*      {slSetting === 0 && slUsePercentage && (*/}
            {/*        <div*/}
            {/*          css={css`*/}
            {/*            display: flex;*/}
            {/*            align-items: center;*/}
            {/*            justify-content: space-between;*/}
            {/*            padding: 8px 0;*/}
            {/*          `}*/}
            {/*        >*/}
            {/*          <div>*/}
            {/*            StopLoss{' '}*/}
            {/*            <span*/}
            {/*              css={css`*/}
            {/*                color: #db4c40;*/}
            {/*              `}*/}
            {/*            >*/}
            {/*              (None)*/}
            {/*            </span>*/}
            {/*          </div>*/}
            {/*          <span*/}
            {/*            css={css`*/}
            {/*              color: #db4c40;*/}
            {/*            `}*/}
            {/*          >*/}
            {/*            None*/}
            {/*          </span>*/}
            {/*        </div>*/}
            {/*      )}*/}
            {/*      <div*/}
            {/*        css={css`*/}
            {/*          display: flex;*/}
            {/*          align-items: center;*/}
            {/*          justify-content: space-between;*/}
            {/*          background: #f7f7f7;*/}
            {/*          > span {*/}
            {/*            cursor: pointer;*/}
            {/*          }*/}
            {/*        `}*/}
            {/*      >*/}
            {/*        <span*/}
            {/*          css={slSetting === 0 && slUsePercentage ? activeTab : normalTab}*/}
            {/*          onClick={() => handleTpSLSetting(true, 0)}*/}
            {/*        >*/}
            {/*          None*/}
            {/*        </span>*/}
            {/*        <span*/}
            {/*          css={slSetting === -10 && slUsePercentage ? activeTab : normalTab}*/}
            {/*          onClick={() => handleTpSLSetting(true, -10)}*/}
            {/*        >*/}
            {/*          -10%*/}
            {/*        </span>*/}
            {/*        <span*/}
            {/*          css={slSetting === -25 && slUsePercentage ? activeTab : normalTab}*/}
            {/*          onClick={() => handleTpSLSetting(true, -25)}*/}
            {/*        >*/}
            {/*          -25%*/}
            {/*        </span>*/}
            {/*        <span*/}
            {/*          css={slSetting === -50 && slUsePercentage ? activeTab : normalTab}*/}
            {/*          onClick={() => handleTpSLSetting(true, -50)}*/}
            {/*        >*/}
            {/*          -50%*/}
            {/*        </span>*/}
            {/*        <span*/}
            {/*          css={slSetting === -75 && slUsePercentage ? activeTab : normalTab}*/}
            {/*          onClick={() => handleTpSLSetting(true, -75)}*/}
            {/*        >*/}
            {/*          -75%*/}
            {/*        </span>*/}
            {/*        <Input*/}
            {/*          type="number"*/}
            {/*          placeholder="Price |"*/}
            {/*          disableUnderline={true}*/}
            {/*          value={slPrice}*/}
            {/*          onChange={(event) => {*/}
            {/*            setSlPrice(new BigNumber(event.target.value))*/}
            {/*          }}*/}
            {/*          onClick={() => setUseSlPercentage(false)}*/}
            {/*          sx={{*/}
            {/*            height: '28px',*/}
            {/*            fontSize: '14px',*/}
            {/*            minHeight: '28px',*/}
            {/*            width: '73px',*/}
            {/*            '& .MuiOutlinedInput-root': {*/}
            {/*              height: '28px',*/}
            {/*              minHeight: '28px',*/}
            {/*              padding: 0,*/}
            {/*            },*/}
            {/*            '& .MuiInputBase-input': {*/}
            {/*              background: '#fff!important',*/}
            {/*              padding: '0px 0px 0px 4px',*/}
            {/*              margin: '4px 4px 5px 0',*/}
            {/*            },*/}
            {/*          }}*/}
            {/*        />*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*      {(tpSetting !== 0 || !tpUsePercentage) && (*/}
            {/*        <div*/}
            {/*          css={css`*/}
            {/*            display: flex;*/}
            {/*            align-items: center;*/}
            {/*            justify-content: space-between;*/}
            {/*            padding: 16px 0 8px;*/}
            {/*          `}*/}
            {/*        >*/}
            {/*          <div>*/}
            {/*            Take Profit{' '}*/}
            {/*            <span*/}
            {/*              css={css`*/}
            {/*                color: #009b72;*/}
            {/*              `}*/}
            {/*            >*/}
            {/*              (*/}
            {/*              {tpUsePercentage*/}
            {/*                ? '$' + getBigNumberStr(targetTp, 2)*/}
            {/*                : getBigNumberStr(tpPercentage, 2) + '%'}*/}
            {/*              )*/}
            {/*            </span>*/}
            {/*          </div>*/}
            {/*          {isNaN(tpPercentage.times(positionSizeDai.div(100)).toNumber())*/}
            {/*            ? '--'*/}
            {/*            : getBigNumberStr(tpPercentage.times(positionSizeDai.div(100)), 2)}*/}
            {/*          {tradePool.symbol}*/}
            {/*        </div>*/}
            {/*      )}*/}
            {/*      {tpSetting === 0 && tpUsePercentage && (*/}
            {/*        <div*/}
            {/*          css={css`*/}
            {/*            display: flex;*/}
            {/*            align-items: center;*/}
            {/*            justify-content: space-between;*/}
            {/*            padding: 16px 0 8px;*/}
            {/*          `}*/}
            {/*        >*/}
            {/*          <div>*/}
            {/*            Take Profit{' '}*/}
            {/*            <span*/}
            {/*              css={css`*/}
            {/*                color: #009b72;*/}
            {/*              `}*/}
            {/*            >*/}
            {/*              (None)*/}
            {/*            </span>*/}
            {/*          </div>*/}
            {/*          <span*/}
            {/*            css={css`*/}
            {/*              color: #009b72;*/}
            {/*            `}*/}
            {/*          >*/}
            {/*            None*/}
            {/*          </span>*/}
            {/*        </div>*/}
            {/*      )}*/}
            {/*      <div*/}
            {/*        css={css`*/}
            {/*          display: flex;*/}
            {/*          align-items: center;*/}
            {/*          background: #f7f7f7;*/}
            {/*          justify-content: space-between;*/}
            {/*          > span {*/}
            {/*            cursor: pointer;*/}
            {/*          }*/}
            {/*        `}*/}
            {/*      >*/}
            {/*        <span*/}
            {/*          css={tpSetting === 25 && tpUsePercentage ? activeTab : normalTab}*/}
            {/*          onClick={() => handleTpSLSetting(false, 25)}*/}
            {/*        >*/}
            {/*          25%*/}
            {/*        </span>*/}
            {/*        <span*/}
            {/*          css={tpSetting === 50 && tpUsePercentage ? activeTab : normalTab}*/}
            {/*          onClick={() => handleTpSLSetting(false, 50)}*/}
            {/*        >*/}
            {/*          50%*/}
            {/*        </span>*/}
            {/*        <span*/}
            {/*          css={tpSetting === 100 && tpUsePercentage ? activeTab : normalTab}*/}
            {/*          onClick={() => handleTpSLSetting(false, 100)}*/}
            {/*        >*/}
            {/*          100%*/}
            {/*        </span>*/}
            {/*        <span*/}
            {/*          css={tpSetting === 300 && tpUsePercentage ? activeTab : normalTab}*/}
            {/*          onClick={() => handleTpSLSetting(false, 300)}*/}
            {/*        >*/}
            {/*          300%*/}
            {/*        </span>*/}
            {/*        <span*/}
            {/*          css={tpSetting === 900 && tpUsePercentage ? activeTab : normalTab}*/}
            {/*          onClick={() => handleTpSLSetting(false, 900)}*/}
            {/*        >*/}
            {/*          900%*/}
            {/*        </span>*/}
            {/*        <Input*/}
            {/*          type="number"*/}
            {/*          placeholder="Price |"*/}
            {/*          disableUnderline={true}*/}
            {/*          value={tpPrice}*/}
            {/*          onChange={(event) => {*/}
            {/*            setTpPrice(new BigNumber(event.target.value))*/}
            {/*          }}*/}
            {/*          onClick={() => setTpUsePercentage(false)}*/}
            {/*          sx={{*/}
            {/*            height: '28px',*/}
            {/*            fontSize: '14px',*/}
            {/*            minHeight: '28px',*/}
            {/*            width: '73px',*/}
            {/*            '& .MuiOutlinedInput-root': {*/}
            {/*              height: '28px',*/}
            {/*              minHeight: '28px',*/}
            {/*              padding: 0,*/}
            {/*            },*/}
            {/*            '& .MuiInputBase-input': {*/}
            {/*              background: '#fff!important',*/}
            {/*              padding: '0px 0px 0px 4px',*/}
            {/*              margin: '4px 4px 5px 0',*/}
            {/*            },*/}
            {/*          }}*/}
            {/*        />*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*)}*/}
            {!account && (
              <KRAVButton onClick={async () => setWalletDialogVisibility(true)}>{ButtonText.CONNECT_WALLET}</KRAVButton>
            )}
            {account && isBuy && (
              <KravLongButton
                disabled={
                  buttonState === ButtonText.INSUFFICIENT_BALANCE ||
                  buttonState === ButtonText.REACHED_LIMIT ||
                  buttonState === ButtonText.MIN_SIZE ||
                  buttonState === ButtonText.ENTER_AMOUNT
                }
                onClick={async () => {
                  if (buttonState === 'Connect Wallet') {
                    setWalletDialogVisibility(true)
                  } else {
                    await handleButtonClick()
                  }
                }}
              >
                <Trans>{buttonState}</Trans>
              </KravLongButton>
            )}
            {account && !isBuy && (
              <KravShortButton
                disabled={
                  buttonState === ButtonText.INSUFFICIENT_BALANCE ||
                  buttonState === ButtonText.REACHED_LIMIT ||
                  buttonState === ButtonText.MIN_SIZE ||
                  buttonState === ButtonText.ENTER_AMOUNT
                }
                onClick={async () => {
                  if (buttonState === 'Connect Wallet') {
                    setWalletDialogVisibility(true)
                  } else {
                    await handleButtonClick()
                  }
                }}
              >
                <Trans>{buttonState}</Trans>
              </KravShortButton>
            )}
          </>
        </div>
      )}
      {showConfirmTip && (
        <>
          <div
            css={[
              attention,
              css`
                background: ${theme.palette.mode === 'dark' ? '#4b4b4b' : '#f1f1f1'};
                color: ${theme.text.primary};
              `,
            ]}
          >
            <div
              className="title"
              css={css`
                border-bottom: ${theme.splitLine.primary};
              `}
            >
              <AttentionIcon />
              <span>Attention</span>
            </div>
            <div className="content order-limit">
              <p>1. Order Limit</p>
              <p>
                When placing orders, be aware that the total quantity of your position, inclusive of leverage, should
                not exceed 20% of the total market liquidity. Please review the available liquidity before placing your
                orders to maintain seamless trading operations.
              </p>
            </div>
            <div className="content">
              <p>2. Position Reduction</p>
              <p>
                When placing orders, be aware that the total quantity of your position, inclusive of leverage, should
                not exceed 20% of the total market liquidity. Please review the available liquidity before placing your
                orders to maintain seamless trading operations.
              </p>
            </div>
          </div>
          <KRAVButton onClick={() => setShowConfirmTip(false)}>OK</KRAVButton>
        </>
      )}
    </>
  )
}
