import { css } from '@emotion/react'

export const header = css`
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0 32px 0 25px;
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
  color: black;
  cursor: pointer;
  font-family: 'Inter';
  text-decoration: none;
  :hover {
    background: #000000;
    color: white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  },
`

export const headerBtn = css`
  padding: 10px 16px;
  height: 40px;
  font-size: 14px;
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
