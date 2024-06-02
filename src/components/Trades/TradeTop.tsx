import { useRootStore } from '../../store/root'
import { PairInfo } from './TradeLeft/PairInfo'

export default function TradeTop() {
  const { tradeModel, setTradeModel, setIsOpenSelectToken } = useRootStore((state) => ({
    tradeModel: state.tradeModel,
    setTradeModel: state.setTradeModel,
    setIsOpenSelectToken: state.setIsOpenSelectToken,
  }))

  return (
    <div css={[]}>
      {' '}
      <PairInfo tradeModel={tradeModel} setIsOpenSelectToken={setIsOpenSelectToken} setTradeModel={setTradeModel} />
    </div>
  )
}
