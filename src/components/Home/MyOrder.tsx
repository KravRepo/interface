/** @jsxImportSource @emotion/react */
import KRAVButton from '../KravUIKit/KravButton'
import { css, Tab, Tabs } from '@mui/material'
import React, { useState } from 'react'
// import { useRootStore } from '../../store/root'

export const MyOrder = () => {
  const [infoType, setInfoType] = useState(0)
  // const allPoolParams = useRootStore((state) => state.allPoolParams)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setInfoType(newValue)
  }
  return (
    <div className="my-order">
      <p
        className="title"
        css={css`
          display: flex;
          justify-content: space-between;
          padding-bottom: 33px;
        `}
      >
        <span>My Order</span>
        <KRAVButton sx={{ width: '83px' }}>to trade</KRAVButton>
      </p>
      <div>
        <div
          css={css`
            padding-left: 24px;
            background: #f1f1f1;
          `}
        >
          <Tabs
            value={infoType}
            onChange={handleChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#000',
              },
              '& .Mui-selected': {
                color: '#000!important',
              },
            }}
          >
            <Tab
              sx={{
                minWidth: 0,
                fontFamily: 'Inter',
                padding: '12px 0',
                mr: '16px',
                '& .MuiTab-root': {
                  color: '#757575',
                },
              }}
              label={`Positions`}
            />
            <Tab
              sx={{
                minWidth: 0,
                mr: '16px',
                fontFamily: 'Inter',
                padding: '12px 0',
                '& .MuiTab-root': {
                  color: '#757575',
                },
              }}
              label={`Orders`}
            />
            <Tab
              sx={{
                minWidth: 0,
                fontFamily: 'Inter',
                padding: '12px 0',
                '& .MuiTab-root': {
                  color: '#757575',
                },
              }}
              label="Trades"
            />
          </Tabs>
        </div>
      </div>
    </div>
  )
}
