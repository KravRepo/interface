import { createMulticall } from '@uniswap/redux-multicall'

import { SUPPORT_NETWORK_CHAIN_IDS, ChainId as SupportedChainId } from '../constant/chain'
import useBlockNumber from '../hook/useBlockNumber'
import { useInterfaceMulticall } from '../hook/hookV8/useContract'

const multicall = createMulticall()

export default multicall

export function MulticallUpdaterSingle({ chainId }: { chainId: SupportedChainId }) {
  const latestBlockNumber = useBlockNumber()
  const contract = useInterfaceMulticall()
  return <multicall.Updater chainId={chainId} latestBlockNumber={latestBlockNumber} contract={contract} />
}

export function MulticallUpdater() {
  return (
    <>
      {SUPPORT_NETWORK_CHAIN_IDS.map((chainId: any) => (
        <MulticallUpdaterSingle key={chainId} chainId={chainId}></MulticallUpdaterSingle>
      ))}
    </>
  )
}
