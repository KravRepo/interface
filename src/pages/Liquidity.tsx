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
import { css } from '@emotion/react'
import { useGetApr } from '../hook/hookV8/useGetApr'
import { ReactComponent as CardIcon } from '../assets/imgs/card_mode_icon.svg'
import { ReactComponent as TableIcon } from '../assets/imgs/table_mode_icon.svg'
import { useTheme } from '@mui/material'
import { useParams } from 'react-router-dom'

export const Liquidity = () => {
  // const { account, provider, chainId } = useWeb3React()
  const theme = useTheme()
  const [createLiquidityPool, setCreateLiquidityPool] = useState(false)
  const [selectedPool, setSelectedPool] = useState('')
  const [addLiquidity, setAddLiquidity] = useState(false)
  const [removeLiquidity, setRemoveLiquidity] = useState(false)
  // const [isLoadingUserPosition, setIsLoadingUserPosition] = useState(false)
  const [isTable, setIsTable] = useState(false)
  const { isLoading: isLoadingUserPosition } = useUserPosition()
  const { aprList } = useGetApr()
  const { token: tokenSymbol } = useParams()
  const pools = useRootStore((state) => state.allPoolParams)

  // const allPoolParams = useRootStore((store) => store.allPoolParams)
  // useInterval(userBackend, 15000)

  // useEffect(() => {
  //   if (allPoolParams.length >= 0 && account && provider) {
  //     userBackend().then(() => setIsLoadingUserPosition(false))
  //   }
  // }, [account, allPoolParams, provider, chainId])

  useEffect(() => {
    if (tokenSymbol) {
      const pool = pools.find((p) => p.symbol.toLocaleLowerCase() === tokenSymbol.toLocaleLowerCase())
      if (pool) {
        setSelectedPool(pool.symbol)
      }
    }
  }, [pools, tokenSymbol])

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
        <div
          css={css`
            width: 100%;
            display: flex;
            padding: 16px 32px 12px 32px;
            align-items: flex-start;
            background: ${theme.background.primary};
            margin-bottom: 12px;
            border-radius: 8px;
          `}
        >
          <div
            css={css`
              cursor: pointer;
              margin-right: 12px;
              > svg {
                > rect {
                  fill: ${!isTable
                    ? theme.palette.mode === 'light'
                      ? '#757575'
                      : '#dadada'
                    : theme.palette.mode === 'light'
                    ? '#dadada'
                    : '#757575'};
                }
              }
            `}
          >
            <CardIcon onClick={() => setIsTable(false)} />
          </div>
          <div
            css={css`
              cursor: pointer;
              > svg {
                > path {
                  fill: ${isTable
                    ? theme.palette.mode === 'light'
                      ? '#757575'
                      : '#dadada'
                    : theme.palette.mode === 'light'
                    ? '#dadada'
                    : '#757575'};
                }
              }
            `}
          >
            <TableIcon
              css={css`
                cursor: pointer;
              `}
              onClick={() => setIsTable(true)}
            />
          </div>
        </div>
        <YourPosition
          setAddLiquidity={setAddLiquidity}
          setRemoveLiquidity={setRemoveLiquidity}
          isLoadingUserPosition={isLoadingUserPosition}
          aprList={aprList}
          isTable={isTable}
          selectedPool={selectedPool}
        />
        <TargetMarket
          setCreateLiquidityPool={setCreateLiquidityPool}
          setAddLiquidity={setAddLiquidity}
          setRemoveLiquidity={setRemoveLiquidity}
          aprList={aprList}
          isTable={isTable}
          selectedPool={selectedPool}
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
