import { css } from '@emotion/react'

export const tradeLeft = css`
  flex: 1;
  padding-right: 18px;
  > div {
    width: 100%;
  }
`

export const tradeRight = css`
  width: 358px;
`

export const pairInfo = css`
  height: 64px;
  justify-content: space-between;
  > div:first-of-type {
    display: flex;
    align-items: center;
  }
  .info-card {
    height: 40px;
    padding: 0 24px;
    color: #757575;
    font-size: 12px;
    > p {
      margin: 0 0 5px 0;
    }
  }
  .symbol {
    font-family: 'GT-Flexa-Bold-Trial';
    font-size: 20px;
    font-style: normal;
    font-weight: 900;
    line-height: 130%;
    margin-right: 12px;
    padding-top: 2px;
  }
  .rise {
    color: #db4c40;
  }
  .fall {
    color: #009b72;
  }
`

export const card = css`
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 24px;
  gap: 32px;
`

export const actionCard = css`
  background: #fff;
  border-radius: 8px;
  padding: 16px 24px;
  color: black;
`

export const bottomCard = css`
  margin-top: 18px;
  background: #fff;
  border-radius: 8px;
  font-size: 14px;
  padding-bottom: 24px;
  > div:first-of-type {
    height: 46px;
    line-height: 46px;
    font-size: 16px;
    padding-left: 24px;
    border-bottom: 1px solid #dadada;
    font-style: normal;
    font-weight: 500;
  }
  .card-details {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 24px 8px;
  }
`

export const chart = css`
  height: 481px;
  background: #fff;
  margin-top: 12px;
  padding: 18px;
  border-radius: 8px;
  position: relative;
`
