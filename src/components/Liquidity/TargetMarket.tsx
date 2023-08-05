/** @jsxImportSource @emotion/react */
import KARVSearchTextField from '../../components/KravUIKit/KarvSearchTextField'
import KRAVButton from '../KravUIKit/KravButton'
import { TargetMarketProps } from './type'
import { useRootStore } from '../../store/root'
import { MarketItem } from './MarketItem'
import { useWeb3React } from '@web3-react/core'
import { MarketSkeleton } from './MarketSkeleton'

export const TargetMarket = ({ setCreateLiquidityPool, setAddLiquidity, aprList }: TargetMarketProps) => {
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const isLoadingFactory = useRootStore((store) => store.isLoadingFactory)
  const { account } = useWeb3React()

  return (
    <div className="liquidity-content">
      <div className="liquidity-tabs">
        <span>Target Market</span>
        <span>{allPoolParams.length > 0 ? ` (${allPoolParams.length})` : ''}</span>
      </div>
      <div className="liquidity-search">
        <KARVSearchTextField placeholder="Search name or paste address" adornment={'start'} sx={{ height: '40px' }} />
        {account && (
          <KRAVButton sx={{ width: '132px' }} onClick={() => setCreateLiquidityPool(true)}>
            Create Liquidity
          </KRAVButton>
        )}
      </div>
      <div>
        <div className="liquidity-table grey nowrap">
          <div>ASSET</div>
          <div>CONVERSION RATIO</div>
          <div>APR</div>
          <div>UTILIZATION</div>
          <div>TOTAL LIQUIDITY SUPPLY</div>
          <div>YOUR LIQUIDITY SUPPLY</div>
          <div>LP REWARD</div>
        </div>
        {isLoadingFactory &&
          [...Array(3).keys()].map((i) => {
            return <MarketSkeleton key={'Skeleton_' + String(i)} />
          })}
        {!isLoadingFactory &&
          allPoolParams.length > 0 &&
          allPoolParams.map((pool, index) => {
            return (
              <MarketItem
                setAddLiquidity={setAddLiquidity}
                poolParams={pool}
                aprList={aprList}
                key={pool.tokenT + index}
              />
            )
          })}
      </div>
    </div>
  )
}
