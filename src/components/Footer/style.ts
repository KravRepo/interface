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
