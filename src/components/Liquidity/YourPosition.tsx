/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { YourPositionProps } from './type'
import { PositionItem } from './PositionItem'
import { useRootStore } from '../../store/root'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { MarketSkeleton } from './MarketSkeleton'
import { useTheme } from '@mui/material'
import { PositionItemCard } from './PositionItemCard'

export const YourPosition = ({
  setAddLiquidity,
  setRemoveLiquidity,
  isLoadingUserPosition,
  aprList,
  isTable,
}: YourPositionProps) => {
  const { account } = useWeb3React()
  const theme = useTheme()
  const userPositionDatas = useRootStore((store) => store.userPositionDatas)

  const positionDatas = useMemo(() => {
    let flag = false
    userPositionDatas.find((positionData) => {
      if (positionData?.hasPosition) flag = true
    })
    if (flag) return userPositionDatas.filter((position) => position.hasPosition)
    else return []
  }, [userPositionDatas])

  return (
    <div
      className="liquidity-content"
      css={css`
        background: ${theme.background.primary};
        color: ${theme.text.primary};
      `}
    >
      <div
        className="liquidity-tabs"
        css={css`
          border-bottom: ${theme.splitLine.primary};
          @media screen and (max-width: 1200px) {
            min-width: 1200px;
          }
        `}
      >
        <span>Your positions</span>
        <span>{positionDatas.length > 0 ? ` (${positionDatas.length})` : ''}</span>
      </div>
      {isTable && (
        <div>
          <div
            className="liquidity-table grey nowrap"
            css={css`
              margin-top: 24px;
            `}
          >
            <div>ASSET</div>
            {/*<div>PER TICKET PRICE</div>*/}
            <div>APR</div>
            <div>UTILIZATION</div>
            <div>YOUR LIQUIDITY SUPPLY</div>
            <div>REMOVE LIMIT</div>
            <div>WITHDRAW_BLOCK</div>
          </div>
          {!account && <div className="no-data">Connect to a wallet to view your positions.</div>}
          {account && isLoadingUserPosition && positionDatas.length === 0 && <MarketSkeleton />}
          {account && !isLoadingUserPosition && positionDatas.length === 0 && (
            <div className="no-data">No Position yet</div>
          )}
          {account &&
            positionDatas.length > 0 &&
            positionDatas.map((position, index) => {
              return (
                <PositionItem
                  key={position.pool?.tradingT + index}
                  position={position}
                  setAddLiquidity={setAddLiquidity}
                  setRemoveLiquidity={setRemoveLiquidity}
                  aprList={aprList}
                />
              )
            })}
        </div>
      )}
      {!isTable && (
        <div
          className={positionDatas.length > 0 ? 'liquidity-card-layout' : ''}
          css={css`
            margin-top: 72px !important;
          `}
        >
          {!account && <div className="no-data">Connect to a wallet to view your positions.</div>}
          {account && isLoadingUserPosition && positionDatas.length === 0 && <MarketSkeleton />}
          {account && !isLoadingUserPosition && positionDatas.length === 0 && (
            <div className="no-data">No Position yet</div>
          )}
          {account &&
            positionDatas.length > 0 &&
            positionDatas.map((position, index) => {
              return (
                <PositionItemCard
                  key={position.pool?.tradingT + index}
                  position={position}
                  setAddLiquidity={setAddLiquidity}
                  setRemoveLiquidity={setRemoveLiquidity}
                  aprList={aprList}
                />
              )
            })}
        </div>
      )}
    </div>
  )
}
