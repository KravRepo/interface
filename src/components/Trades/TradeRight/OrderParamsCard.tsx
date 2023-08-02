/** @jsxImportSource @emotion/react */
import { Input, Slider, TextField } from '@mui/material'
import { css } from '@emotion/react'
import { Trans } from '@lingui/macro'
import { align } from '../../../globalStyle'
import { activeTab, input, normalTab, orderParamsTab } from './style'
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import KRAVButton from '../../KravUIKit/KravButton'
import { ConfirmTrade } from 'components/Dialog/ConfirmTrade'
import { useApprove } from '../../../hook/hookV8/useApprove'
import { useRootStore } from '../../../store/root'
import { useWeb3React } from '@web3-react/core'
import { addDecimals, getFees, getLiqPrice, getLongOrShortUSD, getReachPrice, getTakeProfit } from 'utils/math'
import { ReactComponent as ArrowDownIcon } from 'assets/imgs/arrowDown.svg'
import { TransactionAction, TransactionState } from '../../../store/TransactionSlice'
import { useMaxPositionCheck } from '../../../hook/hookV8/useMaxPositionCheck'
import { MINI_POSITION_SIZE, POSITION_LIMITS } from 'constant/math'
import { getBigNumberStr } from '../../../utils'

const marks = [
  {
    value: 2,
    label: '2x',
  },
  {
    value: 5,
    label: '5x',
  },
  {
    value: 10,
    label: '10x',
  },
  {
    value: 15,
    label: '15x',
  },
  {
    value: 20,
    label: '20x',
  },
  {
    value: 25,
    label: '25x',
  },
  {
    value: 30,
    label: '30x',
  },
  {
    value: 35,
    label: '35x',
  },
  {
    value: 40,
    label: '40x',
  },
  {
    value: 45,
    label: '45x',
  },
  {
    value: 50,
    label: '50x',
  },
]

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

enum buttonStyle {
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
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [openBTCSize, setOpenBTCSize] = useState(new BigNumber(0))
  const [tabIndex, setTabIndex] = useState(0)
  const [slSetting, setSlSetting] = useState(0)
  const [slUsePercentage, setUseSlPercentage] = useState(true)
  const [tpSetting, setTpSetting] = useState(0)
  const [tpUsePercentage, setTpUsePercentage] = useState(true)
  const {
    BTCPrice,
    transactionState,
    loadingData,
    tradePool,
    setErrorContent,
    setWalletDialogVisibility,
    userOpenLimitList,
    userOpenTradeList,
    isProModel,
    userPositionDatas,
  } = useRootStore((state) => ({
    BTCPrice: state.BTCPrice,
    transactionState: state.transactionState,
    loadingData: state.loadingData,
    tradePool: state.tradePool,
    setErrorContent: state.setErrorContent,
    setWalletDialogVisibility: state.setWalletDialogVisibility,
    userOpenLimitList: state.userOpenLimitList,
    userOpenTradeList: state.userOpenTradeList,
    isProModel: state.isProModel,
    userPositionDatas: state.userPositionDatas,
  }))

  const PoolWalletBalance = useMemo(() => {
    return (
      userPositionDatas.find((item) => item.pool?.tradingT === tradePool?.tradingT)?.walletBalance ?? new BigNumber(0)
    )
  }, [tradePool, userPositionDatas])

  const targetSl = useMemo(() => {
    return slUsePercentage
      ? slSetting === 0
        ? new BigNumber(0)
        : getReachPrice(leverage, isBuy, slSetting, tradeType === 0 ? BTCPrice : new BigNumber(limitPrice))
      : new BigNumber(slPrice)
  }, [slUsePercentage, leverage, isBuy, slSetting, tradeType, BTCPrice, slPrice, limitPrice])

  const targetTp = useMemo(() => {
    return tpUsePercentage
      ? tpSetting === 0
        ? new BigNumber(0)
        : getReachPrice(leverage, isBuy, tpSetting, tradeType === 0 ? BTCPrice : new BigNumber(limitPrice))
      : new BigNumber(tpPrice)
  }, [tpUsePercentage, leverage, isBuy, tpSetting, tradeType, BTCPrice, limitPrice, tpPrice])

  const slPercentage = useMemo(() => {
    return getTakeProfit(tradeType === 0 ? BTCPrice : new BigNumber(limitPrice), targetSl, isBuy, leverage, true)
  }, [tradeType, BTCPrice, limitPrice, isBuy, leverage, targetSl])

  const tpPercentage = useMemo(() => {
    return getTakeProfit(tradeType === 0 ? BTCPrice : new BigNumber(limitPrice), targetTp, isBuy, leverage, false)
  }, [tradeType, BTCPrice, limitPrice, isBuy, leverage, targetTp])

  const { account } = useWeb3React()
  const [buttonState, setButtonState] = useState<buttonStyle>(buttonStyle.CONNECT_WALLET)
  const testTuple = useMemo(() => {
    return {
      trader: account!,
      sl: addDecimals(targetSl, 10).toFixed(0),
      tp: addDecimals(targetTp, 10).toFixed(0),
      pairIndex: 0,
      openPrice: addDecimals(tradeType === 0 ? BTCPrice : limitPrice, 10).toString(),
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
    slSetting,
    slUsePercentage,
    tpSetting,
    tpPrice,
    tpUsePercentage,
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

  useEffect(() => {
    if (loadingData) setButtonState(buttonStyle.CONNECT_WALLET)
    else if (userOpenLimitList.length + userOpenTradeList.length === POSITION_LIMITS)
      setButtonState(buttonStyle.REACHED_LIMIT)
    else if (positionSizeDai.isGreaterThan(PoolWalletBalance)) setButtonState(buttonStyle.INSUFFICIENT_BALANCE)
    else if (!positionSizeDai.isEqualTo(0) && positionSizeDai.times(leverage).isLessThan(MINI_POSITION_SIZE))
      setButtonState(buttonStyle.MIN_SIZE)
    else if (!positionSizeDai.isGreaterThan(0)) setButtonState(buttonStyle.ENTER_AMOUNT)
    else if (isBuy) setButtonState(buttonStyle.LONG)
    else if (!isBuy) setButtonState(buttonStyle.SHORT)
  }, [account, isBuy, loadingData, userOpenLimitList, userOpenTradeList, leverage, positionSizeDai])

  useEffect(() => {
    if (transactionState === TransactionState.CHECK_APPROVE) setButtonState(buttonStyle.CHECK_APPROVE)
    if (transactionState === TransactionState.APPROVE) setButtonState(buttonStyle.APPROVE)
    if (transactionState === TransactionState.APPROVE_SUCCESS) {
      isBuy ? setButtonState(buttonStyle.LONG) : setButtonState(buttonStyle.SHORT)
    }
  }, [transactionState])

  useEffect(() => {
    if (!isProModel) {
      setUseSlPercentage(false)
      setSlPrice(new BigNumber(0))
      setTpUsePercentage(false)
      setTpPrice(new BigNumber(0))
    }
  }, [isProModel])

  useEffect(() => {
    setPositionSizeDai(new BigNumber(0))
    setOpenBTCSize(new BigNumber(0))
    setLeverage(2)
  }, [isBuy])

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
      <div
        css={css`
          font-size: 14px;
        `}
      >
        <div
          css={css`
            display: flex;
          `}
        >
          <span
            css={[
              orderParamsTab,
              css`
                color: ${tabIndex === 0 ? 'black' : ''};
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
                color: ${tabIndex === 1 ? 'black' : ''};
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
            margin-bottom: 12px;
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
        <>
          <div>
            <div css={input}>
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
                    border-radius: 2px;
                    background: #a4a8fe;
                    padding: 2px 6px;
                    font-size: 12px;
                    cursor: pointer;
                  `}
                  onClick={handleMaxInput}
                >
                  MAX
                </div>
                <div css={align}>
                  <span
                    css={css`
                      margin: 0 4px;
                    `}
                  >
                    {tradePool?.symbol}
                  </span>
                  <img
                    css={css`
                      border-radius: 50%;
                    `}
                    src={tradePool.logoSource}
                    height="16"
                    width="16"
                  />
                </div>
              </div>
            </div>
            <div
              css={css`
                display: flex;
                align-items: center;
                justify-content: center;
                margin: -13px 0 -10px;
              `}
            >
              <ArrowDownIcon />
            </div>
            <div css={input}>
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
                  {isBuy ? 'Long' : 'Short'}
                </span>
                <div>
                  <span>Leverage: </span>
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
                  value={openBTCSize}
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
                <div>
                  <span>BTC</span>
                </div>
              </div>
            </div>
            {tabIndex === 1 && (
              <div css={input}>
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
                    <span>Leverage: </span>
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
            <p>Leverage slider</p>
            <Slider
              defaultValue={2}
              step={1}
              marks={marks}
              min={2}
              max={50}
              value={leverage}
              disabled={loadingData}
              onClick={handleSliderClick}
              onChange={handleLeverageChange}
              // color="#2832F5"
              valueLabelDisplay="auto"
              sx={{
                height: '2px',
                '& .MuiSlider-root': {
                  color: '#DADADA',
                },
                '& .MuiSlider-rail': {
                  opacity: 1,
                  backgroundColor: '#DADADA',
                },
                '& .MuiSlider-track': {
                  border: 'unset',
                  color: '#000000',
                },
                '& .MuiSlider-mark': {
                  height: '6px',
                  background: '#DADADA',
                },
                '& .MuiSlider-thumb': {
                  height: '10px',
                  width: '10px',
                  background: '#000000',
                },
                '& .MuiSlider-markActive': {
                  background: '#000000',
                },
                '& .MuiSlider-markLabel': {
                  fontSize: '12px',
                  color: '#757575',
                },
              }}
            />
            {BTCPrice.isGreaterThan(0) ? (
              <p
                css={css`
                  padding-bottom: 8px;
                `}
              >
                <span
                  css={css`
                    color: #757575;
                  `}
                >
                  Per Ticket Size
                </span>
                : {tradePool?.proportionBTC} {tradePool?.symbol} = 1 BTC
              </p>
            ) : (
              <p
                css={css`
                  padding-bottom: 8px;
                `}
              >
                -
              </p>
            )}
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
                `,
              ]}
            >
              <span>Collateral in</span>
              <span>
                {isNaN(positionSizeDai.toNumber()) ? '--' : getBigNumberStr(positionSizeDai, 6)} {tradePool?.symbol}
              </span>
            </p>
            <p
              css={[
                align,
                css`
                  justify-content: space-between;
                `,
              ]}
            >
              <span>Leverage</span>
              <span>{leverage}</span>
            </p>
            <p
              css={[
                align,
                css`
                  justify-content: space-between;
                `,
              ]}
            >
              <span>Entry Price</span>
              <span>${BTCPrice.toFixed(2)}</span>
            </p>
            <p
              css={[
                align,
                css`
                  justify-content: space-between;
                `,
              ]}
            >
              <span>Liq. Price</span>
              <span>${getBigNumberStr(getLiqPrice(BTCPrice, positionSizeDai, isBuy, leverage), 4)}</span>
            </p>
            <p
              css={[
                align,
                css`
                  justify-content: space-between;
                `,
              ]}
            >
              <span>Fees</span>
              <span>
                {isNaN(getFees(positionSizeDai, leverage).toNumber())
                  ? '--'
                  : getBigNumberStr(getFees(positionSizeDai, leverage), 2)}
              </span>
            </p>
          </div>
          {isProModel && (
            <div
              css={css`
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
                        ({slUsePercentage ? '$' + getBigNumberStr(targetSl, 2) : getBigNumberStr(slPercentage, 2) + '%'}
                        )
                      </span>
                    </div>
                    <span>
                      {isNaN(slPercentage.times(positionSizeDai.div(100)).toNumber())
                        ? '--'
                        : getBigNumberStr(slPercentage.times(positionSizeDai.div(100)), 2)}
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
                        ({tpUsePercentage ? '$' + getBigNumberStr(targetTp, 2) : getBigNumberStr(tpPercentage, 2) + '%'}
                        )
                      </span>
                    </div>
                    {isNaN(tpPercentage.times(positionSizeDai.div(100)).toNumber())
                      ? '--'
                      : getBigNumberStr(tpPercentage.times(positionSizeDai.div(100)), 2)}
                    {tradePool.symbol}
                  </div>
                )}
                {tpSetting === 0 && tpUsePercentage && (
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
              </div>
            </div>
          )}
          <KRAVButton
            disabled={
              buttonState === buttonStyle.INSUFFICIENT_BALANCE ||
              buttonState === buttonStyle.REACHED_LIMIT ||
              buttonState === buttonStyle.MIN_SIZE ||
              buttonState === buttonStyle.ENTER_AMOUNT
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
          </KRAVButton>
        </>
      </div>
    </>
  )
}
