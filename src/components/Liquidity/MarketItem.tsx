/** @jsxImportSource @emotion/react */
import { align } from '../../globalStyle'
import KRAVButton from '../KravUIKit/KravButton'
import { MarketItemProps } from './type'
import { useRootStore } from '../../store/root'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'
import { css } from '@emotion/react'
import { getBigNumberStr } from '../../utils'
import { useGetLpReward } from '../../hook/hookV8/useGetLpReward'
import { useTheme } from '@mui/material'
import KravButtonHollow from '../KravUIKit/KravButtonHollow'

export const MarketItem = ({ setAddLiquidity, poolParams, aprList }: MarketItemProps) => {
  const theme = useTheme()
  const { account } = useWeb3React()
  const getLpReward = useGetLpReward(poolParams.vaultT, poolParams.decimals)
  const [lpReward, setLpReward] = useState(new BigNumber(0))

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
  }, [aprList])

  useEffect(() => {
    if (poolSupply.isGreaterThan(0)) {
      getLpReward(setLpReward).then()
    }
  }, [poolSupply])

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
      <div>{apr.toFixed(2)}%</div>
      <div>{isNaN(poolParams.utilization.toNumber()) ? 0 : poolParams.utilization.toFixed(2)}%</div>
      <div>
        <p>
          {poolParams.poolTotalSupply?.toFixed(2)} {poolParams.symbol}
        </p>
        {/*<p className="small grey">({poolParams.poolTotalSupply?.div(poolParams.proportionBTC).toFixed(2)}&nbsp;BTC) </p>*/}
      </div>
      <div>
        {getBigNumberStr(poolSupply, 2)} {poolParams.symbol}
      </div>
      <div>
        {getBigNumberStr(lpReward, 2)} {poolParams.symbol}
      </div>
      <div>
        {account && (
          <KravButtonHollow
            onClick={() => {
              setAddLiquidity(true)
              setLiquidityInfo(poolParams)
            }}
          >
            Add Liquidity
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
