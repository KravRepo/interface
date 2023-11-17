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
import { useInterval } from '../hook/hookV8/useInterval'
import { ReactComponent as CardIcon } from '../assets/imgs/card_mode_icon.svg'
import { ReactComponent as TableIcon } from '../assets/imgs/table_mode_icon.svg'
import { useTheme } from '@mui/material'

export const Liquidity = () => {
  const { account, provider, chainId } = useWeb3React()
  const theme = useTheme()
  const [createLiquidityPool, setCreateLiquidityPool] = useState(false)
  const [addLiquidity, setAddLiquidity] = useState(false)
  const [removeLiquidity, setRemoveLiquidity] = useState(false)
  const [isLoadingUserPosition, setIsLoadingUserPosition] = useState(true)
  const [isTable, setIsTable] = useState(false)
  const userBackend = useUserPosition()
  const { aprList } = useGetApr()
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  useInterval(userBackend, 15000)
  useEffect(() => {
    if (allPoolParams.length >= 0 && account && provider) {
      userBackend().then(() => setIsLoadingUserPosition(false))
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
        />
        <TargetMarket
          setCreateLiquidityPool={setCreateLiquidityPool}
          setAddLiquidity={setAddLiquidity}
          aprList={aprList}
          isTable={isTable}
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
