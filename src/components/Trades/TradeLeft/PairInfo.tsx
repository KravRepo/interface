/** @jsxImportSource @emotion/react */
import { Trans } from '@lingui/macro'
import { card, pairInfo } from '../style'
import { align } from '../../../globalStyle'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useRootStore } from '../../../store/root'
import React, { Dispatch, useCallback, useEffect, useState } from 'react'
import KravSwitch from '../../KravUIKit/KravSwitch'
import { MARKET_CHANGE_API } from 'constant/chain'

type PairInfoProps = {
  setIsOpenSelectToken: Dispatch<React.SetStateAction<boolean>>
  isProModel: boolean
  setIsProModel: (isProModel: boolean) => void
}

export const PairInfo = ({ setIsOpenSelectToken, setIsProModel, isProModel }: PairInfoProps) => {
  const theme = useTheme()
  const [oneDayChange, setOneDayChange] = useState(0)
  const [oneDayChangePrice, setOneDayChangePrice] = useState(0)
  const [oneDayHeight, setOneDayHeight] = useState(0)
  const [oneDayLow, setOneDayLow] = useState(0)
  const { BTCPrice, isBTCRise, allPoolParams, tradePool, setTradePool, isLoadingFactory } = useRootStore((state) => ({
    BTCPrice: state.BTCPrice,
    isBTCRise: state.isBTCRise,
    tradePool: state.tradePool,
    setTradePool: state.setTradePool,
    allPoolParams: state.allPoolParams,
    isLoadingFactory: state.isLoadingFactory,
  }))

  const handleModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsProModel(event.target.checked)
  }

  useEffect(() => {
    if (allPoolParams.length > 0) {
      const history = localStorage.getItem('trade-pool')
      const target = allPoolParams.find((pool) => pool.tradingT === history)
      if (history && target) setTradePool(target)
      else setTradePool(allPoolParams[0])
    }
  }, [isLoadingFactory])

  const getData = useCallback(async () => {
    try {
      const response = await fetch(MARKET_CHANGE_API)
      const data = await response.json()
      setOneDayHeight(Number(data.highPrice))
      setOneDayLow(Number(data.lowPrice))
      setOneDayChange(Number(data.priceChangePercent))
      setOneDayChangePrice(Number(data.priceChange))
    } catch (e) {
      console.error('get 24hr price data failed!', e)
    }
  }, [])

  useEffect(() => {
    getData().then()
    const interval = setInterval(async () => {
      await getData()
    }, 7000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div css={[pairInfo, card]}>
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
            <KeyboardArrowDownIcon sx={{ height: '12px', width: '12px', marginLeft: '8px' }} />
          </div>
          <div
            onClick={() => {
              setIsOpenSelectToken(true)
            }}
            css={[
              align,
              css`
                cursor: pointer;
                margin-left: 34px;
              `,
            ]}
          >
            <span className="symbol">{tradePool?.symbol} / BTC</span>
            <span
              css={css`
                color: ${isBTCRise ? '#009b72' : '#db4c40'};
                font-size: 20px;
                line-height: 1.4;
              `}
            >
              {BTCPrice.toFixed(2)}
            </span>
            <KeyboardArrowDownIcon sx={{ height: '12px', width: '12px', marginLeft: '8px' }} />
          </div>
        </div>
        <div css={align}>
          <div
            className="info-card"
            css={css`
              border-left: ${theme.card.splitLine};
            `}
          >
            <p>
              <Trans>24h Change</Trans>
            </p>
            <p
              css={css`
                color: ${oneDayChange > 0 ? '#009b72' : '#db4c40'};
              `}
            >
              <span>{oneDayChangePrice.toFixed(2)}</span>
              <span>({oneDayChange})%</span>
            </p>
          </div>
          <div
            className="info-card"
            css={css`
              border-left: ${theme.card.splitLine};
            `}
          >
            <p>
              <Trans>Market Price</Trans>
            </p>
            <p
              css={css`
                color: #000000;
              `}
            >
              <span>{BTCPrice.toFixed(2)}</span>
            </p>
          </div>
          <div
            className="info-card"
            css={css`
              border-left: ${theme.card.splitLine};
            `}
          >
            <p>
              <Trans>24H High</Trans>
            </p>
            <p
              css={css`
                color: #000000;
              `}
            >
              <span>{oneDayHeight.toFixed(2)}</span>
            </p>
          </div>
          <div
            className="info-card"
            css={css`
              border-left: ${theme.card.splitLine};
            `}
          >
            <p>
              <Trans>24H Low</Trans>
            </p>
            <p
              css={css`
                color: #000000;
              `}
            >
              <span>{oneDayLow.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>
      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <span
          css={css`
            margin: 0;
            font-family: 'GT-Flexa-Bold-Trial';
            font-size: 20px;
            font-style: normal;
            font-weight: 900;
            line-height: 130%;
            padding-right: 12px;
            color: #2832f5;
          `}
        >
          {isProModel ? 'Pro' : 'Basic'}
        </span>
        <KravSwitch checked={isProModel} onChange={handleModelChange} />
      </div>
    </div>
  )
}
