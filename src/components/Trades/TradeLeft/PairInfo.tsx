/** @jsxImportSource @emotion/react */
// import { Trans } from '@lingui/macro'
import { card, pairInfo } from '../style'
// import { align } from '../../../globalStyle'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material'
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useRootStore } from '../../../store/root'
import { useEffect } from 'react'
// import { useGetMarketStats } from '../../../hook/hookV8/useGetMarketStats'
// import { formatNumber } from '../../../utils'
// import { BASE_KRAV_TRADING_ADDRESS } from '../../../constant/chain'
import { TradeMode } from '../../../store/TradeSlice'
// import { EXCHANGE_TRADING_T } from '../../../constant/exchange'
// import { SelectPair } from '../../Dialog/SelectPair'
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { BASE_KRAV_TRADING_ADDRESS } from '../../../constant/chain'
import CoinInfo from './CoinInfo'

type PairInfoProps = {
  setIsOpenSelectToken: (isOpenSelectToken: boolean) => void
  tradeModel: TradeMode
  setTradeModel: (tradeModel: TradeMode) => void
}

export const PairInfo = ({ setIsOpenSelectToken, setTradeModel, tradeModel }: PairInfoProps) => {
  const theme = useTheme()
  // const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  // const [choosePair, setChoosePair] = useState(false)
  const {
    // BTCPrice,
    // isBTCRise,
    allPoolParams,
    tradePool,
    setTradePool,
    isLoadingFactory,
    setTradePairIndex,
    // tradePairIndex,
    // pairConfig,
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

  // const tradePair = useMemo(() => {
  //   return pairConfig[tradePairIndex]
  // }, [tradePairIndex, pairConfig])

  // const currentMode = useMemo(() => {
  //   if (tradeModel === TradeMode.DEGEN) return 'Degen'
  //   if (tradeModel === TradeMode.BASIC) return 'Basic'
  //   return 'Pro'
  // }, [tradeModel])

  // const [modeAnchorEl, setModeAnchorEl] = useState<null | HTMLElement>(null)

  // const modeOpen = useMemo(() => {
  //   return Boolean(modeAnchorEl)
  // }, [modeAnchorEl])

  // const handleModeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setModeAnchorEl(event.currentTarget)
  // }

  // const handleModeClose = () => {
  //   setModeAnchorEl(null)
  // }

  useEffect(() => {
    setTradePairIndex(0)
    return () => setTradePairIndex(0)
  }, [])

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

      <div
        css={[
          pairInfo,
          card,
          css`
            background: ${theme.background.primary};
            position: relative;
            margin-bottom: 16px;
            width: ${'100%'};
            margin-left: auto;
            justify-content: flex-start;
            @media screen and (max-width: 1500px) {
              overflow: hidden;
            }
            @media screen and (max-width: 1200px) {
              padding: 12px;
            }
          `,
        ]}
      >
        <div style={{width: '100px'}}>Collateral</div>
        <div>                 
          {<CoinInfo pool={tradePool} />}
        </div>
        {
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
                background: ${tradeModel === TradeMode.BASIC ? '#2832f5' : 'transparent'};
                color: ${tradeModel === TradeMode.BASIC ? theme.text.primary : theme.text.primary};
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
                background: ${tradeModel === TradeMode.PRO ? '#2832f5' : 'transparent'};
                color: ${tradeModel === TradeMode.PRO ? theme.text.primary : theme.text.primary};
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
                background: ${tradeModel === TradeMode.DEGEN ? '#2832f5' : 'transparent'};
                color: ${tradeModel === TradeMode.DEGEN ? theme.text.primary : theme.text.primary};
              `}
              onClick={() => setTradeModel(TradeMode.DEGEN)}
            >
              Degen
            </div>
          </div>
        }
      </div>

      <div
        css={[
          pairInfo,
          card,
          css`
            background: ${theme.background.primary};
            position: relative;
            margin-bottom: 16px;
            width: ${'100%'};
            margin-left: auto;
            justify-content: flex-start;
            @media screen and (max-width: 1500px) {
              overflow: hidden;
            }
            @media screen and (max-width: 1200px) {
              padding: 12px;
            }
          `,
        ]}
      >
        <div style={{width: '100px'}}>Market</div>
        <div>                 
          {<CoinInfo isBTC={true} />}
        </div>
      </div>      

      {/* <div
        css={[
          pairInfo,
          card,
          css`
            background: ${theme.background.primary};
            position: relative;
            @media screen and (max-width: 1500px) {
              overflow: auto;
              overflow-y: hidden;
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

                <span style={{width: '100px'}}>Market</span>
              </div>
              <div
                css={[
                  align,
                  css`
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                  `,
                ]}
              >
                <div
                  className="symbol"
                  css={css`
                    display: flex;
                    align-items: center;
                    width: 100px;
                  `}
                  // style={{ border: '1px solid red' }}
                >
                  <img
                    css={css`
                      border-radius: 50%;
                      background: ${theme.palette.mode === 'dark' ? '#fff' : ''};
                      margin-right: 5px;
                    `}
                    src={tradePair.logoSource.default}
                    height="15"
                    width="15"
                  />

                  {tradePair.titleSymbol}
                </div>
                <div
                  // onClick={() => {
                  //   if (showSwitch) {
                  //     setChoosePair(true)
                  //   } else return
                  // }}
                  css={css`
                    display: flex;
                    align-items: center;
                    width: 150px;
                    border: 1px solid red;
                  `}
                >
                  <span
                    css={css`
                      color: ${isBTCRise ? '#009b72' : '#db4c40'};
                      font-size: 20px;
                      line-height: 1.4;
                    `}
                  >
                    {/* ${Number(BTCPrice).toLocaleString('en-US', { maximumFractionDigits: 2 })} 
                    $67,789.99
                  </span>
                </div>
              </div>
            </div>
            <CoinInfo isBTC={true} />
          </div>
        </div>
      </div> */}
    </>
  )
}
