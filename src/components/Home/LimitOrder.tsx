/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LimitOrderItem } from './LimitOrderItem'
import { useRootStore } from '../../store/root'
import { t } from '@lingui/macro'

export const LimitOrder = () => {
  const userAllOpenLimitList = useRootStore((store) => store.userAllOpenLimitList)

  return (
    <div>
      <div
        className="order-layout"
        css={css`
          color: #617168;
        `}
      >
        <span>{t`Type`}</span>
        <span>{t`Order`}</span>
        <span>{t`pair`}</span>
        <span>{t`Ask Price`}</span>
        <span>{t`Leverage`}</span>
        <span>{t`Collateral`}</span>
        <div>{t`Action`}</div>
      </div>
      {userAllOpenLimitList.length === 0 && <div className="no-data">No open position</div>}
      {userAllOpenLimitList.length > 0 &&
        userAllOpenLimitList.map((limitOrder, index) => {
          return limitOrder.tuple.map((limit, limitIndex) => {
            return (
              <LimitOrderItem
                limit={limit}
                pool={limitOrder.pool}
                key={limitOrder.pool.tradingT + index + limitIndex}
              />
            )
          })
        })}
    </div>
  )
}
