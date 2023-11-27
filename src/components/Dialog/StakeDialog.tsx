/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent, TextField, useTheme } from '@mui/material'
import { dialogContent } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { css } from '@emotion/react'
import { align } from '../../globalStyle'
import { ReactComponent as KRAVIcon } from '../../assets/imgs/tokens/KRAV.svg'
import KRAVButton from '../KravUIKit/KravButton'
import BigNumber from 'bignumber.js'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useGetKravStake } from '../../hook/hookV8/useGetKravStake'
import { addDecimals, eXDecimals } from '../../utils/math'
import { getBigNumberStr } from '../../utils'

type StakeDialogProps = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  useStakeAmount: BigNumber
  isStake: boolean
  userKravBalance: BigNumber
  setPoolStake: Dispatch<SetStateAction<BigNumber>>
  setUserStake: Dispatch<SetStateAction<BigNumber>>
  setUserKravBalance: Dispatch<SetStateAction<BigNumber>>
}

export const StakeDialog = ({
  isOpen,
  setIsOpen,
  useStakeAmount,
  isStake,
  userKravBalance,
  setPoolStake,
  setUserStake,
  setUserKravBalance,
}: StakeDialogProps) => {
  const theme = useTheme()
  const [amount, setAmount] = useState<string | number>('')
  const { getTotalStake, getUserStake, stakeKrav, withdrawKrav, getUserKRAVBalance } = useGetKravStake()
  const buttonStr = useMemo(() => {
    if (isStake) {
      if (amount === '' || amount === 0) return 'Enter a mount'
      else if (new BigNumber(amount).isGreaterThan(userKravBalance)) return 'Insufficient Balance'
      else if (new BigNumber(amount).isLessThanOrEqualTo(0)) return 'Invalid number'
      else return 'Stake'
    } else {
      if (amount === '' || amount === 0) return 'Enter a mount'
      else if (new BigNumber(amount).isGreaterThan(useStakeAmount)) return 'Insufficient Balance'
      else if (new BigNumber(amount).isLessThanOrEqualTo(0)) return 'Invalid number'
      else return 'Withdraw'
    }
  }, [userKravBalance, useStakeAmount, isStake, amount])

  return (
    <Dialog
      sx={{
        '.MuiDialog-paper': {
          width: '440px',
          borderRadius: '8px',
          background: theme.background.primary,
          // backgroundColor: theme.palette.mode === 'dark' ? '#1B1E24' : '',
        },
      }}
      open={isOpen}
    >
      <DialogContent sx={{ padding: 0, color: theme.text.primary }}>
        {!isStake && (
          <div css={dialogContent}>
            <div className="dialog-header ">
              <span>Withdraw KRAV</span>
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
                border-bottom: ${theme.splitLine.primary};
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
                  <span>Available:{useStakeAmount.toFixed(4)} KRAV</span>
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
                      onClick={() => setAmount(useStakeAmount.toNumber())}
                    >
                      MAX
                    </div>
                    <div css={align}>
                      <span
                        css={css`
                          margin: 0 6px;
                        `}
                      >
                        KRAV
                      </span>
                      <KRAVIcon height="16" width="16" />
                    </div>
                  </div>
                </div>
              </div>
              <KRAVButton
                disabled={
                  new BigNumber(amount.toString()).isGreaterThan(useStakeAmount) ||
                  !new BigNumber(amount).isGreaterThan(0) ||
                  amount === ''
                }
                onClick={async () => {
                  setIsOpen(false)
                  await withdrawKrav(addDecimals(amount.toString(), 18))
                  const res = await Promise.all([getTotalStake(), getUserStake(), getUserKRAVBalance()])
                  setPoolStake(eXDecimals(res[0], 18))
                  setUserStake(eXDecimals(res[1], 18))
                  setUserKravBalance(eXDecimals(res[2], 18))
                  setAmount('')
                }}
                sx={{ mt: '24px' }}
              >
                {buttonStr}
              </KRAVButton>
            </div>
          </div>
        )}
        {isStake && (
          <div css={dialogContent}>
            <div className="dialog-header ">
              <span>Stake Krav</span>
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
                border-bottom: ${theme.splitLine.primary};
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
                  <span>Available: {getBigNumberStr(userKravBalance, 2)} KRAV</span>
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
                      onClick={() => setAmount(Number(userKravBalance.toFixed(4, 1)))}
                    >
                      MAX
                    </div>
                    <div css={align}>
                      <span
                        css={css`
                          margin: 0 6px;
                        `}
                      >
                        KRAV
                      </span>
                      <KRAVIcon height="16" width="16" />
                    </div>
                  </div>
                </div>
              </div>
              <KRAVButton
                disabled={
                  new BigNumber(amount).isGreaterThan(userKravBalance) ||
                  new BigNumber(amount).isLessThanOrEqualTo(0) ||
                  amount === ''
                }
                onClick={async () => {
                  setIsOpen(false)
                  await stakeKrav(addDecimals(amount.toString(), 18))
                  const res = await Promise.all([getTotalStake(), getUserStake(), getUserKRAVBalance()])
                  setPoolStake(eXDecimals(res[0], 18))
                  setUserStake(eXDecimals(res[1], 18))
                  setUserKravBalance(eXDecimals(res[2], 18))
                  setAmount('')
                }}
                sx={{ mt: '24px' }}
              >
                {buttonStr}
              </KRAVButton>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
