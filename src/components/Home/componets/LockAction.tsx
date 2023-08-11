/** @jsxImportSource @emotion/react */
import { ReactComponent as KravToken } from '../../../assets/imgs/krav_token.svg'
import { ReactComponent as BoostIcon } from '../../../assets/imgs/krav_token.svg'
import { ReactComponent as QuestionIcon } from '../../../assets/imgs/question.svg'
import { Slider, TextField, useTheme } from '@mui/material'
import { css } from '@emotion/react'
import KRAVButton from '../../KravUIKit/KravButton'
import { align } from '../../../globalStyle'

export const LockAction = () => {
  const theme = useTheme()
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
      <div>
        <span>Lock Period</span>
        <span>1 year</span>
      </div>
      <Slider
        sx={{
          height: '2px',
          '& .MuiSlider-root': {
            color: '#757575',
          },
          '& .MuiSlider-rail': {
            opacity: 1,
            backgroundColor: theme.palette.mode === 'dark' ? '#727272' : '#DADADA',
          },
          '& .MuiSlider-track': {
            border: 'unset',
            color: theme.palette.mode === 'dark' ? '#2832F5' : '#000000',
          },
          '& .MuiSlider-mark': {
            height: '6px',
            background: theme.palette.mode === 'dark' ? '#727272' : '#DADADA',
          },
          '& .MuiSlider-thumb': {
            height: '10px',
            width: '10px',
            background: theme.palette.mode === 'dark' ? '#2832F5' : '#000000',
          },
          '& .MuiSlider-markActive': {
            background: theme.palette.mode === 'dark' ? '#2832F5' : '#000000',
          },
          '& .MuiSlider-markLabel': {
            fontSize: '12px',
            color: '#757575',
          },
        }}
      />
      <div>
        The longer you lock your KRAV, the more veKRAV you will receive. You can also get additional veKRAV by locking
        more KRAV or extending the lock period.{' '}
      </div>
      <div>
        <div>
          <BoostIcon />
          <span>My boost :</span>
          <QuestionIcon />
        </div>
        <div>1.5579→2.5</div>
      </div>
      <div>
        <span>Expected earnings</span>
        <span>=201 veKRAV</span>
      </div>
      <div>≈201,256 KRAV (APR:2563.25%)</div>
      <div>
        <span>Your voting power will be</span>
        <span>≈201 veKRAV (Share:25.25%)</span>
      </div>
      <div>
        <span>Locked amount</span>
        <span>235 KRAV</span>
      </div>
      <div>
        <span>Locked until</span>
        <span>Sep 21, 2021 08:30 AM UTC </span>
      </div>
      <KRAVButton>Lock & Mint</KRAVButton>
    </div>
  )
}
