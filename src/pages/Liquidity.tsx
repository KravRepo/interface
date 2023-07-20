/** @jsxImportSource @emotion/react */
import { liquidity } from 'components/Liquidity/style'
import { TargetMarket } from '../components/Liquidity/TargetMarket'
import { YourPosition } from '../components/Liquidity/YourPosition'
import { useEffect, useState } from 'react'
import { CreateLiquidity } from '../components/Liquidity/CreateLiquidity'
import { RemoveLiquidity } from '../components/Dialog/RemoveLiquidity'
import { AddLiquidity } from '../components/Dialog/AddLiquidity'
import { useRootStore } from 'store/root'
import { useUserPosition } from '../hook/hookV8/useUserPosition'
import { useWeb3React } from '@web3-react/core'

export const Liquidity = () => {
  const { account, provider } = useWeb3React()
  const [createLiquidityPool, setCreateLiquidityPool] = useState(false)
  const [addLiquidity, setAddLiquidity] = useState(false)
  const [removeLiquidity, setRemoveLiquidity] = useState(false)
  const userBackend = useUserPosition()
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  useEffect(() => {
    let backInterval: NodeJS.Timer
    if (allPoolParams.length > 0 && account && provider) {
      backInterval = setInterval(() => {
        userBackend().then()
      }, 10000)
    }
    return () => {
      if (backInterval) clearInterval(backInterval)
    }
  }, [account, allPoolParams, provider])

  return (
    <>
      {!createLiquidityPool && (
        <div css={liquidity}>
          <AddLiquidity isOpen={addLiquidity} setIsOpen={setAddLiquidity} />
          <RemoveLiquidity isOpen={removeLiquidity} setIsOpen={setRemoveLiquidity} />
          <YourPosition setAddLiquidity={setAddLiquidity} setRemoveLiquidity={setRemoveLiquidity} />
          <TargetMarket setCreateLiquidityPool={setCreateLiquidityPool} setAddLiquidity={setAddLiquidity} />
        </div>
      )}
      {createLiquidityPool && <CreateLiquidity setCreateLiquidityPool={setCreateLiquidityPool} />}
    </>
  )
}
