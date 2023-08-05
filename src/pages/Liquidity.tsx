/** @jsxImportSource @emotion/react */
import { liquidity } from '../components/Liquidity/style'
import { TargetMarket } from '../components/Liquidity/TargetMarket'
import { YourPosition } from '../components/Liquidity/YourPosition'
import { useEffect, useState } from 'react'
import { CreateLiquidity } from '../components/Liquidity/CreateLiquidity'
import { RemoveLiquidity } from '../components/Dialog/RemoveLiquidity'
import { AddLiquidity } from '../components/Dialog/AddLiquidity'
import { useRootStore } from '../store/root'
import { useUserPosition } from '../hook/hookV8/useUserPosition'
import { useWeb3React } from '@web3-react/core'
import { css } from '@emotion/react'
import { useGetApr } from '../hook/hookV8/useGetApr'

export const Liquidity = () => {
  const { account, provider, chainId } = useWeb3React()
  const [createLiquidityPool, setCreateLiquidityPool] = useState(false)
  const [addLiquidity, setAddLiquidity] = useState(false)
  const [removeLiquidity, setRemoveLiquidity] = useState(false)
  const [isLoadingUserPosition, setIsLoadingUserPosition] = useState(true)
  const userBackend = useUserPosition()
  const { aprList } = useGetApr()
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  useEffect(() => {
    let backInterval: NodeJS.Timer
    if (allPoolParams.length >= 0 && account && provider) {
      userBackend().then(() => setIsLoadingUserPosition(false))
      backInterval = setInterval(() => {
        userBackend().then()
      }, 10000)
    }
    return () => {
      if (backInterval) clearInterval(backInterval)
    }
  }, [account, allPoolParams, provider, chainId])

  return (
    <>
      <div
        css={[
          liquidity,
          css`
            display: ${createLiquidityPool ? 'none' : ''};
          `,
        ]}
      >
        <AddLiquidity isOpen={addLiquidity} setIsOpen={setAddLiquidity} />
        <RemoveLiquidity isOpen={removeLiquidity} setIsOpen={setRemoveLiquidity} />
        <YourPosition
          setAddLiquidity={setAddLiquidity}
          setRemoveLiquidity={setRemoveLiquidity}
          isLoadingUserPosition={isLoadingUserPosition}
          aprList={aprList}
        />
        <TargetMarket
          setCreateLiquidityPool={setCreateLiquidityPool}
          setAddLiquidity={setAddLiquidity}
          aprList={aprList}
        />
      </div>
      <div
        css={css`
          display: ${!createLiquidityPool ? 'none' : ''};
        `}
      >
        <CreateLiquidity setCreateLiquidityPool={setCreateLiquidityPool} />
      </div>
    </>
  )
}
