import { css } from '@emotion/react'

export const doc = css`
  padding-left: 72px;
  > p:first-of-type {
    font-size: 16px;
    padding-top: 32px;
    padding-bottom: 20px;
  }
  > a {
    text-decoration: none;
    > p {
      color: #757575;
      margin: 0;
      padding-bottom: 10px;
    }
  }
  > p {
    margin: 0;
    padding-bottom: 10px;
  }
`

export const mobileTabs = css`
  > p:first-of-type {
    padding: 18px 16px 18px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  > a > p {
    padding: 18px 16px 18px 24px;
  }
  .link {
    padding: 18px 16px 18px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
`
