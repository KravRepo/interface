import { useEffect, useState } from 'react'
import { API_BASE } from '../constant/chain'
import { useWeb3React } from '@web3-react/core'
import { useRootStore } from '../store/root'
import { Box } from '@mui/material'
import { MAINNET_CHAINS } from '../connectors/chain'

interface PointListData {
  account: string
  chainId: number
  closeTime: number
  kToken: string
  multiplier: number
  openTime: number
  point: string
  quantoIndex: number
  timestamp: number
  types: 'LPAdd' | 'LPRemove' | 'TradeLong' | 'TradeShort'
  volumeInETH: string
}

interface PointsData {
  account: string
  pointLP: string
  pointTrade: string
}

const getTypes = (str: string) => {
  switch (str) {
    case 'LPAdd':
      return 'LP Add'
    case 'LPRemove':
      return 'LP Remove'
    case 'TradeLong':
      return 'Long'
    case 'TradeShort':
      return 'Short'
    default:
      return ''
  }
}

export function usePointsList() {
  const { account } = useWeb3React()
  const allPoolParams = useRootStore((state) => state.allPoolParams)
  const [pointsList, setPointsList] = useState<null | any[]>(null)

  useEffect(() => {
    if (!account) return
    const getPoints = async () => {
      try {
        const request = await fetch(API_BASE + `/point/record/list?account=${account}&offset=${0}&limit=${10}`, {})
        const points = await request.json()
        if (points.code == 200) {
          const list = points.data.map((data: PointListData) => {
            const pool = allPoolParams[data.quantoIndex]
            const chain = MAINNET_CHAINS[data.chainId as number]
            return [
              <Box key={data.timestamp} display="flex" alignItems={'center'} gap="10px">
                <img src={pool.logoSource} style={{ height: '20px', width: '20px', borderRadius: '50%' }}></img>
                {getTypes(data.types)}$<span>{pool.symbol}</span>
              </Box>,
              new Date(data.timestamp * 1000).toLocaleString(),
              <span key={data.timestamp + data.multiplier}>x{data.multiplier}</span>,
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
              data.point,
              data.closeTime ? new Date(data.closeTime * 1000).toLocaleString() : null,
            ]
          })
          setPointsList(list)
        }
      } catch (e) {}
    }
    getPoints()
  }, [account, allPoolParams])

  return pointsList
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
          setPoints(points.data)
        }
      } catch (e) {}
    }
    getPoints()
  }, [account, allPoolParams])

  return points
}
