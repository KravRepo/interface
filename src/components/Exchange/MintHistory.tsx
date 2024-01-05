/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import BigNumber from 'bignumber.js'
import { historyGrid } from './style'
import { Pagination, useTheme } from '@mui/material'

const HistoryTitle = () => {
  return (
    <div
      css={[
        historyGrid,
        css`
          padding: 24px;
          margin: 0 40px;
          color: #617168;
          font-size: 12px;
        `,
      ]}
    >
      <span>Exchange ratio</span>
      <span>Stake&Burn Amount</span>
      <span>Mint to</span>
      <span>Address</span>
      <span>Date</span>
    </div>
  )
}

type HistoryItemProps = {
  ratio: number
  amount: BigNumber
  mintTo: BigNumber
  address: string
  date: string
  index: number
}

const HistoryItem = ({ ratio, amount, address, date, mintTo, index }: HistoryItemProps) => {
  const theme = useTheme()

  return (
    <div
      css={[
        historyGrid,
        css`
          background: ${(index + 1) % 2 !== 0 ? theme.background.second : ''};
          padding: 16px 24px;
          margin: 0 40px;
          border-radius: 24px;
          font-weight: 600;
          font-size: 12px;
        `,
      ]}
    >
      <span>{ratio}</span>
      <span>{amount.toFormat(2)}</span>
      <span>{mintTo.toFormat(2)}</span>
      <span>{address}</span>
      <span>{date}</span>
    </div>
  )
}

export const MintHistory = () => {
  const theme = useTheme()
  const mockHistory = [
    {
      ratio: 1,
      amount: new BigNumber(200258),
      mintTo: new BigNumber(500000),
      address: '0xCc39...780E6f',
      date: '2022/11/16 12:19',
    },
    {
      ratio: 1,
      amount: new BigNumber(200258),
      mintTo: new BigNumber(500000),
      address: '0xCc39...780E6f',
      date: '2022/11/16 12:19',
    },
    {
      ratio: 1,
      amount: new BigNumber(200258),
      mintTo: new BigNumber(500000),
      address: '0xCc39...780E6f',
      date: '2022/11/16 12:19',
    },
    {
      ratio: 1,
      amount: new BigNumber(200258),
      mintTo: new BigNumber(500000),
      address: '0xCc39...780E6f',
      date: '2022/11/16 12:19',
    },
  ]
  return (
    <div
      css={css`
        background: ${theme.background.primary};
        border-radius: 8px;
      `}
    >
      <p
        css={css`
          font-weight: 700;
          font-family: 'GT-Flexa-Bold-Trial';
          font-size: 28px;
          line-height: 1.1;
          padding: 16px 0 12px 32px;
          border-bottom: ${theme.splitLine.primary};
        `}
      >
        My history
      </p>
      <HistoryTitle />
      {mockHistory.map((item, index) => {
        return (
          <HistoryItem
            amount={item.amount}
            address={item.address}
            date={item.date}
            mintTo={item.mintTo}
            ratio={item.ratio}
            key={index}
            index={index}
          />
        )
      })}
      <div
        css={css`
          padding: 24px 0;
          display: flex;
          justify-content: center;
        `}
      >
        <Pagination count={10} size="small" />
      </div>
    </div>
  )
}
