/** @jsxImportSource @emotion/react */
// import { Trans } from '@lingui/macro'
import { card, pairInfo } from '../style'
// import { align } from '../../../globalStyle'
import { css } from '@emotion/react'
import { Button, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useRootStore } from '../../../store/root'
import { useEffect, useMemo, useState } from 'react'
// import { useGetMarketStats } from '../../../hook/hookV8/useGetMarketStats'
// import { formatNumber } from '../../../utils'
// import { BASE_KRAV_TRADING_ADDRESS } from '../../../constant/chain'
import { TradeMode } from '../../../store/TradeSlice'
// import { EXCHANGE_TRADING_T } from '../../../constant/exchange'
// import { SelectPair } from '../../Dialog/SelectPair'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
// import { BASE_KRAV_TRADING_ADDRESS } from '../../../constant/chain'
import CoinInfo from './CoinInfo'
import { Trans } from '@lingui/macro'

type PairInfoProps = {
  setIsOpenSelectToken: (isOpenSelectToken: boolean) => void
  tradeModel: TradeMode
  setTradeModel: (tradeModel: TradeMode) => void
}

export const PairInfo = ({ setIsOpenSelectToken, setTradeModel, tradeModel }: PairInfoProps) => {
  const [modeAnchorEl, setModeAnchorEl] = useState<null | HTMLElement>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  // const [choosePair, setChoosePair] = useState(false)

  const {
    // BTCPrice,
    // isBTCRise,
    // allPoolParams,
    tradePool,
    // setTradePool,
    // isLoadingFactory,
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

  const modeOpen = useMemo(() => {
    return Boolean(modeAnchorEl)
  }, [modeAnchorEl])

  const handleModeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setModeAnchorEl(event.currentTarget)
  }

  const handleModeClose = () => {
    setModeAnchorEl(null)
  }

  const currentMode = useMemo(() => {
    if (tradeModel === TradeMode.DEGEN) return 'Degen'
    if (tradeModel === TradeMode.BASIC) return 'Basic'
    return 'Pro'
  }, [tradeModel])

  useEffect(() => {
    setTradePairIndex(0)
    return () => setTradePairIndex(0)
  }, [setTradePairIndex])

  // useEffect(() => {
  //   if (allPoolParams.length > 0) {
  //     setTradePool(allPoolParams[0])
  //     const target = allPoolParams.find((pool) => pool.tradingT === BASE_KRAV_TRADING_ADDRESS)
  //     if (target) setTradePool(target)
  //     else setTradePool(allPoolParams[0])
  //   }
  // }, [isLoadingFactory])

  return (
    <>
      <div
        css={[
          pairInfo,
          card,
          css`
            background: ${theme.background.primary};
          `,
        ]}
      >
        <CoinInfo pool={tradePool} />
        {isMobile && (
          <>
            <Button
              sx={{
                color: theme.palette.mode === 'dark' ? '#a4a8fe' : '#2832f5',
                borderRadius: '4px',
                border: 'unset',
                textTransform: 'none',
                minWidth: '60px',
                marginLeft: 'auto',
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
                <Trans>Degen</Trans>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setTradeModel(TradeMode.PRO)
                  setModeAnchorEl(null)
                }}
              >
                <Trans>Pro</Trans>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setTradeModel(TradeMode.BASIC)
                  setModeAnchorEl(null)
                }}
              >
                <Trans>Basic</Trans>
              </MenuItem>
            </Menu>
          </>
        )}
      </div>

      <div
        css={[
          pairInfo,
          card,
          css`
            background: ${theme.background.primary};
          `,
        ]}
      >
        <CoinInfo isBTC={true} />
        {!isMobile && (
          <div
            css={css`
              display: flex;
              align-items: center;
              background: ${theme.background.second};
              padding: 4px;
              border-radius: 8px;
              margin-left: auto;
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
                width: 64px;
                text-align: center;
                cursor: pointer;
                border-radius: 8px;
                background: ${tradeModel === TradeMode.BASIC ? '#2832f5' : 'transparent'};
                color: ${tradeModel === TradeMode.BASIC ? theme.text.primary : theme.text.primary};
              `}
              onClick={() => setTradeModel(TradeMode.BASIC)}
            >
              <Trans>Basic</Trans>
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
                width: 64px;
                font-weight: 600;
                background: ${tradeModel === TradeMode.PRO ? '#2832f5' : 'transparent'};
                color: ${tradeModel === TradeMode.PRO ? theme.text.primary : theme.text.primary};
              `}
              onClick={() => setTradeModel(TradeMode.PRO)}
            >
              <Trans>Pro</Trans>
            </div>
            <div
              css={css`
                font-family: 'Inter';
                font-size: 12px;
                font-style: normal;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 64px;
                height: 30px;
                border-radius: 8px;
                line-height: 130%;
                text-align: center;
                cursor: pointer;
                font-weight: 600;
                background: ${tradeModel === TradeMode.DEGEN ? '#2832f5' : 'transparent'};
                color: ${tradeModel === TradeMode.DEGEN ? theme.text.primary : theme.text.primary};
              `}
              onClick={() => setTradeModel(TradeMode.DEGEN)}
            >
              <Trans>Degen</Trans>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
