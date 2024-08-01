import { useCallback, useState } from 'react'

export const DEFAULT_ERROR_HEADER = `Sorry, an error occured while processing your request. Please try again or contact support.`
export const DEFAULT_ERROR_ACTION = `Reload the page`

export function useAsyncError() {
  const [, setError] = useState<void>()
  return useCallback(
    (error: unknown) =>
      setError(() => {
        // Ignore user rejections - they should not trigger the ErrorBoundary
        if (error instanceof UserRejectedRequestError) return

        if (error instanceof Error) throw error
        throw new Error(error as string)
      }),
    []
  )
}

export class UserRejectedRequestError {
  header: string
  action: string
  name: string
  error: unknown
  dismissable = false
  constructor() {
    this.name = 'UserRejectedRequestError'
    this.header = `Request rejected`
    this.action = `Reload the page`
    this.error = `This error was prompted by denying a request in your wallet.`
  }
}

interface ErrorConfig {
  header?: string
  action?: string
  message?: string
  error?: unknown
}

export class CustomError {
  header: string
  action: string
  error: unknown
  name: string
  dismissable = false
  message: string

  constructor(config: ErrorConfig) {
    this.message = config.message ?? 'error'
    this.header = config.header ?? DEFAULT_ERROR_HEADER
    this.action = config.action ?? DEFAULT_ERROR_ACTION
    this.error = config.error
    this.name = 'WidgetError'
  }
}

abstract class ConnectionError extends CustomError {
  constructor(config: ErrorConfig) {
    super(config)
    this.name = 'ConnectionError'
  }
}

export class MetaMaskConnectionError extends ConnectionError {
  constructor() {
    super({
      header: `Wallet disconnected`,
      action: `Reload`,
      message: `'A Metamask error caused your wallet to disconnect. Reload the page to reconnect.'`,
    })
  }
}
