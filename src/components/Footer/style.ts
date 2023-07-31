import { css } from '@emotion/react'

export const footer = css`
  width: 100%;
  height: 212px;
  background: white;
  border-top: 1px solid #dadada;
  margin-top: 40px;
  .footer-content {
    margin: 0 auto;
    height: 100%;
    max-width: 1440px;
    display: grid;
    grid-template-columns: 2.7fr 1fr 1fr 1.1fr;
    font-size: 14px;
    .social {
      margin-top: 83px;
      margin-bottom: 12px;
    }
    > div {
      border-right: 1px solid #dadada;
    }
    > div:last-of-type {
      border-right: unset;
    }
  }
`

export const doc = css`
  padding-left: 72px;
  > p:first-of-type {
    font-size: 16px;
    padding-top: 32px;
    padding-bottom: 20px;
    color: black;
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
