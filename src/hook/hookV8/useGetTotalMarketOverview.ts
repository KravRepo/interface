import { useCallback, useState } from 'react'
import { DASHBOARD_OVERVIEW_API } from '../../constant/chain'
import { API_DECIMALS } from '../../constant/math'

export type OverviewData = {
  liquiditySupply: number
  orderPlacement: number
  tradingVolume: number
  tradingFrequency: number
  tradingVolume24H: number
}
export const useGetTotalMarketOverview = () => {
  const [overviewData, setOverViewData] = useState<OverviewData>({} as OverviewData)
  const getOverView = useCallback(async () => {
    try {
      const req = await fetch(DASHBOARD_OVERVIEW_API)
      const overview = await req.json()
      setOverViewData({
        liquiditySupply: Number(overview.data.liquiditySupply) / API_DECIMALS,
        orderPlacement: Number(overview.data.orderPlacement) / API_DECIMALS,
        tradingFrequency: overview.data.tradingFrequency,
        tradingVolume: Number(overview.data.tradingVolume) / API_DECIMALS,
        tradingVolume24H: Number(overview.data.tradingVolume24H) / API_DECIMALS,
      })
    } catch (e) {
      console.error('get overview failed!', e)
    }
  }, [])
  return { getOverView: getOverView, overviewData: overviewData }
}
