import { css } from '@emotion/react'

export const positionInfo = css`
  justify-content: space-between;
`

export const input = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 12px;
  gap: 8px;
  width: 310px;
  border-radius: 4px;
  margin-bottom: 8px;
  @media screen and (max-width: 1330px) {
    width: 262px;
  }
  @media screen and (max-width: 1200px) {
    width: 100%;
  }
`
export const orderParamsTab = css`
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  color: #757575;
  :hover {
    color: #fff;
    background: black;
  }
  @media screen and (max-width: 1200px) {
    :hover {
      color: #fff;
      background: #757575;
    }
  }
`
export const orderParamsTabActive = css`
  color: #000;
`

export const trigger = css`
  padding: 15px;
  background: #f7f7f7;
  margin-bottom: 10px;
  border-radius: 4px;
`

export const normalTab = css`
  color: #757575;
  font-weight: 400;
`

export const attention = css`
  margin: 16px 0 24px;
  border-radius: 4px;
  padding: 24px 16px;
  .title {
    padding-bottom: 16px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    > span {
      margin-left: 10px;
      font-family: 'Inter';
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
      line-height: 140%;
    }
  }
  .order-limit {
    margin-bottom: 16px;
  }
  .content {
    font-family: 'Inter';
    font-weight: 500;
    line-height: 140%;
    > p:first-of-type {
      font-size: 16px;
      margin-bottom: 8px;
    }
    > p:last-of-type {
      font-size: 14px;
    }
  }
`
