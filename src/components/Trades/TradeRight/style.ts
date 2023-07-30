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
  background: #f7f7f7;
  border-radius: 4px;
  margin-bottom: 8px;
`
export const orderParamsTab = css`
  margin: 12px 16px 12px 0;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  color: #757575;
  :hover {
    color: #000;
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

export const activeTab = css`
  color: #000;
  font-weight: 700;
`
