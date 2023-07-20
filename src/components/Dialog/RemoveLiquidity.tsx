/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent, TextField } from '@mui/material'
import { dialogContent } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { css } from '@emotion/react'
import { align } from '../../globalStyle'
import { ReactComponent as DAIIcon } from '../../assets/imgs/tokens/dai.svg'
import KRAVButton from '../KravUIKit/KravButton'
import { RemoveLiquidityProps } from '../Liquidity/type'
import { useRemoveLiquidity } from 'hook/hookV8/useRemoveLiquidity'
import { useRootStore } from '../../store/root'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useTradingVaultContract } from '../../hook/hookV8/useContract'
import { addDecimals } from '../../utils/math'
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
  const vaultContract = useTradingVaultContract(liquidityInfo.vaultT)
  const removeLiquidity = useRemoveLiquidity(liquidityInfo.vaultT)
  const updateFactory = useFactory()
  const PoolWalletBalance = useMemo(() => {
    return (
      userPositionDatas.find((item) => item.pool?.tradingT === liquidityInfo.tradingT)?.walletBalance ??
      new BigNumber(0)
    )
  }, [liquidityInfo, userPositionDatas])
  const getPoolBalance = useCallback(async () => {
    if (vaultContract) {
      const maxWithdrawP = await vaultContract.maxWithdrawP()
      const res = PoolWalletBalance.times(new BigNumber(maxWithdrawP._hex).div(100)).toNumber()
      setMaxWithdrawAmount(res)
    }
  }, [provider, vaultContract])

  useEffect(() => {
    getPoolBalance().then()
  }, [provider, vaultContract])

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
            <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
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
                  Available: {liquidityInfo.poolCurrentBalance?.toFixed(2)} {liquidityInfo.symbol}
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
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
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
                    <DAIIcon height="16" width="16" />
                  </div>
                </div>
              </div>
            </div>
            <KRAVButton
              disabled={addDecimals(withdrawAmount.toString(), liquidityInfo.decimals).isGreaterThan(
                addDecimals(maxWithdrawAmount.toString(), liquidityInfo.decimals)
              )}
              onClick={async () => {
                setIsOpen(false)
                await removeLiquidity(addDecimals(withdrawAmount.toString(), liquidityInfo.decimals))
                await Promise.all([updateFactory(), getUserPosition()])
                setIsOpen(false)
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
