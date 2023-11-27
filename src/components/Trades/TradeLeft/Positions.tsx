/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useRootStore } from '../../../store/root'
import { PositionsItem } from './PositionsItem'
import { useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import KRAVButton from '../../KravUIKit/KravButton'

export const Positions = () => {
  const userOpenTradeList = useRootStore((state) => state.userOpenTradeList)
  const setWalletDialogVisibility = useRootStore((state) => state.setWalletDialogVisibility)
  const { account } = useWeb3React()
  const theme = useTheme()
  return (
    <div>
      <div
        className="position-layout"
        css={css`
          color: #617168;
          border-top: ${theme.splitLine.primary};
        `}
      >
        <span>Position</span>
        <span>PnL</span>
        {/* <span>Size</span> */}
        <span>Collateral</span>
        <span>Entry price</span>
        <span>Mark price</span>
        <span>Liq.price</span>
        <span>Take profit</span>
        <span>Close</span>
      </div>
      {userOpenTradeList.length === 0 && account && <div className="no-data">No open position</div>}
      {!account && (
        <div className="no-data">
          <KRAVButton
            onClick={() => setWalletDialogVisibility(true)}
            sx={{ width: '113px', mt: '32px', mb: '25px', zIndex: 3 }}
          >
            Connect Wallet
          </KRAVButton>
        </div>
      )}
      {userOpenTradeList.length > 0 &&
        account &&
        userOpenTradeList.map((openTrade, index) => {
          return <PositionsItem openTrade={openTrade} key={index} index={index} />
        })}
    </div>
  )
}
