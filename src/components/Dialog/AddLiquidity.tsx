/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent, TextField } from '@mui/material'
import { dialogContent } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { css } from '@emotion/react'
import { align } from '../../globalStyle'
import KRAVButton from '../KravUIKit/KravButton'
import { AddLiquidityProps } from '../Liquidity/type'
import { useRootStore } from '../../store/root'
import { useMemo, useState } from 'react'
import { useAddLiquidity } from 'hook/hookV8/useAddLiquidity'
import { addDecimals } from '../../utils/math'
import { useUserPosition } from '../../hook/hookV8/useUserPosition'
import BigNumber from 'bignumber.js'
import { useFactory } from '../../hook/hookV8/useFactory'

export const AddLiquidity = ({ isOpen, setIsOpen }: AddLiquidityProps) => {
  const liquidityInfo = useRootStore((store) => store.liquidityInfo)
  const userPositionDatas = useRootStore((store) => store.userPositionDatas)
  const addLiquidity = useAddLiquidity(liquidityInfo.tokenT)
  const getFactory = useFactory()
  const getUserPosition = useUserPosition()
  const [amount, setAmount] = useState<string | number>('')
  const PoolWalletBalance = useMemo(() => {
    return (
      userPositionDatas.find((item) => item?.pool?.tradingT === liquidityInfo.tradingT)?.walletBalance ??
      new BigNumber(0)
    )
  }, [liquidityInfo, userPositionDatas])
  const handleMaxInput = () => {
    setAmount(PoolWalletBalance.toNumber())
  }

  return (
    <Dialog
      sx={{
        '.MuiDialog-paper': {
          width: '440px',
          borderRadius: '8px',
          background: '#fff',
          // backgroundColor: theme.palette.mode === 'dark' ? '#1B1E24' : '',
        },
      }}
      open={isOpen}
    >
      <DialogContent sx={{ padding: 0, color: '#000' }}>
        <div css={dialogContent}>
          <div className="dialog-header ">
            <span>Add Liquidity</span>
            <CloseSharpIcon
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setAmount('')
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
                <span>Pay</span>
                <span>
                  Available:{PoolWalletBalance.toFixed(4)} {liquidityInfo.symbol}
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
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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
                      {liquidityInfo.symbol}
                    </span>
                    <img src={liquidityInfo.logoSource} height="16" width="16" />
                  </div>
                </div>
              </div>
            </div>
            <KRAVButton
              disabled={
                new BigNumber(amount.toString()).isGreaterThan(PoolWalletBalance) ||
                !new BigNumber(amount).isGreaterThan(0)
              }
              onClick={async () => {
                setIsOpen(false)
                setAmount('')
                await addLiquidity(
                  addDecimals(amount.toString(), liquidityInfo.decimals),
                  liquidityInfo.vaultT,
                  liquidityInfo.symbol,
                  liquidityInfo.decimals
                )
                await Promise.all([getFactory(), getUserPosition()])
              }}
              sx={{ mt: '24px' }}
            >
              Add
            </KRAVButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
