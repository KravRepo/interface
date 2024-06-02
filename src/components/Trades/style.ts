import { css } from '@emotion/react'

export const tradeLeft = css`
  flex: 1;
  flex-grow: 1;
  > div {
    width: 100%;
  }
`

export const tradeRight = css`
  width: 100%;
  max-width: 358px;
  @media screen and (max-width: 1330px) {
    max-width: 310px;
  }
  @media screen and (max-width: 1200px) {
    width: 100%;
  }
`

export const pairInfo = css`
  min-height: 64px;
  justify-content: space-between;
  position: relative;
  margin-bottom: 16px;
  width: 100%;
  margin-left: auto;
  justify-content: flex-start;
  @media screen and (max-width: 1500px) {
    overflow: hidden;
  }
  @media screen and (max-width: 1200px) {
    padding: 12px;
  }
`

export const card = css`
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 24px;
`

export const actionCard = css`
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  color: black;
`

export const bottomCard = css`
  margin-top: 18px;
  border-radius: 8px;
  font-size: 14px;
  padding-bottom: 24px;
  > div:first-of-type {
    height: 46px;
    line-height: 46px;
    font-size: 16px;
    padding-left: 24px;
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
  background: #fff;
  border-radius: 8px;
  position: relative;
  margin-top: 12px;
`
