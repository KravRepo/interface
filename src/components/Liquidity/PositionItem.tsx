/** @jsxImportSource @emotion/react */
import { align } from '../../globalStyle'
import { ReactComponent as DAIIcon } from '../../assets/imgs/tokens/dai.svg'
import { css } from '@emotion/react'
import { Button } from '@mui/material'
import { ReactComponent as AddIcon } from '../../assets/imgs/addIcon.svg'
import { ReactComponent as SubIcon } from '../../assets/imgs/subIcon.svg'
import { PositionItemProps } from './type'
import { useRootStore } from '../../store/root'

export const PositionItem = ({ position, setAddLiquidity, setRemoveLiquidity }: PositionItemProps) => {
  const setLiquidityInfo = useRootStore((store) => store.setLiquidityInfo)
  return (
    <div className="liquidity-table">
      <div css={align}>
        <DAIIcon height="40" width="40" />
        <div
          css={css`
            margin-left: 8px;
          `}
        >
          <p>{position.pool.symbol}</p>
          <p className="small grey">{position.pool.symbol}</p>
        </div>
      </div>
      <div>
        1 BTC={position.pool.proportionBTC} {position.pool.symbol}
      </div>
      <div>12.32%</div>
      <div>{position.pool.utilization.toFixed(2)}%</div>
      <div>
        <p>
          {position.pool.poolTotalSupply?.toFixed(2)} {position.pool.symbol}
        </p>
        <p className="small grey">($236,123.00)</p>
      </div>
      <div>2,000.00 DOGE</div>
      <div>2,000.00 DOGE</div>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: end;
        `}
      >
        <Button
          onClick={() => {
            setLiquidityInfo(position.pool)
            setAddLiquidity(true)
          }}
          sx={{ height: '32px', width: '32px', minWidth: '32px', border: '1px solid #2E2E2E', margin: '12px' }}
        >
          <AddIcon height="17" width="17" />
        </Button>
        <Button
          onClick={() => {
            setLiquidityInfo(position.pool)
            setRemoveLiquidity(true)
          }}
          sx={{ height: '32px', width: '32px', minWidth: '32px', border: '1px solid #2E2E2E' }}
        >
          <SubIcon height="17" width="17" />
        </Button>
      </div>
    </div>
  )
}
