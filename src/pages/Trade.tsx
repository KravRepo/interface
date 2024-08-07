/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { TradeLeft } from '../components/Trades/TradeLeft'
import { TradeRight } from '../components/Trades/TradeRight'
import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useRootStore } from '../store/root'
import { useNavigate, useParams } from 'react-router-dom'
// import { VALIDITY_ADDRESS_LENGTH } from '../constant/math'
// import { decodeReferral } from '../utils'
import { useMediaQuery, useTheme } from '@mui/material'
import { MyTrade } from '../components/Trades/TradeLeft/MyTrade'
import TradeTop from '../components/Trades/TradeTop'
import { ChainId, CONTRACT_CONFIG } from '../constant/chain'

export const Trade = () => {
  const [leverage, setLeverage] = useState(2)
  const [positionSizeDai, setPositionSizeDai] = useState(new BigNumber(0))
  const [isBuy, setIsBuy] = useState(true)
  const [tpPrice, setTpPrice] = useState<string | BigNumber>('')
  const [slPrice, setSlPrice] = useState<string | BigNumber>('')
  const [tradeType, setTradeType] = useState(0)
  const BTCPrice = useRootStore((state) => state.BTCPrice)
  const pools = useRootStore((state) => state.allPoolParams)
  const setTradePool = useRootStore((state) => state.setTradePool)
  const tradePool = useRootStore((state) => state.tradePool)
  const [limitPrice, setLimitPrice] = useState<string | BigNumber>(BTCPrice)
  const { token: tokenSymbol } = useParams()
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  // useEffect(() => {
  //   const referralBase64Str = pathname.split('/').length > 2 ? pathname.split('/')[2] : null
  //   if (referralBase64Str) {
  //     const referral = decodeReferral(referralBase64Str)
  //     // TODO Check is a account address
  //     if (referral.length === VALIDITY_ADDRESS_LENGTH) {
  //       localStorage.setItem('krav-referral', referralBase64Str)
  //     }
  //   }
  // }, [pathname])

  useEffect(() => {
    if (tokenSymbol) {
      const pool = pools.find((p) => p.symbol.toLocaleLowerCase() === tokenSymbol.toLocaleLowerCase())
      if (pool) {
        setTradePool(pool)
      }
    } else {
      const pool = pools.find(
        (p) => p.tokenT.toLocaleLowerCase() === CONTRACT_CONFIG[ChainId.BASE].kravAddress.toLocaleLowerCase()
      )
      if (pool) {
        setTradePool(pool)
      }
    }
  }, [pools, setTradePool, tokenSymbol, tradePool])

  useEffect(() => {
    if (!!tradePool.symbol) {
      navigate('/trade/' + tradePool.symbol)
    }
  }, [navigate, tradePool])

  return (
    <div
      css={css`
        padding: ${isMobile ? '14px 16px' : '16px 32px'};
      `}
    >
      <TradeTop />
      <div
        css={css`
          display: ${isMobile ? 'block' : 'flex'};
          width: 100%;
          font-family: 'Inter';
        `}
      >
        <TradeLeft
          tradeType={tradeType}
          isBuy={isBuy}
          positionSizeDai={positionSizeDai}
          leverage={leverage}
          limitPrice={limitPrice}
          setLeverage={setLeverage}
          setPositionSizeDai={setPositionSizeDai}
          setSlPrice={setSlPrice}
          setTpPrice={setTpPrice}
          slPrice={slPrice}
          tpPrice={tpPrice}
          setLimitPrice={setLimitPrice}
          setTradeType={setTradeType}
          setIsBuy={setIsBuy}
        />
        <TradeRight
          leverage={leverage}
          setLeverage={setLeverage}
          positionSizeDai={positionSizeDai}
          setPositionSizeDai={setPositionSizeDai}
          isBuy={isBuy}
          setIsBuy={setIsBuy}
          tpPrice={tpPrice}
          setTpPrice={setTpPrice}
          slPrice={slPrice}
          setSlPrice={setSlPrice}
          limitPrice={limitPrice}
          setLimitPrice={setLimitPrice}
          tradeType={tradeType}
          setTradeType={setTradeType}
        />
        {isMobile && <MyTrade />}
      </div>
    </div>
  )
}
