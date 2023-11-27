/** @jsxImportSource @emotion/react */
import { Trans } from '@lingui/macro'
import { card, pairInfo } from '../style'
import { align } from '../../../globalStyle'
import { css } from '@emotion/react'
import { Button, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useRootStore } from '../../../store/root'
import React, { useEffect, useMemo, useState } from 'react'
import { useGetMarketStats } from '../../../hook/hookV8/useGetMarketStats'
import { formatNumber } from '../../../utils'
// import { BASE_KRAV_TRADING_ADDRESS } from '../../../constant/chain'
import { TradeMode } from '../../../store/TradeSlice'
import { EXCHANGE_TRADING_T } from '../../../constant/exchange'
import { SelectPair } from '../../Dialog/SelectPair'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { BASE_KRAV_TRADING_ADDRESS } from '../../../constant/chain'

type PairInfoProps = {
  setIsOpenSelectToken: (isOpenSelectToken: boolean) => void
  tradeModel: TradeMode
  setTradeModel: (tradeModel: TradeMode) => void
}

export const PairInfo = ({ setIsOpenSelectToken, setTradeModel, tradeModel }: PairInfoProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [choosePair, setChoosePair] = useState(false)
  const {
    BTCPrice,
    isBTCRise,
    allPoolParams,
    tradePool,
    setTradePool,
    isLoadingFactory,
    setTradePairIndex,
    tradePairIndex,
    pairConfig,
  } = useRootStore((state) => ({
    BTCPrice: state.BTCPrice,
    isBTCRise: state.isBTCRise,
    tradePool: state.tradePool,
    setTradePool: state.setTradePool,
    allPoolParams: state.allPoolParams,
    isLoadingFactory: state.isLoadingFactory,
    setTradePairIndex: state.setTradePairIndex,
    tradePairIndex: state.tradePairIndex,
    pairConfig: state.pairConfig,
  }))

  const { openDaiLong, openDaiShort, borrowLongVal, borrowShortVal } = useGetMarketStats(
    tradePool?.storageT || '',
    tradePool?.decimals || 18,
    tradePool.pairInfoT || '',
    tradePairIndex
  )

  const showSwitch = useMemo(() => {
    return EXCHANGE_TRADING_T.includes(tradePool.tradingT) || Object.keys(pairConfig).length > 0
  }, [tradePool])

  const tradePair = useMemo(() => {
    return pairConfig[tradePairIndex]
  }, [tradePairIndex, pairConfig])

  const currentMode = useMemo(() => {
    if (tradeModel === TradeMode.DEGEN) return 'Degen'
    if (tradeModel === TradeMode.BASIC) return 'Basic'
    return 'Pro'
  }, [tradeModel])

  const [modeAnchorEl, setModeAnchorEl] = useState<null | HTMLElement>(null)

  const modeOpen = useMemo(() => {
    return Boolean(modeAnchorEl)
  }, [modeAnchorEl])

  const handleModeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setModeAnchorEl(event.currentTarget)
  }

  const handleModeClose = () => {
    setModeAnchorEl(null)
  }

  useEffect(() => {
    setTradePairIndex(0)
    return () => setTradePairIndex(0)
  }, [showSwitch])

  useEffect(() => {
    if (allPoolParams.length > 0) {
      setTradePool(allPoolParams[0])
      const target = allPoolParams.find((pool) => pool.tradingT === BASE_KRAV_TRADING_ADDRESS)
      if (target) setTradePool(target)
      else setTradePool(allPoolParams[0])
    }
  }, [isLoadingFactory])

  return (
    <>
      <SelectPair isOpen={choosePair} setIsOpen={() => setChoosePair(false)} />
      <div
        css={[
          pairInfo,
          card,
          css`
            background: ${theme.background.primary};
            position: relative;
            @media screen and (max-width: 1500px) {
              overflow: auto;
              &::-webkit-scrollbar {
                width: 5px;
                height: 8px;
                //height: 4px;
              }
              &::-webkit-scrollbar-thumb {
                border-radius: 99px;
                background-color: ${theme.background.second};
              }
            }
            @media screen and (max-width: 1200px) {
              padding: 12px;
              &::-webkit-scrollbar {
                display: none;
                //height: 4px;
              }
            }
          `,
        ]}
      >
        <div
          css={css`
            position: absolute;
            width: calc(100% - 48px);
            justify-content: space-between;
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
            `}
          >
            <div
              css={[
                align,
                css`
                  padding-right: 16px;
                `,
              ]}
            >
              <div
                css={css`
                  display: flex;
                  align-items: center;
                `}
              >
                {isMobile && (
                  <>
                    <Button
                      sx={{
                        color: theme.palette.mode === 'dark' ? '#a4a8fe' : '#2832f5',
                        borderRadius: '4px',
                        border: 'unset',
                        textTransform: 'none',
                        minWidth: '60px',
                      }}
                      endIcon={
                        modeOpen ? (
                          <KeyboardArrowUpIcon
                            sx={{
                              height: '12px',
                              width: '12px',
                              color: theme.palette.mode === 'dark' ? '#dedede' : '',
                            }}
                          />
                        ) : (
                          <KeyboardArrowDownIcon
                            sx={{
                              height: '12px',
                              width: '12px',
                              color: theme.palette.mode === 'dark' ? '#dedede' : '',
                            }}
                          />
                        )
                      }
                      id="network-button"
                      aria-controls={modeOpen ? 'network-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={modeOpen ? 'true' : undefined}
                      onClick={handleModeClick}
                    >
                      {currentMode}
                    </Button>
                    <Menu
                      sx={{
                        '& .MuiPaper-root': {
                          minWidth: 100,
                        },
                      }}
                      id="network-menu"
                      anchorEl={modeAnchorEl}
                      open={modeOpen}
                      onClose={handleModeClose}
                      MenuListProps={{
                        'aria-labelledby': 'network-button',
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          setTradeModel(TradeMode.DEGEN)
                          setModeAnchorEl(null)
                        }}
                      >
                        Degen
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setTradeModel(TradeMode.PRO)
                          setModeAnchorEl(null)
                        }}
                      >
                        Pro
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setTradeModel(TradeMode.BASIC)
                          setModeAnchorEl(null)
                        }}
                      >
                        Basic
                      </MenuItem>
                    </Menu>
                  </>
                )}

                <span>Market</span>
                {/*<KeyboardArrowDownIcon sx={{ height: '12px', width: '12px', marginLeft: '8px' }} />*/}
              </div>
              <div
                css={[
                  align,
                  css`
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    margin-left: ${isMobile ? '8px' : '34px'};
                  `,
                ]}
              >
                <div
                  className="symbol"
                  css={css`
                    display: flex;
                    align-items: center;
                  `}
                >
                  {tradePair.titleSymbol}
                </div>
                <div
                  onClick={() => {
                    if (showSwitch) {
                      setChoosePair(true)
                    } else return
                  }}
                  css={css`
                    display: flex;
                    align-items: center;
                  `}
                >
                  <span
                    css={css`
                      color: ${isBTCRise ? '#009b72' : '#db4c40'};
                      font-size: 20px;
                      line-height: 1.4;
                    `}
                  >
                    {BTCPrice.toFixed(tradePair.fixDecimals)}
                  </span>
                  {showSwitch && (
                    <div
                      css={css`
                        background: linear-gradient(180deg, #84ff9f 0%, #ffe071 49.53%, #f96262 96.35%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 6px;
                        height: 32px;
                        width: 32px;
                        margin-left: 8px;
                      `}
                    >
                      <KeyboardArrowDownIcon sx={{ color: '#000', height: '24px', width: '24px' }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div css={align}>
              <div
                className="info-card"
                css={css`
                  padding: 0 12px !important;
                  border-left: ${theme.splitLine.primary};
                `}
              >
                <p>
                  <Trans>Open Interest(L)</Trans>
                </p>
                <p
                  css={css`
                    color: ${theme.text.primary};
                    display: flex;
                    align-items: center;
                  `}
                >
                  <span>{formatNumber(openDaiLong?.toString() || '', 2, false) || '-'}</span>
                </p>
              </div>
              <div
                className="info-card"
                css={css`
                  padding: 0 12px !important;
                  border-left: ${theme.splitLine.primary};
                `}
              >
                <p>
                  <Trans>Open Interest(S)</Trans>
                </p>
                <p
                  css={css`
                    color: ${theme.text.primary};
                    display: flex;
                    align-items: center;
                  `}
                >
                  <span>{formatNumber(openDaiShort?.toString() || '', 2, false) || '-'}</span>
                </p>
              </div>
              <div
                className="info-card"
                css={css`
                  border-left: ${theme.splitLine.primary};
                `}
              >
                <p>
                  <Trans>Borrowing(L)</Trans>
                </p>
                <p
                  css={css`
                    color: ${openDaiShort && openDaiLong?.gt(openDaiShort)
                      ? '#009b72'
                      : openDaiLong?.toString() === openDaiShort?.toString()
                      ? '#000'
                      : '#db4c40'};
                  `}
                >
                  <span
                    css={css`
                      color: ${theme.text.primary};
                    `}
                  >
                    {openDaiShort && openDaiLong?.gt(openDaiShort)
                      ? ''
                      : openDaiLong?.toString() === openDaiShort?.toString()
                      ? ''
                      : '-'}
                    {borrowLongVal?.abs()?.toFixed(4)}%
                  </span>
                </p>
              </div>
              <div
                className="info-card"
                css={css`
                  border-left: ${theme.splitLine.primary};
                `}
              >
                <p>
                  <Trans>Borrowing(S)</Trans>
                </p>
                <p
                  css={css`
                    color: ${openDaiShort && openDaiLong?.gt(openDaiShort)
                      ? '#db4c40'
                      : openDaiLong?.toString() === openDaiShort?.toString()
                      ? '#000'
                      : '#009b72'};
                  `}
                >
                  <span
                    css={css`
                      color: ${theme.text.primary};
                    `}
                  >
                    {openDaiShort && openDaiLong?.lt(openDaiShort)
                      ? ''
                      : openDaiLong?.toString() === openDaiShort?.toString()
                      ? ''
                      : '-'}
                    {borrowShortVal?.abs()?.toFixed(4)}%
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div
            css={css`
              display: flex;
              align-items: center;
              background: ${theme.palette.mode === 'dark' ? '#0f1114' : '#f6f7f9'};
              padding: 4px;
              border-radius: 8px;
            `}
          >
            <div
              css={css`
                font-family: 'Inter';
                font-size: 12px;
                font-weight: 600;
                font-style: normal;
                line-height: 130%;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 30px;
                width: 83px;
                text-align: center;
                cursor: pointer;
                border-radius: 8px;
                background: ${tradeModel === TradeMode.BASIC
                  ? 'linear-gradient(180deg, #84ff9f 0%, #ffe071 49.53%, #f96262 96.35%)'
                  : 'transparent'};
                color: ${tradeModel === TradeMode.BASIC ? '#000' : theme.text.primary};
              `}
              onClick={() => setTradeModel(TradeMode.BASIC)}
            >
              Basic
            </div>
            <div
              css={css`
                font-family: 'Inter';
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-style: normal;
                text-align: center;
                height: 30px;
                line-height: 130%;
                border-radius: 8px;
                cursor: pointer;
                width: 83px;
                font-weight: 600;
                background: ${tradeModel === TradeMode.PRO
                  ? 'linear-gradient(180deg, #84ff9f 0%, #ffe071 49.53%, #f96262 96.35%)'
                  : 'transparent'};
                color: ${tradeModel === TradeMode.PRO ? '#000' : theme.text.primary};
              `}
              onClick={() => setTradeModel(TradeMode.PRO)}
            >
              Pro
            </div>
            <div
              css={css`
                font-family: 'Inter';
                font-size: 12px;
                font-style: normal;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 83px;
                height: 30px;
                border-radius: 8px;
                line-height: 130%;
                text-align: center;
                cursor: pointer;
                font-weight: 600;
                background: ${tradeModel === TradeMode.DEGEN
                  ? 'linear-gradient(180deg, #84ff9f 0%, #ffe071 49.53%, #f96262 96.35%)'
                  : 'transparent'};
                color: ${tradeModel === TradeMode.DEGEN ? '#000' : theme.text.primary};
              `}
              onClick={() => setTradeModel(TradeMode.DEGEN)}
            >
              Degen
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
