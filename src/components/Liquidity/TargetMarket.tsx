/** @jsxImportSource @emotion/react */
// import KARVSearchTextField from '../../components/KravUIKit/KarvSearchTextField'
import KRAVButton from '../KravUIKit/KravButton'
import { TargetMarketProps } from './type'
import { useRootStore } from '../../store/root'
// import { MarketItem } from './MarketItem'
import { useWeb3React } from '@web3-react/core'
import { MarketSkeleton } from './MarketSkeleton'
import { Stack, Typography, useTheme } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { useCallback, useMemo, useState } from 'react'
import { css } from '@emotion/react'
import { MarketItemCard } from './MarketItemCard'
import { MarketItem } from './MarketItem'

export const TargetMarket = ({ setCreateLiquidityPool, setAddLiquidity, aprList, isTable }: TargetMarketProps) => {
  const theme = useTheme()
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const isLoadingFactory = useRootStore((store) => store.isLoadingFactory)
  const { account } = useWeb3React()
  const [aprSortBy, setAprSortBy] = useState<'asc' | 'desc'>('asc')
  const [totalSortBy, setTotalSortBy] = useState<'asc' | 'desc'>('asc')
  const [aprAsc, setAprAsc] = useState<boolean>(false)
  const [totalAsc, setTotalAsc] = useState<boolean>(false)

  const tableData = useMemo(() => {
    if (!aprList || !allPoolParams) return []
    const res = allPoolParams.map((item: any, index: number) => {
      return {
        ...item,
        apr: aprList[index]?.apr.toFixed(2),
      }
    })
    return res
  }, [allPoolParams, aprList])

  const reorderClick = useCallback(
    (sort: 'asc' | 'desc', way: string) => {
      if (way === 'apr') {
        tableData.sort((a, b) => {
          if (sort === 'asc') {
            return Number(a.apr) - Number(b.apr)
          } else return Number(b.apr) - Number(a.apr)
        })
      } else {
        tableData.sort((a, b) => {
          if (sort === 'asc') {
            return Number(a.poolTotalSupply) - Number(b.poolTotalSupply)
          } else return Number(b.poolTotalSupply) - Number(a.poolTotalSupply)
        })
      }
    },
    [tableData]
  )

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
        <span>Target Market</span>
        <span>{tableData.length > 0 ? ` (${tableData.length})` : ''}</span>
      </div>
      <div className="liquidity-search">
        {/* <KARVSearchTextField placeholder="Search name or paste address" adornment={'start'} sx={{ height: '40px' }} /> */}
        {account && (
          <KRAVButton
            sx={{ width: '132px', marginLeft: '20px', display: 'flex' }}
            onClick={() => setCreateLiquidityPool(true)}
          >
            Create Liquidity
          </KRAVButton>
        )}
      </div>
      {isTable && (
        <div>
          <div className="liquidity-table grey nowrap">
            <div>ASSET</div>
            <Stack direction={'row'} alignItems={'center'}>
              <Typography fontFamily={'Inter'} fontSize={14} sx={{ marginRight: '4px' }}>
                APR
              </Typography>
              <Stack
                onClick={() => {
                  setAprSortBy(aprSortBy === 'asc' ? 'desc' : 'asc')
                  setAprAsc(!aprAsc)
                  reorderClick(aprSortBy !== 'asc' ? 'desc' : 'asc', 'apr')
                }}
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '4px',
                  marginLeft: '0 !important',
                  padding: theme.palette.mode === 'dark' ? '0 3px 0 2px' : '0 3px',
                  justifyContent: 'center',
                  border: theme.palette.mode === 'dark' ? '1px solid #4B4B4B' : '',
                  backgroundColor: theme.palette.mode === 'dark' ? '#1c1e23' : '#f6f6f6',
                  '& svg': {
                    cursor: 'pointer',
                    width: 10,
                    height: 9,
                    transform: 'scale(1.8)',
                  },
                  '& svg:hover path': {
                    fill: theme.palette.mode === 'dark' ? '#fff' : '#000',
                  },
                }}
              >
                <ArrowDropUpIcon
                  sx={{
                    '& path': {
                      fill: totalAsc
                        ? theme.palette.mode === 'dark'
                          ? '#fff'
                          : '#000'
                        : theme.palette.mode === 'dark'
                        ? '#4B4B4B'
                        : '#757575',
                    },
                  }}
                />
                <ArrowDropDownIcon
                  sx={{
                    '& path': {
                      fill: totalAsc
                        ? theme.palette.mode === 'dark'
                          ? '#4B4B4B'
                          : '#757575'
                        : theme.palette.mode === 'dark'
                        ? '#fff'
                        : '#000',
                    },
                  }}
                />
              </Stack>
            </Stack>
            <div>UTILIZATION</div>
            <Stack direction={'row'} alignItems={'center'}>
              <Typography fontFamily={'Inter'} fontSize={14} sx={{ marginRight: '4px' }}>
                TOTAL LIQUIDITY SUPPLY
              </Typography>
              <Stack
                onClick={() => {
                  setTotalSortBy(totalSortBy === 'asc' ? 'desc' : 'asc')
                  setTotalAsc(!totalAsc)
                  reorderClick(totalSortBy === 'asc' ? 'desc' : 'asc', 'total')
                }}
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '4px',
                  marginLeft: '0 !important',
                  padding: theme.palette.mode === 'dark' ? '0 3px 0 2px' : '0 3px',
                  justifyContent: 'center',
                  border: theme.palette.mode === 'dark' ? '1px solid #4B4B4B' : '',
                  backgroundColor: theme.palette.mode === 'dark' ? '#1c1e23' : '#f6f6f6',
                  '& svg': {
                    cursor: 'pointer',
                    width: 10,
                    height: 9,
                    transform: 'scale(1.8)',
                  },
                  '& svg:hover path': {
                    fill: theme.palette.mode === 'dark' ? '#fff' : '#000',
                  },
                }}
              >
                <ArrowDropUpIcon
                  sx={{
                    '& path': {
                      fill: totalAsc
                        ? theme.palette.mode === 'dark'
                          ? '#fff'
                          : '#000'
                        : theme.palette.mode === 'dark'
                        ? '#4B4B4B'
                        : '#757575',
                    },
                  }}
                />
                <ArrowDropDownIcon
                  sx={{
                    '& path': {
                      fill: totalAsc
                        ? theme.palette.mode === 'dark'
                          ? '#4B4B4B'
                          : '#757575'
                        : theme.palette.mode === 'dark'
                        ? '#fff'
                        : '#000',
                    },
                  }}
                />
              </Stack>
            </Stack>
            <div>YOUR LIQUIDITY SUPPLY</div>
            <div>LP REWARD</div>
          </div>
          {isLoadingFactory &&
            [...Array(3).keys()].map((i) => {
              return <MarketSkeleton key={'Skeleton_' + String(i)} />
            })}
          {!isLoadingFactory &&
            tableData.length > 0 &&
            tableData.map((pool, index) => {
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
      )}
      {!isTable && (
        <div className="liquidity-card-layout">
          {tableData.length > 0 &&
            tableData.map((pool, index) => {
              return (
                <MarketItemCard
                  key={pool.tradingT + index}
                  setAddLiquidity={setAddLiquidity}
                  poolParams={pool}
                  aprList={aprList}
                />
              )
            })}
        </div>
      )}
    </div>
  )
}
