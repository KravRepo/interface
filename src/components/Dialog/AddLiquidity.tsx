/** @jsxImportSource @emotion/react */
import { Box, Stack, TextField, Typography, useTheme } from '@mui/material'
import { dialogContent } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { css } from '@emotion/react'
import { align } from '../../globalStyle'
import KRAVButton from '../KravUIKit/KravButton'
import { AddLiquidityProps } from '../Liquidity/type'
import { useRootStore } from '../../store/root'
import { useMemo, useState } from 'react'
import { useAddLiquidity } from '../../hook/hookV8/useAddLiquidity'
import { addDecimals } from '../../utils/math'
import { useUserPosition } from '../../hook/hookV8/useUserPosition'
import BigNumber from 'bignumber.js'
import { useFactory } from '../../hook/hookV8/useFactory'
import { ReactComponent as WarningIcon } from '../../assets/imgs/warningIcon.svg'
import { DialogLayout } from './DialogLayout'

export const AddLiquidity = ({ isOpen, setIsOpen }: AddLiquidityProps) => {
  const theme = useTheme()
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
    <DialogLayout isOpen={isOpen} setIsOpen={setIsOpen}>
      <div css={dialogContent}>
        <div
          className="dialog-header "
          css={css`
            border-bottom: ${theme.splitLine.primary};
          `}
        >
          <span>Add Liquidity</span>
          <CloseSharpIcon
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              setAmount('')
              setIsOpen(false)
            }}
          />
        </div>
        <Box padding={'24px'} pb={0}>
          <Stack direction={'row'}>
            <WarningIcon />
            <Typography
              fontFamily={'Inter'}
              fontSize={16}
              fontWeight={500}
              lineHeight={'150%'}
              sx={{ marginLeft: '8px !important' }}
            >
              Liquidity Remove Limit
            </Typography>
          </Stack>
          <Typography
            fontFamily={'Inter'}
            fontSize={14}
            fontWeight={400}
            lineHeight={'150%'}
            sx={{ marginTop: '16px !important' }}
          >
            <span style={{ fontWeight: 600 }}>Reminder: </span>
            <span>
              When withdrawing liquidity, you can only remove 25% of your provided liquidity at a time. Furthermore,
              there must be a minimum of 43,200 blocks in between two consecutive withdrawals. These rules help ensure a
              stable and fair trading environment on our platform.
            </span>
          </Typography>
        </Box>
        <div
          css={css`
            padding: 24px;
          `}
        >
          <div
            className="confirm-content-input3"
            css={css`
              background: ${theme.background.second};
              color: ${theme.text.primary};
            `}
          >
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
                placeholder="0"
                onChange={(e) => setAmount(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                }}
                sx={{
                  background: theme.background.second,
                  color: theme.text.primary,
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
                    background: ${theme.palette.mode === 'dark' ? '#2832f5' : '#a4a8fe'};
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
                  <img
                    css={css`
                      border-radius: 50%;
                      background: ${theme.palette.mode === 'dark' ? '#fff' : ''};
                    `}
                    src={liquidityInfo.logoSource}
                    height="16"
                    width="16"
                  />
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
    </DialogLayout>
  )
}
