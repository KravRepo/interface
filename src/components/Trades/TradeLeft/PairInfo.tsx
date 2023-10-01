/** @jsxImportSource @emotion/react */
import { Trans } from '@lingui/macro'
import { card, pairInfo } from '../style'
import { align } from '../../../globalStyle'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material'
import { useRootStore } from '../../../store/root'
import { useEffect } from 'react'
// import { MARKET_CHANGE_API } from '../../../constant/chain'
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
// import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { useGetMarketStats } from '../../../hook/hookV8/useGetMarketStats'
import { formatNumber } from '../../../utils'
import { BASE_KRAV_TRADING_ADDRESS } from '../../../constant/chain'
import { TradeMode } from '../../../store/TradeSlice'

type PairInfoProps = {
  setIsOpenSelectToken: (isOpenSelectToken: boolean) => void
  tradeModel: TradeMode
  setTradeModel: (tradeModel: TradeMode) => void
}

export const PairInfo = ({ setIsOpenSelectToken, setTradeModel, tradeModel }: PairInfoProps) => {
  const theme = useTheme()
  // const [oneDayChange, setOneDayChange] = useState(0)
  // const [oneDayChangePrice, setOneDayChangePrice] = useState(0)
  // const [oneDayHeight, setOneDayHeight] = useState(0)
  // const [oneDayLow, setOneDayLow] = useState(0)
  const { BTCPrice, isBTCRise, allPoolParams, tradePool, setTradePool, isLoadingFactory } = useRootStore((state) => ({
    BTCPrice: state.BTCPrice,
    isBTCRise: state.isBTCRise,
    tradePool: state.tradePool,
    setTradePool: state.setTradePool,
    allPoolParams: state.allPoolParams,
    isLoadingFactory: state.isLoadingFactory,
  }))

  const { openDaiLong, openDaiShort, borrowLongVal, borrowShortVal } = useGetMarketStats(
    tradePool?.storageT || '',
    tradePool?.decimals || 18,
    tradePool.pairInfoT || ''
  )

  useEffect(() => {
    if (allPoolParams.length > 0) {
      const target = allPoolParams.find((pool) => pool.tradingT === BASE_KRAV_TRADING_ADDRESS)
      if (target) setTradePool(target)
      else setTradePool(allPoolParams[0])
    }
  }, [isLoadingFactory])

  // const getData = useCallback(async () => {
  //   try {
  //     const response = await fetch(MARKET_CHANGE_API)
  //     const data = await response.json()
  //     setOneDayHeight(Number(data.data.highPrice))
  //     setOneDayLow(Number(data.data.lowPrice))
  //     setOneDayChange(Number(data.data.priceChangePercent))
  //     setOneDayChangePrice(Number(data.data.priceChange))
  //   } catch (e) {
  //     console.error('get 24hr price data failed!', e)
  //   }
  // }, [])

  // useEffect(() => {
  //   getData().then()
  //   const interval = setInterval(async () => {
  //     await getData()
  //   }, 7000)
  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [])

  return (
    <div
      css={[
        pairInfo,
        card,
        css`
          background: ${theme.background.primary};
          margin-bottom: 12px;
        `,
      ]}
    >
      <div>
        <div
          css={[
            align,
            css`
              padding-right: 16px;
            `,
          ]}
        >
          <div>
            <span>Market</span>
            {/*<KeyboardArrowDownIcon sx={{ height: '12px', width: '12px', marginLeft: '8px' }} />*/}
          </div>
          <div
            css={[
              align,
              css`
                cursor: pointer;
                margin-left: 34px;
              `,
            ]}
          >
            <div className="symbol">
              <span
                css={css`
                  white-space: nowrap;
                `}
              >
                BTC /
              </span>
              <span>&nbsp;USDT</span>
            </div>
            <span
              css={css`
                color: ${isBTCRise ? '#009b72' : '#db4c40'};
                font-size: 20px;
                line-height: 1.4;
              `}
            >
              {BTCPrice.toFixed(2)}
            </span>
            {/*<KeyboardArrowDownIcon sx={{ height: '12px', width: '12px', marginLeft: '8px' }} />*/}
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
            background: ${tradeModel === TradeMode.BASIC ? '#2832f5' : 'transparent'};
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
            background: ${tradeModel === TradeMode.PRO ? '#2832f5' : 'transparent'};
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
            background: ${tradeModel === TradeMode.DEGEN
              ? 'linear-gradient(180deg, #84ff9f 0%, #ffe071 49.53%, #f96262 96.35%)'
              : 'transparent'};
            color: ${tradeModel === TradeMode.DEGEN ? '#000' : theme.text.primary};
          `}
          onClick={() => setTradeModel(TradeMode.DEGEN)}
        >
          Degen
        </div>
        {/*<span*/}
        {/*/!*  css={css`*!/*/}
        {/*    margin: 0;*/}
        {/*    font-family: 'GT-Flexa-Bold-Trial';*/}
        {/*    font-size: 20px;*/}
        {/*    font-style: normal;*/}
        {/*    font-weight: 900;*/}
        {/*    line-height: 130%;*/}
        {/*    padding-right: 12px;*/}
        {/*    color: #2832f5;*/}
        {/*  `}*/}
        {/*>*/}
        {/*  {tradeModel ? 'Pro' : 'Basic'}*/}
        {/*</span>*/}
        {/*<KravSwitch checked={tradeModel} onChange={handleModelChange} />*/}
      </div>
    </div>
  )
}
