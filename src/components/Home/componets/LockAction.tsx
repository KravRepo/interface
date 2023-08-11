/** @jsxImportSource @emotion/react */
import { ReactComponent as KravToken } from '../../../assets/imgs/krav_token.svg'
import { ReactComponent as BoostIcon } from '../../../assets/imgs/boost_icon.svg'
import { ReactComponent as QuestionIcon } from '../../../assets/imgs/question.svg'
import { Slider, TextField, useTheme } from '@mui/material'
import { css } from '@emotion/react'
import KRAVButton from '../../KravUIKit/KravButton'
import { align } from '../../../globalStyle'
import { useState } from 'react'

const marks = [
  {
    value: 1,
    label: '6m',
  },
  {
    value: 2,
    label: '1y',
  },
  {
    value: 3,
    label: '2y',
  },
  {
    value: 4,
    label: '4y',
  },
]

export const LockAction = () => {
  const theme = useTheme()
  const [showTip, setShowTip] = useState(false)
  return (
    <div>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        `}
      >
        <span className="title gt">KRAV Lock Amount </span>
        <span>Available: 235,258.96 KRAV</span>
      </div>
      <div
        css={css`
          display: flex;
          border-radius: 4px;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: ${theme.background.second};
          margin-bottom: 24px;
        `}
      >
        <div css={align}>
          <KravToken />
          <span
            css={css`
              font-size: 20px;
              font-weight: 500;
            `}
          >
            &nbsp;&nbsp;201,256
          </span>
        </div>
        <TextField
          variant="standard"
          type="number"
          InputProps={{
            disableUnderline: true,
          }}
          sx={{
            height: '32px',
            fontSize: '20px',
            minHeight: '32px',
            '& .MuiOutlinedInput-root': {
              height: '32px',
              minHeight: '32px',
              padding: 0,
            },
          }}
        />
        <div css={align}>
          <span
            css={css`
              font-size: 20px;
              font-weight: 500;
            `}
          >
            KRAV&nbsp;&nbsp;
          </span>
          <div
            css={css`
              border-radius: 2px;
              color: ${theme.text.primary};
              background: ${theme.palette.mode === 'dark' ? '#2832f5' : '#a4a8fe'};
              padding: 2px 6px;
              font-size: 12px;
              cursor: pointer;
            `}
          >
            MAX
          </div>
        </div>
      </div>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <span
          css={css`
            font-weight: 500;
            font-size: 20px;
            padding-bottom: 15px;
          `}
        >
          Lock Period
        </span>
        <span>1 year</span>
      </div>
      <Slider
        defaultValue={1}
        step={1}
        min={1}
        max={4}
        marks={marks}
        sx={{
          height: '3px',
          '& .MuiSlider-root': {
            color: '#757575',
          },
          '& .MuiSlider-rail': {
            opacity: 1,
            backgroundColor: theme.palette.mode === 'dark' ? '#727272' : '#DADADA',
          },
          '& .MuiSlider-track': {
            border: 'unset',
            color: '#2832F5',
          },
          '& .MuiSlider-mark': {
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            background: theme.palette.mode === 'dark' ? '#727272' : '#DADADA',
            transform: 'translate(-7px, -50%)',
          },
          '& .MuiSlider-thumb': {
            height: '24px',
            width: '24px',
            border: '6px solid #2832F5',
            background: '#ffffff',
          },
          '& .MuiSlider-markActive': {
            background: '#2832F5',
          },
          '& .MuiSlider-markLabel': {
            fontSize: '12px',
            color: '#757575',
          },
        }}
      />
      <div
        css={css`
          padding-top: 31px;
          padding-bottom: 39px;
        `}
      >
        The longer you lock your KRAV, the more veKRAV you will receive. You can also get additional veKRAV by locking
        more KRAV or extending the lock period.{' '}
      </div>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        `}
      >
        <div css={align}>
          <BoostIcon />
          <span
            css={css`
              font-size: 20px;
              font-weight: 500;
            `}
          >
            &nbsp;My boost :&nbsp;
          </span>
          <QuestionIcon />
        </div>
        <div
          className="gt"
          css={css`
            font-weight: 900;
            font-size: 20px;
          `}
        >
          1.5579 → 2.5
        </div>
      </div>
      <div className="overview">
        <span>Expected earnings</span>
        <span>=201 veKRAV</span>
      </div>
      <div
        css={css`
          text-align: end;
          margin-bottom: 12px;
        `}
      >
        ≈201,256 KRAV (APR:2563.25%)
      </div>
      <div className="overview">
        <span>Your voting power will be</span>
        <span>≈201 veKRAV (Share:25.25%)</span>
      </div>
      <div className="overview">
        <span>Locked amount</span>
        <span>235 KRAV</span>
      </div>
      <div className="overview">
        <span>Locked until</span>
        <span>Sep 21, 2021 08:30 AM UTC </span>
      </div>
      <KRAVButton onClick={() => setShowTip(!showTip)} sx={{ mt: '20px' }}>
        Lock & Mint
      </KRAVButton>
      <div
        css={css`
          position: relative;
        `}
      >
        {showTip && (
          <div
            css={css`
              color: #db4c40;
              position: absolute;
              top: 10px;
            `}
          >
            You can extend a lock and add $CRV to it at any point but you cannot have $CRV with different expiry dates.
          </div>
        )}
      </div>
    </div>
  )
}
