/** @jsxImportSource @emotion/react */
import { Slider, TextField, useTheme } from '@mui/material'
import { css } from '@emotion/react'
import { Trans, msg, t } from '@lingui/macro'
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
import { useTradeData } from '../../../hook/useTradeData'
import NoticePopup from '../../Dialog/NoticePopup'
import { useLingui } from '@lingui/react'

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
  CONNECT_WALLET = 'CONNECT_WALLET',
  ENTER_AMOUNT = 'ENTER_AMOUNT',
  APPROVE = 'APPROVE',
  CHECK_APPROVE = 'CHECK_APPROVE',
  LONG = 'LONG',
  SHORT = 'SHORT',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  REACHED_LIMIT = 'REACHED_LIMIT',
  MIN_SIZE = 'MIN_SIZE',
}

const ButtonTextMsg = {
  CONNECT_WALLET: msg`Connect Wallet`,
  ENTER_AMOUNT: msg`Enter an amount`,
  APPROVE: msg`Approve ...`,
  CHECK_APPROVE: msg`Check approve`,
  LONG: msg`Long`,
  SHORT: msg`Short`,
  INSUFFICIENT_BALANCE: msg`Insufficient Balance`,
  REACHED_LIMIT: msg`Reached max positions limit`,
  MIN_SIZE: msg`Min position size is 1500`,
}

const sliderLimit = {
  min: { [TradeMode.BASIC]: 2, [TradeMode.DEGEN]: 51, [TradeMode.PRO]: 2 },
  max: {
    [TradeMode.BASIC]: 50,
    [TradeMode.DEGEN]: 200,
    [TradeMode.PRO]: 100,
  },
}

const marks = {
  [TradeMode.BASIC]: [2, 10, 20, 30, 40, 50].map((num) => ({
    value: num,
    label: num + 'x',
  })),
  [TradeMode.DEGEN]: [51, 80, 110, 140, 170, 200].map((num) => ({
    value: num,
    label: num + 'x',
  })),
  [TradeMode.PRO]: [2, 25, 50, 75, 100].map((num) => ({
    value: num,
    label: num + 'x',
  })),
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
  const [inputDAIDecimals, setInputDAIDecimals] = useState(1)
  const [tabIndex, setTabIndex] = useState(0)
  const { provider } = useWeb3React()
  const { i18n } = useLingui()
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
    slippagePercent,
    setSlippagePercent,
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
    setSlippagePercent: state.setSlippagePercent,
    slippagePercent: state.slippagePercent,
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

  const { liquidationPrice, priceImpact } = useTradeData({
    tradeType,
    limitPrice,
    isBuy,
    positionSizeDai,
    leverage,
  })

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

  const handleSlippageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Regex to match values between 0.3 and 3 (inclusive)

    const regex = /^(0(\.[3-9][0-9]*)?|[1-2](\.\d+)?|3(\.0+)?)$/
    if (event.target.value === '' || regex.test(event.target.value)) {
      setSlippagePercent(parseFloat(event?.target?.value))
    } else {
      setSlippagePercent(0.3)
    }
  }

  const handleSlippageInputBlur = (event: any) => {
    const numericValue = parseFloat(event.target.value)
    if (numericValue < 0.3 || numericValue > 3) {
      setSlippagePercent(0.3)
    }
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
    const nDecimals = event.target.value.split('.')[1]?.length || 0
    setInputDAIDecimals(nDecimals)

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

  // const handleMaxInput = () => {
  //   setPositionSizeDai(PoolWalletBalance)
  //   const outputAmount = getLongOrShortUSD(
  //     leverage,
  //     PoolWalletBalance,
  //     getFees(PoolWalletBalance, leverage),
  //     BTCPrice,
  //     tradePool?.proportionBTC
  //   )
  //   setOpenBTCSize(outputAmount)
  // }

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
        entryPrice={priceImpact}
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
              padding: 6px 0 0;
              margin: 16px 0 0;
            `}
          >
            <span
              css={[
                orderParamsTab,
                css`
                  color: ${tabIndex === 0 ? 'white' : ''};
                  background: ${tabIndex === 0 ? theme.background.second : ''};
                  font-size: 14px;
                  padding: 4px 16px;
                `,
              ]}
              onClick={() => {
                setTabIndex(0)
                setTradeType(0)
              }}
            >
              Market
            </span>
            {/* <span
              css={[
                orderParamsTab,
                css`
                  color: ${tabIndex === 1 ? 'white' : ''};
                  background: ${tabIndex === 1 ? theme.background.second : ''};
                  font-size: 14px;
                  padding: 4px 16px;
                `,
              ]}
              onClick={() => {
                setTabIndex(1)
                setTradeType(1)
              }}
            >
              Limit
            </span> */}
          </div>
          <div
            css={css`
              padding: 15px 10px;
              background: ${theme.background.second};
              border-radius: ${tabIndex === 1 ? '4px' : 0} 4px 4px 4px;
              margin-top: -1px;
              display: grid;
              gap: 24px;
            `}
          >
            <div>
              <div
                css={css`
                  color: ${theme.text.primary};
                  margin-bottom: 5px;
                `}
              >
                <span
                  css={css`
                    color: #757575;
                  `}
                >
                  {t`Available`}:
                </span>{' '}
                {getBigNumberStr(PoolWalletBalance, 6) || '0'} {tradePool?.symbol}
              </div>
              <div>
                <span
                  css={css`
                    color: #757575;
                  `}
                >
                  <Trans>Order limit</Trans>:
                </span>{' '}
                <span
                  css={css`
                    color: #7ba0ff;
                  `}
                >
                  {getBigNumberStr(orderLimit, 6) || '0'} {tradePool?.symbol}
                </span>
              </div>
            </div>
            <NoticePopup />
            <>
              <div
                css={css`
                  position: relative;
                `}
              >
                <div
                  css={[
                    input,
                    css`
                      background: ${theme.background.third};
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
                      {t`Pay`}
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
                      value={positionSizeDai.toFormat(inputDAIDecimals)}
                      onChange={handlePositionDAIInput}
                      InputProps={{
                        disableUnderline: true,
                      }}
                      sx={{
                        minHeight: '28px',
                        '& .MuiOutlinedInput-root': {
                          minHeight: '28px',
                          padding: 0,
                          fontSize: '22px',
                        },
                        '& .MuiInputBase-root': {
                          fontWeight: 500,
                          fontSize: 22,
                        },
                      }}
                    />
                    <div
                      css={css`
                        display: flex;
                        align-items: center;
                      `}
                    >
                      {/* <div
                        css={css`
                          border-radius: 2px;
                          color: ${theme.text.primary};
                          background: ${theme.palette.mode === 'dark' ? '#2832f5' : '#a4a8fe'};
                          padding: 2px 6px;
                          font-size: 12px;
                          cursor: pointer;
                          margin-right: 4px;
                        `}
                        onClick={handleMaxInput}
                      >
                        MAX
                      </div> */}
                      <div
                        onClick={() => setIsOpenSelectToken(true)}
                        css={[
                          align,
                          css`
                            cursor: pointer;
                            background: ${theme.background.second};
                            height: 32px;
                            border-radius: 40px;
                            width: max-content;
                            padding: 0 4px;
                            font-weight: 500;
                          `,
                        ]}
                      >
                        {!!tradePool?.symbol && (
                          <img
                            css={css`
                              border-radius: 50%;
                              background: ${theme.palette.mode === 'dark' ? '#fff' : ''};
                            `}
                            src={tradePool.logoSource}
                            height="16"
                            width="16"
                          />
                        )}
                        <span
                          css={css`
                            margin: 0 3px;
                            color: ${theme.text.primary};
                            padding: 0 3px;
                          `}
                        >
                          {!!tradePool?.symbol ? tradePool?.symbol : 'Select'}
                        </span>

                        <div
                          css={css`
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 4px;
                            height: 16px;
                            width: 16px;
                          `}
                        >
                          <KeyboardArrowDownIcon sx={{ color: theme.text.primary, height: '16px', width: '16px' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
                        <Trans>Price</Trans>
                      </span>
                      <div>
                        <span
                          css={css`
                            color: #757575;
                          `}
                        >
                          <Trans>Leverage</Trans>:
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
                <div
                  css={css`
                    color: ${theme.text.primary}60;
                    display: flex;
                    align-item: center;
                    justify-content: flex-start;
                  `}
                >
                  <div
                    css={css`
                      line-height: 30px;
                      margin-right: 5px;
                    `}
                  >
                    <span
                      css={css`
                        color: #ffffff70;
                      `}
                    >
                      <Trans>Leverage</Trans>
                    </span>
                    :{' '}
                  </div>
                  <span
                    css={css`
                      color: #ffffff;
                      line-height: 30px;
                    `}
                  >
                    {leverage}x
                  </span>
                </div>
                <Slider
                  defaultValue={sliderLimit.min[tradeModel]}
                  step={1}
                  // marks={tradeModel === TradeMode.DEGEN ? DegenMarks : marks}
                  marks={marks[tradeModel]}
                  min={sliderLimit.min[tradeModel]}
                  max={sliderLimit.max[tradeModel]}
                  value={leverage}
                  disabled={isLoadingFactory}
                  onClick={handleSliderClick}
                  onChange={handleLeverageChange}
                  // color="#2832F5"
                  valueLabelDisplay="auto"
                  sx={{
                    width: 'calc(100% - 10px)',
                    ml: '5px',
                    height: '6px',
                    '& .MuiSlider-root': {
                      color: '#757575',
                    },
                    '& .MuiSlider-rail': {
                      opacity: 1,
                      background: theme.background.third,
                    },
                    '& .MuiSlider-track': {
                      border: 'unset',
                      background: '#2832F5',
                    },
                    '& .MuiSlider-thumb': {
                      height: '20px',
                      width: '20px',
                      background: '#fff',
                      border: `5px solid ${theme.palette.mode === 'dark' ? '#2832F5' : '#2E2E2E'}`,
                    },
                    '& .MuiSlider-markActive': {
                      background: theme.palette.mode === 'dark' ? '#2832F5' : '#000000',
                    },
                    '& .MuiSlider-markLabel': {
                      fontSize: '12px',
                      color: '#757575',
                    },
                    '& .MuiSlider-mark': {
                      height: '10px',
                      backgroundColor: '#757575',
                    },
                  }}
                />
              </div>
              <div
                css={[
                  align,
                  css`
                    justify-content: space-between;
                    color: #ffffff70;
                  `,
                ]}
              >
                <p>
                  <Trans>Slippage</Trans>
                </p>
                <div css={[align]}>
                  <input
                    value={slippagePercent}
                    type="number"
                    onChange={handleSlippageInputChange}
                    css={css`
                      background: ${theme.background.third};
                      border: none;
                      color: ${theme.text.primary};
                      padding: 5px 10px;
                      width: 100px;
                      max-height: 30px;
                      outline: 0;
                      text-align: center;
                      border-radius: 5px;
                      -webkit-tap-highlight-color: transparent;
                    `}
                    onBlur={handleSlippageInputBlur}
                    pattern="^(0\.[3-9]|[1-2](\.\d+)?|3(\.0+)?)$"
                  />
                  <span>%</span>
                </div>
              </div>
              <div
                css={css`
                  > p {
                    padding-bottom: 8px;
                  }
                `}
              >
                {tradeModel === TradeMode.BASIC && (
                  <>
                    <p
                      css={[
                        align,
                        css`
                          justify-content: space-between;
                          color: ${theme.text.primary};
                        `,
                      ]}
                    >
                      <span
                        css={css`
                          color: #757575;
                        `}
                      >
                        {t`Liquidation Price`}
                      </span>

                      <span>
                        {liquidationPrice != '-' && '$'}
                        {liquidationPrice}
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
                      <span
                        css={css`
                          color: #757575;
                        `}
                      >
                        {t`Market Price`}
                      </span>
                      <span>
                        $
                        {Number(BTCPrice).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </p>
                  </>
                )}

                {tradeModel === TradeMode.DEGEN && (
                  <div css={[align]}>
                    <p
                      css={css`
                        color: ${theme.text.primary};
                        padding-bottom: 8px;
                      `}
                    >
                      <AlertIcon style={{ margin: '0 3px -3px 0' }} /> {t`A fraction of your profits...`}
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

              {!account && (
                <KRAVButton onClick={async () => setWalletDialogVisibility(true)}>
                  {i18n._(ButtonTextMsg[buttonState as keyof typeof ButtonTextMsg])}
                </KRAVButton>
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
                    if (buttonState === ButtonText.CONNECT_WALLET) {
                      setWalletDialogVisibility(true)
                    } else {
                      await handleButtonClick()
                    }
                  }}
                >
                  {i18n._(ButtonTextMsg[buttonState as keyof typeof ButtonTextMsg])}
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
                    if (buttonState === ButtonText.CONNECT_WALLET) {
                      setWalletDialogVisibility(true)
                    } else {
                      await handleButtonClick()
                    }
                  }}
                >
                  {i18n._(ButtonTextMsg[buttonState as keyof typeof ButtonTextMsg])}
                </KravShortButton>
              )}
            </>
          </div>
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
              <p>
                <Trans>1. Disclaimer</Trans>
              </p>
              <p>
                <Trans>
                  Perpetual futures trading with leverage carries risks, including liquidation prices. Traders should
                  understand these risks before engaging in such trades
                </Trans>
              </p>
            </div>
            <div className="content">
              <p>
                <Trans>2. Fees</Trans>
              </p>
              <p>
                <Trans>
                  Fees: KRAV Trade takes basis point fees from each trade open and close, never exceeding 0.07% for
                  each.
                </Trans>
              </p>
            </div>
          </div>
          <KRAVButton onClick={() => setShowConfirmTip(false)}>OK</KRAVButton>
        </>
      )}
    </>
  )
}
