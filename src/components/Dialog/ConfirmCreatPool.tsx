/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent, useTheme } from '@mui/material'
import { dialogContent } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { css } from '@emotion/react'
import { ReactComponent as BTCIcon } from '../../assets/imgs/tokens/bitcoin.svg'
import KRAVButton from '../KravUIKit/KravButton'
import { align } from '../../globalStyle'
import { ConfirmCreatPoolProps } from '../Liquidity/type'
import { useCreatePool } from '../../hook/hookV8/useCreatePool'
import { useFactory } from '../../hook/hookV8/useFactory'
import { useCallback, useMemo } from 'react'
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
  setCreateLiquidityPool,
  setLPProvision,
  setTicketSize,
  setTokenAddress,
}: ConfirmCreatPoolProps) => {
  const theme = useTheme()
  const creatPool = useCreatePool()
  const updateFactory = useFactory()
  const getUserPosition = useUserPosition()

  const sendTransaction = useCallback(async () => {
    setIsOpen(false)
    try {
      await creatPool(tokenAddress, ticketSize, addDecimals(new BigNumber(LPProvision), tokenDecimals))
      await Promise.all([updateFactory(), getUserPosition()])
      setLPProvision('')
      setTicketSize('')
      setTokenAddress('')
      setCreateLiquidityPool(false)
    } catch (e) {}
  }, [creatPool, updateFactory, tokenAddress])

  const tokenLogoSource = useMemo(() => {
    try {
      return require(`../../assets/imgs/tokens/${tokenSymbol}.svg`)
    } catch (e) {
      return require('../../assets/imgs/tokens/default_token.svg')
    }
  }, [tokenSymbol])

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
        <div css={dialogContent}>
          <div
            className="dialog-header"
            css={css`
              border-bottom: ${theme.splitLine.primary};
            `}
          >
            <span>Confirm</span>
            <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
          </div>
          <div
            css={css`
              padding: 24px;
            `}
          >
            <div
              className="confirm-content-input2"
              css={css`
                background: ${theme.background.second};
              `}
            >
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
            <div
              className="confirm-content-input2"
              css={css`
                background: ${theme.background.second};
              `}
            >
              <p>Token Collateral</p>
              <div css={align}>
                <img
                  css={css`
                    border-radius: 50%;
                    background: ${theme.palette.mode === 'dark' ? '#fff' : ''};
                  `}
                  src={tokenLogoSource}
                  height="40"
                  width="40"
                />
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
