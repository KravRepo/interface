/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent } from '@mui/material'
import { dialogContent } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { css } from '@emotion/react'
import { ReactComponent as DAIIcon } from 'assets/imgs/tokens/dai.svg'
import { ReactComponent as BTCIcon } from 'assets/imgs/tokens/bitcoin.svg'
import KRAVButton from '../KravUIKit/KravButton'
import { align } from '../../globalStyle'
import { ConfirmCreatPoolProps } from '../Liquidity/type'
import { useCreatePool } from '../../hook/hookV8/useCreatePool'
import { useFactory } from '../../hook/hookV8/useFactory'
import { useCallback } from 'react'
import { useAddLiquidity } from 'hook/hookV8/useAddLiquidity'
import BigNumber from 'bignumber.js'
import { useUserPosition } from '../../hook/hookV8/useUserPosition'
import { addDecimals } from '../../utils/math'

export const ConfirmCreatPool = ({
  isOpen,
  setIsOpen,
  tokenAddress,
  ticketSize,
  LPProvision,
  tokenSymbol,
  tokenDecimals,
}: ConfirmCreatPoolProps) => {
  const creatPool = useCreatePool()
  const updateFactory = useFactory()
  const addLiquidity = useAddLiquidity(tokenAddress)
  const getUserPosition = useUserPosition()

  const sendTransaction = useCallback(async () => {
    setIsOpen(false)
    await creatPool(tokenAddress, ticketSize)
    console.log('updateFactory')
    const allPoolParams = await updateFactory()
    console.log('allPoolParams', allPoolParams)
    const targetVaultT = allPoolParams?.find((item) => item.tokenT === tokenAddress)?.vaultT
    console.log('targetVaultT', targetVaultT)
    if (targetVaultT) {
      await addLiquidity(addDecimals(new BigNumber(LPProvision), tokenDecimals), targetVaultT)
      await Promise.all([updateFactory(), getUserPosition()])
    }
  }, [creatPool, updateFactory, tokenAddress])

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
            <span>Confirm</span>
            <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
          </div>
          <div
            css={css`
              padding: 24px;
              border-bottom: 1px solid #f6f6f6;
            `}
          >
            <div className="confirm-content-input2">
              <p>Target Market</p>
              <div css={align}>
                <BTCIcon height="40" width="40" />
                <div
                  css={css`
                    margin-left: 12px;
                    > p {
                      margin: 0;
                    }
                  `}
                >
                  <p>BTC</p>
                  <p className="grey">Bitcoin</p>
                </div>
              </div>
            </div>
            <div className="confirm-content-input2">
              <p>Token Collateral</p>
              <div css={align}>
                <DAIIcon height="40" width="40" />
                <div
                  css={css`
                    margin-left: 12px;
                    > p {
                      margin: 0;
                    }
                  `}
                >
                  <p>{tokenSymbol}</p>
                  <p className="grey">{tokenSymbol}</p>
                </div>
              </div>
            </div>
            <div className="confirm-content-info">
              <p>
                <span>Set Ticket Size</span>
                <span>
                  1 BTC={ticketSize} {tokenSymbol}
                </span>
              </p>
              <p>
                <span>Deposit Amount/Initial LP Provision</span>
                <span>
                  {LPProvision} {tokenSymbol}
                </span>
              </p>
            </div>
            <KRAVButton onClick={sendTransaction} sx={{ mt: '24px' }}>
              Confirm
            </KRAVButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
