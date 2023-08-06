/** @jsxImportSource @emotion/react */
// import KARVSearchTextField from '../../components/KravUIKit/KarvSearchTextField'
import KRAVButton from '../KravUIKit/KravButton'
import { TargetMarketProps } from './type'
import { useRootStore } from '../../store/root'
import { MarketItem } from './MarketItem'
import { useWeb3React } from '@web3-react/core'
import { MarketSkeleton } from './MarketSkeleton'
import { Stack, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { useCallback, useMemo, useState } from 'react'

export const TargetMarket = ({ setCreateLiquidityPool, setAddLiquidity, aprList }: TargetMarketProps) => {
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const isLoadingFactory = useRootStore((store) => store.isLoadingFactory)
  const { account } = useWeb3React()
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

  const reorderClick = useCallback((sort: 'asc' | 'desc', way: string) => {
    if (way === 'apr') {
      tableData.sort((a, b) => {
        if (sort === 'asc') {
          return a.apr - b.apr
        } else return b.apr - a.apr
      })
    } else {
      tableData.sort((a, b) => {
        if (sort === 'asc') {
          return a.poolTotalSupply - b.poolTotalSupply
        } else return b.poolTotalSupply - a.poolTotalSupply
      })
    }
  }, [])

  return (
    <div className="liquidity-content">
      <div className="liquidity-tabs">
        <span>Target Market</span>
        <span>{tableData.length > 0 ? ` (${tableData.length})` : ''}</span>
      </div>
      <div className="liquidity-search">
        {/* <KARVSearchTextField placeholder="Search name or paste address" adornment={'start'} sx={{ height: '40px' }} /> */}
        <></>
        {account && (
          <KRAVButton sx={{ width: '132px', marginLeft: 'auto' }} onClick={() => setCreateLiquidityPool(true)}>
            Create Liquidity
          </KRAVButton>
        )}
      </div>
      <div>
        <div className="liquidity-table grey nowrap">
          <div>ASSET</div>
          <div>CONVERSION RATIO</div>
          <Stack direction={'row'} alignItems={'center'}>
            <Typography fontFamily={'Inter'} fontSize={14} sx={{ marginRight: '4px' }}>
              APR
            </Typography>
            <Stack
              sx={{
                width: 16,
                height: 16,
                borderRadius: '4px',
                marginLeft: '0 !important',
                padding: '0 3px',
                justifyContent: 'center',
                backgroundColor: '#f6f6f6',
                '& svg': {
                  cursor: 'pointer',
                  width: 10,
                  height: 9,
                  transform: 'scale(1.8)',
                },
                '& svg:hover path': {
                  fill: '#000',
                },
              }}
            >
              <ArrowDropUpIcon
                sx={{
                  '& path': {
                    fill: aprAsc ? '#000' : '#757575',
                  },
                }}
                onClick={() => {
                  setAprAsc(true)
                  reorderClick('asc', 'apr')
                }}
              />
              <ArrowDropDownIcon
                sx={{
                  '& path': {
                    fill: aprAsc ? '#757575' : '#000',
                  },
                }}
                onClick={() => {
                  setAprAsc(false)
                  reorderClick('desc', 'apr')
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
              sx={{
                width: 16,
                height: 16,
                borderRadius: '4px',
                marginLeft: '0 !important',
                padding: '0 3px',
                justifyContent: 'center',
                backgroundColor: '#f6f6f6',
                '& svg': {
                  cursor: 'pointer',
                  width: 10,
                  height: 9,
                  transform: 'scale(1.8)',
                },
                '& svg:hover path': {
                  fill: '#000',
                },
              }}
            >
              <ArrowDropUpIcon
                sx={{
                  '& path': {
                    fill: totalAsc ? '#000' : '#757575',
                  },
                }}
                onClick={() => {
                  setTotalAsc(true)
                  reorderClick('asc', 'total')
                }}
              />
              <ArrowDropDownIcon
                sx={{
                  '& path': {
                    fill: totalAsc ? '#757575' : '#000',
                  },
                }}
                onClick={() => {
                  setTotalAsc(false)
                  reorderClick('desc', 'total')
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
    </div>
  )
}
