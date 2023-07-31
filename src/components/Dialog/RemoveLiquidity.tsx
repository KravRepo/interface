/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent, TextField } from '@mui/material'
import { dialogContent } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { css } from '@emotion/react'
import { align } from '../../globalStyle'
import { ReactComponent as BALDIcon } from '../../assets/imgs/tokens/Bald.svg'
import KRAVButton from '../KravUIKit/KravButton'
import { RemoveLiquidityProps } from '../Liquidity/type'
import { useRemoveLiquidity } from 'hook/hookV8/useRemoveLiquidity'
import { useRootStore } from '../../store/root'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { addDecimals, eXDecimals } from '../../utils/math'
import BigNumber from 'bignumber.js'
import { useUserPosition } from '../../hook/hookV8/useUserPosition'
import { useFactory } from '../../hook/hookV8/useFactory'

export const RemoveLiquidity = ({ isOpen, setIsOpen }: RemoveLiquidityProps) => {
  const { provider } = useWeb3React()
  const [withdrawAmount, setWithdrawAmount] = useState<string | number>('')
  const [maxWithdrawAmount, setMaxWithdrawAmount] = useState(0)
  const liquidityInfo = useRootStore((store) => store.liquidityInfo)
  const userPositionDatas = useRootStore((store) => store.userPositionDatas)
  const getUserPosition = useUserPosition()
  const removeLiquidity = useRemoveLiquidity(liquidityInfo.vaultT)
  const updateFactory = useFactory()
  const targetPool = useMemo(() => {
    return userPositionDatas.find((item) => item.pool?.tradingT === liquidityInfo.tradingT)
  }, [liquidityInfo, userPositionDatas])
  const getPoolBalance = useCallback(() => {
    if (Object.keys(liquidityInfo).length > 0 && targetPool) {
      const res = targetPool.maxDaiDeposited.times(liquidityInfo.maxWithdrawP.div(100) ?? 0)
      const lockedAmount = targetPool.daiDeposited.minus(res)
      const maxAmount = eXDecimals(
        lockedAmount.isGreaterThan(0) ? res : targetPool.daiDeposited,
        targetPool.pool.decimals
      ).toNumber()
      setMaxWithdrawAmount(maxAmount)
    }
  }, [provider, liquidityInfo])

  useEffect(() => {
    getPoolBalance()
  }, [provider, liquidityInfo])

  const handleMaxInput = () => {
    setWithdrawAmount(maxWithdrawAmount)
  }

  return (
    <Dialog
      sx={{
        '.MuiDialog-paper': {
          width: '440px',
          borderRadius: '8px',
          background: '#fff',
        },
      }}
      open={isOpen}
    >
      <DialogContent sx={{ padding: 0, color: '#000' }}>
        <div css={dialogContent}>
          <div className="dialog-header ">
            <span>Remove Liquidity</span>
            <CloseSharpIcon
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setWithdrawAmount('')
                setIsOpen(false)
              }}
            />
          </div>
          <div
            css={css`
              padding: 24px;
              border-bottom: 1px solid #f6f6f6;
            `}
          >
            <div className="confirm-content-input3">
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  width: 100%;
                  justify-content: space-between;
                  margin-bottom: 20px;
                `}
              >
                <span>Amount</span>
                <span>
                  Available: {maxWithdrawAmount.toFixed(2)} {liquidityInfo.symbol}
                </span>
              </div>
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  width: 100%;
                  justify-content: space-between;
                `}
              >
                <TextField
                  variant="standard"
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{
                    height: '28px',
                    fontSize: '20px',
                    minHeight: '28px',
                    '& .MuiOutlinedInput-root': {
                      height: '28px',
                      minHeight: '28px',
                      padding: 0,
                    },
                  }}
                />
                <div css={align}>
                  <div
                    css={css`
                      border-radius: 2px;
                      background: #a4a8fe;
                      padding: 2px 6px;
                      font-size: 12px;
                      cursor: pointer;
                    `}
                    onClick={handleMaxInput}
                  >
                    MAX
                  </div>
                  <div css={align}>
                    <span
                      css={css`
                        margin: 0 6px;
                      `}
                    >
                      DAI
                    </span>
                    <BALDIcon height="16" width="16" />
                  </div>
                </div>
              </div>
            </div>
            <KRAVButton
              disabled={
                addDecimals(withdrawAmount.toString(), liquidityInfo.decimals).isGreaterThan(
                  addDecimals(maxWithdrawAmount.toString(), liquidityInfo.decimals)
                ) || !new BigNumber(withdrawAmount).isGreaterThan(0)
              }
              onClick={async () => {
                setIsOpen(false)
                await removeLiquidity(
                  addDecimals(withdrawAmount.toString(), liquidityInfo.decimals),
                  liquidityInfo.symbol,
                  liquidityInfo.decimals
                )
                await Promise.all([updateFactory(), getUserPosition()])
                setWithdrawAmount('')
              }}
              sx={{ mt: '24px' }}
            >
              Remove
            </KRAVButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
