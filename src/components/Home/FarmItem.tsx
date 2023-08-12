/** @jsxImportSource @emotion/react */
import { align } from '../../globalStyle'
import { css } from '@emotion/react'
import { UserData } from '../../hook/hookV8/useUserPosition'
import { useGetLpReward } from '../../hook/hookV8/useGetLpReward'
import { useEffect, useMemo, useState } from 'react'
import { useHarvestLpReward } from '../../hook/hookV8/useHarvestLpReward'
import BigNumber from 'bignumber.js'
import KRAVButton from '../KravUIKit/KravButton'
import { getBigNumberStr } from '../../utils'
import { useWeb3React } from '@web3-react/core'
import { AprList } from '../../hook/hookV8/useGetApr'
import { eXDecimals } from '../../utils/math'
import { useTheme } from '@mui/material'

type FarmItemProps = {
  position: UserData
  aprList: AprList[]
}

export const FarmItem = ({ position, aprList }: FarmItemProps) => {
  const theme = useTheme()
  const { account } = useWeb3React()
  const getLpReward = useGetLpReward(position.pool.vaultT, position.pool.decimals)
  const claimLp = useHarvestLpReward(position.pool.vaultT)
  const [lpReward, setLpReward] = useState(new BigNumber(0))

  const apr = useMemo(() => {
    const res = aprList.find((list) => list?.tradingT === position?.pool?.tradingT)
    if (res) return res.apr
    else return new BigNumber(0)
  }, [aprList])

  useEffect(() => {
    getLpReward(setLpReward).then()
  }, [account])

  return (
    <div className="liquidity">
      <div css={align}>
        <img
          css={css`
            border-radius: 50%;
            background: ${theme.palette.mode === 'dark' ? '#fff' : ''};
          `}
          src={position.pool.logoSource}
          height="40"
          width="40"
        />
        <div
          css={css`
            margin-left: 12px;
          `}
        >
          <p>{position.pool.symbol}</p>
          <p className="grey">{position.pool.symbol}</p>
        </div>
      </div>
      {/*<div>*/}
      {/*  <p>*/}
      {/*    1 BTC={position.pool.proportionBTC} {position.pool.symbol}*/}
      {/*  </p>*/}
      {/*</div>*/}
      <div>{apr.toFixed(2)}%</div>
      <div>{position.pool.utilization.toFixed(2)}%</div>
      <div>
        <p>
          {eXDecimals(position.daiDeposited, position.pool.decimals).toFixed(2)} {position.pool.symbol}
        </p>
        {/*<p className="small grey">*/}
        {/*  ({eXDecimals(position.daiDeposited, position.pool.decimals).div(position.pool.proportionBTC).toFixed(2)}*/}
        {/*  &nbsp;BTC)*/}
        {/*</p>*/}
      </div>
      <div>
        {getBigNumberStr(lpReward, 2)} {position.pool.symbol}
      </div>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: end;
          white-space: nowrap;
        `}
      >
        <KRAVButton
          disabled={lpReward.isEqualTo(0)}
          className="more"
          onClick={async () => {
            await claimLp(lpReward, position.pool.symbol)
            await getLpReward(setLpReward)
          }}
        >
          Claim
        </KRAVButton>
      </div>
    </div>
  )
}
