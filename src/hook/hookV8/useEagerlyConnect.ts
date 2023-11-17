import { useEffect } from 'react'
import { Connector } from '@web3-react/types'
import { injectedConnection } from '../../connectors'

async function connect(connector: Connector) {
  try {
    if (connector.connectEagerly) {
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
    connect(injectedConnection.connector)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
