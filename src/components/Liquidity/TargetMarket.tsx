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
      console.log(sort, way)

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

  console.log('tableData', tableData)

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
              />
              <ArrowDropDownIcon
                sx={{
                  '& path': {
                    fill: aprAsc ? '#757575' : '#000',
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
              />
              <ArrowDropDownIcon
                sx={{
                  '& path': {
                    fill: totalAsc ? '#757575' : '#000',
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
    </div>
  )
}
