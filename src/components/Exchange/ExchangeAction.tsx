/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import KRAVButton from '../KravUIKit/KravButton'
import { TextField, useTheme } from '@mui/material'
import { ReactComponent as KravToken } from '../../assets/imgs/krav_token.svg'
import { ReactComponent as VeKravToken } from '../../assets/imgs/ve_krav_token.svg'
import { ReactComponent as TipDark } from '../../assets/imgs/darkModel/exchange_tip_dark.svg'
import { ReactComponent as Tip } from '../../assets/imgs/exchange_tip.svg'
import { ReactComponent as Arrow } from '../../assets/imgs/mint_arrow.svg'
import { useState } from 'react'

export const ExchangeAction = () => {
  const [showMint, setShowMint] = useState(false)
  const theme = useTheme()
  return (
    <div
      css={css`
        border-radius: 8px;
        background: ${theme.background.primary};
        margin-bottom: 24px;
        padding: 15px 40px 42px;
      `}
    >
      <div
        css={css`
          padding: 16px 24px;
          background: rgba(164, 168, 254, 0.2);
          display: flex;
          align-items: center;
          font-size: 12px;
          font-weight: 600;
          color: ${theme.palette.mode === 'dark' ? '#2832f5' : '#a4a8fe'};
          border-radius: 8px;
          margin-bottom: 24px;
        `}
      >
        {theme.palette.mode === 'dark' ? <TipDark /> : <Tip />}
        <span>
          &nbsp;
          {'You need to stake XXA Token first, and the "mint" operation will not be officially started until the mint\n' +
            'start time.'}
        </span>
      </div>
      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 26px;
        `}
      >
        <div
          css={css`
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 26px;
            font-size: 20px;
            font-weight: 600;
            position: relative;
          `}
        >
          <Arrow
            css={css`
              position: absolute;
              left: calc(50% - 26px);
              top: calc(50%);
            `}
          />
          <div>
            <p
              css={css`
                padding-left: 6px;
                margin-bottom: 16px;
              `}
            >
              Burn
            </p>
            <div
              css={css`
                padding: 48px 0 72px 40px;
                background: ${theme.background.second};
                border-radius: 16px;
              `}
            >
              <div>
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                    > span {
                      margin-left: 8px;
                    }
                  `}
                >
                  <KravToken />
                  <span>XXA</span>
                </div>
                <p
                  css={css`
                    color: ${theme.text.second};
                    font-size: 14px;
                    font-weight: 700;
                    margin-top: 32px;
                  `}
                >
                  Ethereum Chain Network
                </p>
              </div>
            </div>
          </div>
          <div>
            <p
              css={css`
                padding-left: 6px;
                margin-bottom: 16px;
              `}
            >
              Mint
            </p>
            <div
              css={css`
                padding: 48px 0 72px 40px;
                background: ${theme.background.second};
                border-radius: 16px;
              `}
            >
              <div>
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                    > span {
                      margin-left: 8px;
                    }
                  `}
                >
                  <VeKravToken />
                  <span>XXB</span>
                </div>
                <p
                  css={css`
                    color: ${theme.text.second};
                    font-size: 14px;
                    font-weight: 700;
                    margin-top: 32px;
                  `}
                >
                  Ethereum Chain Network
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={() => setShowMint(!showMint)}
          css={css`
            padding: 24px 48px;
            border: ${theme.splitLine.primary};
            font-size: 20px;
            border-radius: 16px;
            font-weight: 700;
            > p {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
          `}
        >
          {!showMint && (
            <>
              <p>
                <span>Your staked :</span>
                <span>10 XXA</span>
              </p>
              <p
                css={css`
                  font-size: 14px;
                `}
              >
                <span>Amount</span>
                <span>Available: 235,258.96 XXA</span>
              </p>
              <div
                css={css`
                  margin-bottom: 18px;
                `}
              >
                <div
                  css={css`
                    background: ${theme.background.second};
                    border-radius: 8px;
                    padding: 8px 12px;
                    display: flex;
                    align-items: center;
                  `}
                >
                  <KravToken />
                  <TextField
                    variant="standard"
                    type="number"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    sx={{
                      height: '28px',
                      fontSize: '20px',
                      minHeight: '28px',
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        height: '28px',
                        minHeight: '28px',
                        padding: 0,
                      },
                    }}
                  />
                  <span
                    css={css`
                      font-size: 16px;
                      margin-right: 8px;
                    `}
                  >
                    XXA
                  </span>
                  <div
                    css={css`
                      border-radius: 2px;
                      color: ${theme.text.primary};
                      background: ${theme.palette.mode === 'dark' ? '#2832f5' : '#a4a8fe'};
                      padding: 2px 6px;
                      font-size: 12px;
                      cursor: pointer;
                    `}
                  >
                    MAX
                  </div>
                </div>
              </div>
              <p
                css={css`
                  font-size: 12px;
                `}
              >
                <span>Exchange ratio :</span>
                <span>1 XXA→2.5 XXB</span>
              </p>
              <KRAVButton
                sx={{
                  mt: '4px',
                }}
              >
                Stake
              </KRAVButton>
            </>
          )}
          {showMint && (
            <div
              css={css`
                text-align: center;
              `}
            >
              <p
                css={css`
                  padding-top: 24px;
                `}
              >
                Amount that can be claimed
              </p>
              <p
                css={css`
                  font-size: 48px;
                  padding-top: 16px;
                  padding-bottom: 27px;
                  font-family: 'GT-Flexa-Bold-Trial';
                `}
              >
                200.56 XXB
              </p>
              <KRAVButton>Mint</KRAVButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
