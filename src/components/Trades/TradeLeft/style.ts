import { css } from '@emotion/react'

export const myTrade = css`
  margin-top: 18px;
  background: #fff;
  border-radius: 8px;
  min-height: 371px;
  @media screen and (max-width: 1200px) {
    min-height: 170px;
  }
  .position-layout {
    align-items: center;
    display: grid;
    padding: 12px 24px;
    margin: 0 12px;
    grid-template-columns: 120px minmax(200px, 1fr) 1fr 1fr 1fr 1fr 1fr 0.5fr;
    @media screen and (max-width: 1200px) {
      min-width: 1200px;
    }
    font-size: 12px;
    .loading {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: inline-block;
      -webkit-animation: rotation 1s linear infinite;
      animation: rotation 1s linear infinite;
    }
    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
  .history-layout {
    align-items: center;
    display: grid;
    padding: 12px 24px 0px;
    grid-template-columns: 140px minmax(140px, 1fr) 1fr 1fr 1fr 1fr 1fr 0.5fr;
    font-size: 12px;
    @media screen and (max-width: 1200px) {
      min-width: 1200px;
    }
  }
  .order-layout {
    align-items: center;
    display: grid;
    padding: 12px 24px 0px;
    grid-template-columns: 80px minmax(140px, 2fr) 1fr 1fr 1fr 1fr 1fr;
    font-size: 12px;
    @media screen and (max-width: 1200px) {
      min-width: 1200px;
    }
  }
  .no-data {
    padding-top: 103px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
    color: #757575;
    @media screen and (max-width: 1200px) {
      padding-top: 30px;
    }
  }
`

export const historyOverflow = css`
  max-height: 400px;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`
