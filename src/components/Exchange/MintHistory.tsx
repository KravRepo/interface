/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import BigNumber from 'bignumber.js'
import { historyGrid } from './style'
import { Pagination, useTheme } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { STAKE_HISTORY_API } from '../../constant/chain'
import { useWeb3React } from '@web3-react/core'
import { eXDecimals } from '../../utils/math'

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
      <span>
        {ratio} KRAV {'->'}
        {ratio} ???
      </span>
      <span>{amount.toFormat(2)} KRAV</span>
      <span>{mintTo.toFormat(2)} ???</span>
      <span>
        {address.substr(0, 4)}
        ...
        {address.substr(address.length - 2, 2)}
      </span>
      <span>{date}</span>
    </div>
  )
}

type HistoryData = {
  amount: string
  chainId: number
  createTime: string
  id: number
  staker: string
  timestamp: number
  updateTime: string
}

export const MintHistory = () => {
  const theme = useTheme()
  const { account, chainId } = useWeb3React()
  const [historyArray, setHistoryArray] = useState<HistoryData[]>([])
  const [totalHistory, setTotalHistory] = useState(0)
  const [page, setPage] = useState(1)

  const getHistroy = useCallback(async () => {
    if (account && chainId) {
      try {
        const req = await fetch(
          STAKE_HISTORY_API + account + '&chainId=' + chainId + '&offset=' + (page - 1) * 10 + '&limit=' + 10
        )
        const history = await req.json()
        if (history.code === 200) {
          const historyData = history.data as HistoryData[]
          setTotalHistory(history.total)
          setHistoryArray(historyData)
        }
      } catch (e) {
        console.log('get histroy failed!', e)
      }
    }
  }, [account, chainId, page])

  const handlePageChange = (event: any, value: number) => {
    setPage(value)
  }

  useEffect(() => {
    getHistroy().then()
  }, [getHistroy])

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
      {historyArray.map((item, index) => {
        return (
          <HistoryItem
            amount={eXDecimals(item.amount, 18)}
            address={item.staker}
            date={item.createTime}
            mintTo={eXDecimals(item.amount, 18)}
            ratio={1}
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
        <Pagination count={Math.ceil(totalHistory / 10)} size="small" onChange={handlePageChange} />
      </div>
    </div>
  )
}
