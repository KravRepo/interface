import { useEffect } from 'react'
import { Connector } from '@web3-react/types'
import { /*injectedConnection,*/ walletConnectConnection } from '../../connectors'

async function connect(connector: Connector) {
  try {
    if (connector.connectEagerly) {
      console.log(111, connector)
      await connector.connectEagerly()
    } else {
      await connector.activate()
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`)
  }
}

export default function useEagerlyConnect() {
  useEffect(() => {
    connect(walletConnectConnection.connector)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
