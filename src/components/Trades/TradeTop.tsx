import { useCallback, useEffect } from 'react'
import { useRootStore } from '../../store/root'
import { PairInfo } from './TradeLeft/PairInfo'
import { TradeMode } from '../../store/TradeSlice'

export default function TradeTop() {
  const { tradeModel, setTradeModel, setIsOpenSelectToken } = useRootStore((state) => ({
    tradeModel: state.tradeModel,
    setTradeModel: state.setTradeModel,
    setIsOpenSelectToken: state.setIsOpenSelectToken,
  }))

  useEffect(() => {
    const tm = localStorage?.getItem('krav-trade-model')
    if (tm === 'DEGEN') {
      setTradeModel(TradeMode.DEGEN)
    } else if (tm === 'PRO') {
      setTradeModel(TradeMode.PRO)
    } else {
      setTradeModel(TradeMode.BASIC)
    }
  }, [setTradeModel])

  const setTM = useCallback(
    (tradeModel: TradeMode) => {
      setTradeModel(tradeModel)
      localStorage?.setItem(
        'krav-trade-model',
        tradeModel === TradeMode.DEGEN ? 'DEGEN' : tradeModel === TradeMode.PRO ? 'PRO' : 'BASIC'
      )
    },
    [setTradeModel]
  )

  return (
    <div css={[]}>
      {' '}
      <PairInfo tradeModel={tradeModel} setIsOpenSelectToken={setIsOpenSelectToken} setTradeModel={setTM} />
    </div>
  )
}
