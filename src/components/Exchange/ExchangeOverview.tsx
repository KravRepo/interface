/** @jsxImportSource @emotion/react */
import { ReactComponent as KravToken } from '../../assets/imgs/krav_token.svg'
import { ReactComponent as VeKravToken } from '../../assets/imgs/ve_krav_token.svg'
import { css } from '@emotion/react'
import KRAVTab from '../KravUIKit/KravTab'
import { useTheme } from '@mui/material'

export const ExchangeOverview = () => {
  const theme = useTheme()
  return (
    <div
      css={css`
        padding: 64px 40px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        border-radius: 0 0 8px 8px;
        background: ${theme.background.primary};
        font-family: 'GT-Flexa-Bold-Trial';
        margin-bottom: 24px;
      `}
    >
      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr 1px 1.52fr;
          align-items: center;
          background: ${theme.background.second};
          border-radius: 16px;
          height: 200px;
          padding: 18px 48px;
          > div:last-of-type {
            padding-left: 56px;
          }
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: center;
            > span {
              margin-left: 8px;
              font-size: 40px;
            }
          `}
        >
          <KravToken
            css={css`
              height: 64px;
              width: 64px;
            `}
          />
          <span>XXA</span>
        </div>
        <div
          css={css`
            border: ${theme.splitLine.primary};
            height: 100%;
          `}
        />
        <div>
          <KRAVTab>Total Stake</KRAVTab>
          <p
            css={css`
              margin-top: 10px;
              font-size: 28px;
            `}
          >
            23,102,345.0 XXA
          </p>
        </div>
      </div>
      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr 1px 1.52fr;
          align-items: center;
          height: 200px;
          padding: 18px 48px;
          background: ${theme.background.second};
          border-radius: 16px;
          > div:last-of-type {
            padding-left: 56px;
          }
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: center;
            > span {
              margin-left: 8px;
              font-size: 40px;
            }
          `}
        >
          <VeKravToken
            css={css`
              height: 64px;
              width: 64px;
            `}
          />
          <span>XXB</span>
        </div>
        <div
          css={css`
            border: ${theme.splitLine.primary};
            height: 100%;
          `}
        />
        <div>
          <KRAVTab>Mint will start after</KRAVTab>
          <p
            css={css`
              margin-top: 10px;
              font-size: 28px;
            `}
          >
            05:12:30
          </p>
        </div>
      </div>
    </div>
  )
}
