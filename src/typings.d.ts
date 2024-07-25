import '@web3-react'

declare global {
  interface Window {
    ethereum?: any
    TradingView?: any
  }
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean
  }
}

declare module '@emotion/react/jsx-runtime' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type ElementType = React.JSX.ElementType
  }
}
