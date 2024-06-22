/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useRootStore } from '../../../store/root'
import { PositionsItem } from './PositionsItem'
import { useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import KRAVButton from '../../KravUIKit/KravButton'
import { t } from '@lingui/macro'

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
        <span>{t`Position`}</span>
        <span>{t`PnL: -90 to +900`}</span>
        {/* <span>Size</span> */}
        <span>{t`Collateral`}</span>
        <span>{t`Entry price`}</span>
        <span>{t`Mark price`}</span>
        <span>{t`Liq.price`}</span>
        {/* <span>Take profit</span> */}
        <span>{t`Close`}</span>
      </div>
      {userOpenTradeList.length === 0 && account && <div className="no-data">{t`No open position`}</div>}
      {!account && (
        <div className="no-data">
          <KRAVButton
            onClick={() => setWalletDialogVisibility(true)}
            sx={{ width: '113px', mt: '32px', mb: '25px', zIndex: 3 }}
          >
            {t`Connect Wallet`}
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
