import { css } from '@emotion/react'

export const liquidity = css`
  max-width: 1376px;
  margin: 16px auto 0;
  @media screen and (max-width: 1200px) {
    margin: 16px 0 0;
    padding: 0 16px;
  }
  .liquidity-content {
    border-radius: 8px;
    margin-bottom: 18px;
    @media screen and (max-width: 1200px) {
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  .liquidity-tabs {
    font-size: 20px;
    font-weight: 500;
    padding: 16px 0 12px 32px;
    @media screen and (max-width: 1200px) {
      padding: 16px 16px 12px;
    }
  }
  .liquidity-table {
    padding: 0 48px 16px 32px;
    align-items: center;
    display: grid;
    grid-template-columns:
      2fr minmax(100px, 1.8fr) minmax(60px, 1.3fr) minmax(120px, 2.2fr) minmax(120px, 2.2fr)
      1.6fr 117px;
    font-size: 14px;
    @media screen and (max-width: 1200px) {
      min-width: 1200px;
      padding: 16px 16px 12px;
      grid-template-columns:
        minmax(120px, 1fr) minmax(85px, 1.8fr) minmax(115px, 1.3fr) minmax(210px, 2.2fr) minmax(210px, 2.2fr)
        minmax(141px, 1.6fr) 117px;
    }
  }
  .liquidity-search {
    padding: 24px 48px 24px 24px;
    display: flex;
    justify-content: flex-end;
    @media screen and (max-width: 1200px) {
      padding: 16px 16px 12px;
      justify-content: start;
    }
  }
  .liquidity-card-layout {
    font-family: 'Inter';
    font-style: normal;
    margin: 32px 40px 0;
    padding-bottom: 64px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 56px 32px;
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
  .creat-pool-table-mobile {
    .table-left {
      position: relative;
      margin: 24px 16px;
      padding-bottom: 40px;
      font-size: 15px;
      font-weight: 500;
      .input-params {
        padding-bottom: 32px;
        > div:first-of-type {
          padding-bottom: 12px;
        }
      }
    }
    .table-right {
      margin: 24px 16px;
      padding: 24px 16px;
      .step {
        > p:first-of-type {
          font-size: 15px;
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

export const marketCard = css`
  border-radius: 16px;
  width: 300px;
  box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.16);
  .card-title {
    position: relative;
    padding: 32px 16px 16px;
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      > span {
        font-size: 20px;
        font-weight: 600;
      }
    }
    > img {
      position: absolute;
    }
  }
  .card-content {
    padding: 16px;
    .data {
      > p:first-of-type {
        font-size: 12px;
        margin-bottom: 8px;
      }
      > p:nth-of-type(2) {
        font-size: 20px;
        font-weight: 900;
      }
      > div {
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: 900;
      }
    }
    .stake-info {
      padding: 8px 12px;
      border-radius: 12px;
      > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        > span:first-of-type {
          font-size: 12px;
          font-weight: 400;
        }
      }
    }
    .action {
      overflow: hidden;
      margin-top: 24px;
      border-radius: 12px;
      > div:first-of-type {
        font-size: 12px;
        font-weight: 700;
        padding: 8px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        > span:last-of-type {
          font-size: 14px;
        }
      }
      > div:last-of-type {
        padding: 0px 12px 8px;
        > p {
          font-size: 12px;
          font-weight: 700;
        }
        > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 20px;
          font-weight: 900;
        }
      }
    }
    .apr {
      border-radius: 12px;
      margin-top: 8px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: 700;
      > span:first-of-type {
        font-size: 12px;
      }
    }
  }
`
