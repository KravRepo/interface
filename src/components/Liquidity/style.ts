import { css } from '@emotion/react'

export const liquidity = css`
  max-width: 1376px;
  margin: 16px auto 0;
  .liquidity-content {
    background: #ffffff;
    border-radius: 8px;
    margin-bottom: 18px;
  }
  .liquidity-tabs {
    font-size: 20px;
    font-weight: 500;
    padding: 16px 0 12px 32px;
    border-bottom: 1px solid #dadada;
  }
  .liquidity-table {
    padding: 0 48px 16px 32px;
    align-items: center;
    display: grid;
    grid-template-columns:
      2fr minmax(100px, 1.8fr) minmax(60px, 1fr) minmax(60px, 1.3fr) minmax(120px, 2.2fr) minmax(120px, 2.2fr)
      1.6fr 117px;
    font-size: 14px;
  }
  .liquidity-search {
    padding: 24px 48px 24px 24px;
    display: flex;
    justify-content: space-between;
  }
  .grey {
    color: #757575;
  }
  .small {
    font-size: 12px;
  }
  .nowrap {
    > div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .no-data {
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
    color: #757575;
  }
`

export const creatPool = css`
  //min-height: calc(100vh - 300px);
  min-height: calc(100vh - 284px);
  margin-bottom: -40px;
  background: white;
  .creat-pool-content {
    max-width: 1248px;
    margin: 0 auto;
    padding-top: 64px;
  }
  .creat-pool-title {
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 29px;
  }
  .creat-pool-table {
    padding: 80px 0;
    display: grid;
    grid-template-columns: 7fr 1px 5.2fr;
    .table-left {
      position: relative;
      margin-right: 116px;
      margin-left: 29px;
      font-size: 16px;
      font-weight: 500;
      .input-params {
        padding-bottom: 32px;
        > div:first-of-type {
          padding-bottom: 12px;
        }
      }
    }
    .table-right {
      margin-left: 80px;
      margin-bottom: 40px;
      padding: 40px 40px 16px 40px;
      background: #f6f6f6;
      .step {
        > p:first-of-type {
          font-size: 16px;
          font-weight: 500;
          padding-bottom: 8px;
          margin: 0;
        }
        > p:last-of-type {
          font-size: 14px;
          margin: 0;
          padding-bottom: 24px;
        }
      }
    }
  }
`
