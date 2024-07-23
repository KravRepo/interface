import { useEffect, useState } from 'react'
import { API_BASE } from '../constant/chain'
import { useWeb3React } from '@web3-react/core'
import { useRootStore } from '../store/root'
import { Box, Skeleton } from '@mui/material'
import { MAINNET_CHAINS } from '../connectors/chain'
import { ReactComponent as Parachute } from '../assets/points/parashute.svg'

export interface PointListData {
  account: string
  chainId: number
  closeTime: number
  kToken: string
  multiplier: number
  openTime: number
  point: string
  quantoIndex: number
  timestamp: number
  types: 'LPAdd' | 'LPRemove' | 'TradeLong' | 'TradeShort' | 'Invite' | 'InviteTrade' | 'InviteLP'
  volumeInETH: string
  leverageMultiplier: number
}

interface PointsData {
  account: string
  pointLP: string
  pointTrade: string
  pools: { [key: number]: PointsPools }
}

export interface PointsPoolsRaw {
  chainId: number
  point: string
  quantoIndex: number
  types: string
}

export interface PointsPools {
  chainId: number
  point: string
  quantoIndex: number
  LPAdd?: string
  TradeLong?: string
  TradeShort?: string
  Invite?: string
  InviteTrade?: string
  InviteLP?: string
}

export const getTypes = (str: string) => {
  switch (str) {
    case 'LPAdd':
      return 'LP Provide'
    case 'LPRemove':
      return 'LP Remove'
    case 'TradeLong':
      return 'Long'
    case 'TradeShort':
      return 'Short'
    case 'Invite':
      return 'Referral'
    case 'InviteTrade':
      return 'Trade'
    case 'InviteLP':
      return 'LP Provide'
    default:
      return ''
  }
}

export const PAGE_SIZE = 10

export const PARTNER_SYMBOL_LIST: string[] = ['0x04D5ddf5f3a8939889F11E97f8c4BB48317F1938']

export function usePointsList(curPage: number) {
  const { account } = useWeb3React()
  const allPoolParams = useRootStore((state) => state.allPoolParams)
  const [pointsList, setPointsList] = useState<null | any[]>(null)
  const [pageTotal, setPageTotal] = useState(0)

  useEffect(() => {
    if (!account) return
    const getPoints = async () => {
      try {
        const request = await fetch(
          API_BASE + `/point/record/list?account=${account}&offset=${(curPage - 1) * PAGE_SIZE}&limit=${PAGE_SIZE}`,
          {}
        )
        const points = await request.json()

        if (points.code == 200) {
          const list = points.data.map((data: PointListData) => {
            const pool = allPoolParams[data.quantoIndex]
            const chain = MAINNET_CHAINS[data.chainId as number]
            // const isPartner = PARTNER_SYMBOL_LIST.includes(pool.tokenT)
            const isLiquidated = !!data.closeTime
            return [
              data.types,
              pool ? (
                <Box key={data.timestamp} display="flex" alignItems={'center'} gap="10px">
                  <img src={pool.logoSource} style={{ height: '20px', width: '20px', borderRadius: '50%' }}></img>
                  {getTypes(data.types)}
                  <span>${pool.symbol}</span>
                </Box>
              ) : (
                <Skeleton variant="rectangular" width={'100%'} height={'20px'} />
              ),
              new Date(data.timestamp * 1000).toLocaleString(),
              <div key={data.timestamp + data.multiplier}>
                <>
                  <span
                    style={{
                      color: isLiquidated ? '#E4AF53' : '#ffffff',
                    }}
                  >
                    x{data.multiplier}
                  </span>
                  {isLiquidated && <Parachute style={{ height: '18px', width: '18px' }} />}
                </>
              </div>,
              <div key={data.timestamp + data.leverageMultiplier}>
                {data.leverageMultiplier ? (
                  <>
                    <span>x{data.leverageMultiplier}</span>
                  </>
                ) : (
                  '-'
                )}
              </div>,
              data.volumeInETH,
              chain ? (
                <Box display={'flex'} alignItems={'center'} gap={'10px'}>
                  <Box
                    height={'20px'}
                    width="20px"
                    sx={{
                      borderRadius: '50%',
                      overflow: 'hidden',
                      '& svg': {
                        height: '100%',
                        width: '100%',
                      },
                    }}
                  >
                    {chain.logo}
                  </Box>

                  {chain.name}
                </Box>
              ) : null,
              data.point + ` ${data.types.includes('LP') ? 'C' : 'R'}`,
            ]
          })
          setPointsList(list)
          setPageTotal(Math.ceil(points.total / points.limit))
        }
      } catch (e) {
        console.error(e)
        setPointsList([])
      }
    }
    getPoints()
  }, [account, allPoolParams, curPage])

  return { pointsList, pageTotal }
}

export function usePoints() {
  const { account } = useWeb3React()
  const allPoolParams = useRootStore((state) => state.allPoolParams)
  const [points, setPoints] = useState<null | PointsData>(null)

  useEffect(() => {
    if (!account) return
    const getPoints = async () => {
      try {
        const request = await fetch(API_BASE + `/point/${account}`, {})
        const points = await request.json()
        if (points.code == 200) {
          const list = (points.data.pools as PointsPoolsRaw[])?.reduce((acc, i, idx) => {
            if (acc[i.quantoIndex]) {
              acc[i.quantoIndex][i.types] = i.point
            } else {
              acc[i.quantoIndex] = { ...i }
              acc[i.quantoIndex][i.types] = i.point
            }
            return acc
          }, {} as any)
          setPoints({ ...points.data, pools: list })
        }
      } catch (e) {}
    }
    getPoints()
  }, [account, allPoolParams])

  return points
}
