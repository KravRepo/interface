import { css } from '@emotion/react'

export const header = css`
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0 32px 0 25px;
  background: transparent;
  @media screen and (max-width: 1200px) {
    padding: 0 10px 0 16px;
  }
`

export const setting = css`
  .userInfo {
    padding: 24px;
    > div:first-of-type {
      display: flex;
      align-items: center;
      justify-content: space-between;
      > div:last-of-type > svg {
        margin-left: 16px;
        cursor: pointer;
      }
    }
    > div:last-of-type {
      text-align: center;
      > p:first-of-type {
        font-family: 'Inter';
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 140%;
        padding-top: 24px;
        padding-bottom: 14px;
      }
      > p:last-of-type {
        font-family: 'GT-Flexa-Bold-Trial';
        font-size: 28px;
        font-style: normal;
        font-weight: 900;
        line-height: 110%; /* 30.8px */
        letter-spacing: 0.56px;
      }
    }
  }
  .action {
    padding: 16px;
    display: flex;
    cursor: pointer;
    align-items: center;
    > svg {
      margin-right: 12px;
    }
  }
`

export const UnSupport = css`
  height: 72px;
  width: 100%;
  background: #db4c40;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  > span {
    text-decoration: underline;
    cursor: pointer;
  }
`

export const routerActive = css`
  background: #000000;
  color: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

export const router = css`
  margin-right: 16px;
  padding: 8px;
  border-radius: 8px;
  height: 32px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.01em;
  cursor: pointer;
  font-family: 'Inter';
  text-decoration: none;
`

export const headerBtn = css`
  padding: 10px 16px;
  height: 40px;
  font-size: 14px;
  @media screen and (max-width: 1200px) {
    padding: 10px 6px;
  }
`

export const notifyBtn = css`
  border-radius: 4px;
  border: 1px solid #dadada;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 13px;
  cursor: pointer;
`
