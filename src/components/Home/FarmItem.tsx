/** @jsxImportSource @emotion/react */
import { align } from '../../globalStyle'
import { css } from '@emotion/react'
import { UserData } from '../../hook/hookV8/useUserPosition'
import { useGetLpReward } from '../../hook/hookV8/useGetLpReward'
import { useEffect, useState } from 'react'
import { useHarvestLpReward } from '../../hook/hookV8/useHarvestLpReward'
import BigNumber from 'bignumber.js'
import KRAVButton from '../KravUIKit/KravButton'
import { getBigNumberStr } from 'utils'
import { useWeb3React } from '@web3-react/core'

type FarmItemProps = {
  position: UserData
}

export const FarmItem = ({ position }: FarmItemProps) => {
  const { account } = useWeb3React()
  const getLpReward = useGetLpReward(position.pool.vaultT, position.pool.decimals)
  const claimLp = useHarvestLpReward(position.pool.vaultT)
  const [lpReward, setLpReward] = useState(new BigNumber(0))

  useEffect(() => {
    getLpReward(setLpReward).then()
  }, [account])

  return (
    <div className="liquidity">
      <div css={align}>
        <img
          css={css`
            border-radius: 50%;
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
      <div>
        <p>
          1 BTC={position.pool.proportionBTC} {position.pool.symbol}
        </p>
      </div>
      <div>12.32%</div>
      <div>{position.pool.utilization.toFixed(2)}%</div>
      <div>
        {' '}
        {position.pool.poolTotalSupply?.toFixed(2)} {position.pool.symbol}
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
