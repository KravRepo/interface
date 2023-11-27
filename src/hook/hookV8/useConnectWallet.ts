import { useCallback } from 'react'
import { Connection } from '../../connectors/type'

export const useConnectWallet = () => {
  return useCallback(async (connection: Connection) => {
    if (connection.overrideActivate?.()) return
    try {
      console.debug(`Connection activating: ${connection.getName()}`)
      await connection.connector.activate()
    } catch (e) {
      console.error(e)
    }
  }, [])
}
