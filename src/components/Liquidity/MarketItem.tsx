/** @jsxImportSource @emotion/react */
import { align } from '../../globalStyle'
import KRAVButton from '../KravUIKit/KravButton'
import { MarketItemProps } from './type'
import { useRootStore } from '../../store/root'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'
import { css } from '@emotion/react'
// import { useGetLpReward } from '../../hook/hookV8/useGetLpReward'
import { useTheme } from '@mui/material'
import KravButtonHollow from '../KravUIKit/KravButtonHollow'
import { t } from '@lingui/macro'
import { usePnl } from '../../hook/hookV8/usePnl'

export const MarketItem = ({ setAddLiquidity, setRemoveLiquidity, poolParams, aprList }: MarketItemProps) => {
  const theme = useTheme()
  const { account } = useWeb3React()
  // const [lpReward, setLpReward] = useState(new BigNumber(0))
  const { tokenAmount } = usePnl(poolParams.vaultT, poolParams.decimals)

  // TODO: Withdraw the balance when the dialog box is opened?
  const setLiquidityInfo = useRootStore((store) => store.setLiquidityInfo)
  const setWalletDialogVisibility = useRootStore((store) => store.setWalletDialogVisibility)
  const userPositionDatas = useRootStore((store) => store.userPositionDatas)
  const poolSupply = useMemo(() => {
    const supply =
      userPositionDatas.find((item) => item.pool?.tradingT === poolParams?.tradingT)?.daiDeposited ?? new BigNumber(0)
    return eXDecimals(supply, poolParams.decimals)
  }, [poolParams, userPositionDatas])

  const apr = useMemo(() => {
    const res = aprList.find((list) => list?.tradingT === poolParams?.tradingT)
    if (res) return res.apr
    else return new BigNumber(0)
  }, [aprList, poolParams?.tradingT])

  // useGetLpReward(poolParams.vaultT, poolParams.decimals, poolSupply.isGreaterThan(0) ? setLpReward : undefined)

  return (
    <div className="liquidity-table">
      <div css={align}>
        <img
          css={css`
            border-radius: 50%;
            background: ${theme.palette.mode === 'dark' ? '#fff' : ''};
          `}
          src={poolParams.logoSource}
          height="40"
          width="40"
        />
        <div
          css={css`
            margin-left: 8px;
          `}
        >
          <p>{poolParams.symbol}</p>
          <p className="small grey">{poolParams.symbol}</p>
        </div>
      </div>
      {/*<div>*/}
      {/*  1 BTC={poolParams.proportionBTC} {poolParams.symbol}*/}
      {/*</div>*/}
      {apr.isGreaterThan(0) ? <div>{apr.toFixed(2)}%</div> : <div>-</div>}
      <div>{isNaN(poolParams.utilization.toNumber()) ? 0 : poolParams.utilization.toFixed(2)}%</div>
      <div>
        <p>
          {poolParams.poolTotalSupply?.toFormat(2, 3)} {poolParams.symbol}
        </p>
        {/*<p className="small grey">({poolParams.poolTotalSupply?.div(poolParams.proportionBTC).toFixed(2)}&nbsp;BTC) </p>*/}
      </div>
      <div>
        {poolSupply.toFormat(2, 3)} {poolParams.symbol}
      </div>
      <div>
        {tokenAmount.toFormat(2, 3)} {poolParams.symbol}
      </div>
      <div>
        {account && (
          <KravButtonHollow
            onClick={() => {
              setAddLiquidity(true)
              setLiquidityInfo(poolParams)
            }}
          >
            {t`Add Liquidity`}
          </KravButtonHollow>
        )}

        {!account && (
          <KRAVButton
            onClick={() => {
              setWalletDialogVisibility(true)
            }}
          >
            Connect Wallet
          </KRAVButton>
        )}
      </div>
    </div>
  )
}
