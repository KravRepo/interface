/** @jsxImportSource @emotion/react */
import { ReactComponent as KravToken } from '../../../assets/imgs/krav_token.svg'
import { Checkbox, Slider, TextField, useTheme } from '@mui/material'
import { css } from '@emotion/react'
import KRAVButton from '../../KravUIKit/KravButton'
import { align } from '../../../globalStyle'
import { ChangeEvent, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { formatNumber, getBigNumberStr } from '../../../utils'
import { UserLockPosition } from '../../../hook/hookV8/useGetUserKravLock'
import { useCreatLock } from '../../../hook/hookV8/useCreatLock'
import { addDecimals } from '../../../utils/math'
import { useAddLockAmount } from '../../../hook/hookV8/useAddLockAmount'
import { IncreaseUnlockTimeButton } from './IncreaseUnlockTimeButton'
import moment from 'moment'
import { getLockTime } from '../../../hook/hookV8/utils/utils'
import { OverviewData } from '../../../hook/hookV8/useGetTotalMarketOverview'
import { FOUR_YEAR_TIMESTAMP, ONE_DAY_TIMESTAMP } from '../../../constant/math'

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

type LockActionProp = {
  userKravBalance: BigNumber
  userLockPosition: UserLockPosition
  currentUserBooster: BigNumber
  userLiquidityProvided: number
  overviewData: OverviewData
  userVeKravAmount: BigNumber
  totalVeKravAmount: BigNumber
}

enum LockButtonText {
  LOCK = 'Lock & Mint',
  INSUFFICIENT_BALANCE = 'Insufficient Balance',
  INVALID = 'Invalid number',
}

export const LockAction = ({
  userKravBalance,
  userLockPosition,
  currentUserBooster,
  userLiquidityProvided,
  overviewData,
  userVeKravAmount,
  totalVeKravAmount,
}: LockActionProp) => {
  const theme = useTheme()
  const [showTip] = useState(false)
  const [lockTime, setLockTime] = useState(1)
  const [lockAmount, setLockAmount] = useState(new BigNumber(0))
  const [buttonText, setButtonText] = useState(LockButtonText.LOCK)
  const [increaseUnlockTime, setIncreaseUnlockTime] = useState(true)
  const creatLock = useCreatLock()
  const addLockAmount = useAddLockAmount()
  const handleLockAmountInput = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newValue = new BigNumber(event.target.value)
    setLockAmount(newValue)
  }
  const handleLockTimeChange = (event: Event, value: number | number[], activeThumb: number) => {
    setLockTime(value as number)
  }

  const lockButtonEnable = useMemo(() => {
    if (lockAmount.isGreaterThan(userKravBalance)) {
      setButtonText(LockButtonText.INSUFFICIENT_BALANCE)
      return false
    }
    if (!lockAmount.isGreaterThan(0)) {
      setButtonText(LockButtonText.INVALID)
      return false
    }
    setButtonText(LockButtonText.LOCK)
    return true
  }, [lockAmount, userKravBalance])

  const newLockTime = useMemo(() => {
    if (!increaseUnlockTime) {
      return userLockPosition.end
    } else {
      const nowTimestamp = (Math.floor(new Date().getTime() / ONE_DAY_TIMESTAMP) * ONE_DAY_TIMESTAMP) / 1000
      const forMatterTime = getLockTime(lockTime) / 1000
      return nowTimestamp + forMatterTime
    }
  }, [lockTime, increaseUnlockTime])

  const lockPeriod = useMemo(() => {
    switch (lockTime) {
      case 1:
        return '6 months'
      case 2:
        return '1 year'
      case 3:
        return '2 years'
      case 4:
        return '4 years'
      default:
        return '6 months'
    }
  }, [lockTime])

  const expectedVeAmount = useMemo(() => {
    const nowTimestamp = Number((new Date().getTime() / 1000).toFixed(0))
    if (userLockPosition.end > 0 && !increaseUnlockTime) {
      const diff = userLockPosition.end - nowTimestamp
      const timeIndex = new BigNumber(diff).times(1000).div(FOUR_YEAR_TIMESTAMP)
      return lockAmount.times(timeIndex)
    } else if (userLockPosition.end > 0 && increaseUnlockTime) {
      const diff = newLockTime - nowTimestamp
      const timeIndex = new BigNumber(diff).times(1000).div(FOUR_YEAR_TIMESTAMP)
      const lockedAmountIncrease = newLockTime - userLockPosition.end > 0 ? newLockTime - userLockPosition.end : 0
      const lockedAmountIncreaseTime = (lockedAmountIncrease * 1000) / FOUR_YEAR_TIMESTAMP
      return lockAmount.times(timeIndex).plus(userLockPosition.amount.times(lockedAmountIncreaseTime))
    } else {
      const forMatterLockTime = getLockTime(lockTime)
      const timeIndex = forMatterLockTime / FOUR_YEAR_TIMESTAMP
      return lockAmount.times(timeIndex)
    }
  }, [lockTime, lockAmount, userLockPosition, newLockTime, increaseUnlockTime])

  return (
    <div>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          @media screen and (max-width: 1200px) {
            display: block;
          }
        `}
      >
        <div className="title gt">KRAV Locking Amount</div>
        <div>Available: {formatNumber(userKravBalance.toString(), 2, false)} KRAV</div>
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
            &nbsp;&nbsp;
          </span>
        </div>
        <TextField
          variant="standard"
          type="number"
          value={lockAmount}
          onChange={handleLockAmountInput}
          InputProps={{
            disableUnderline: true,
          }}
          sx={{
            mx: '10px',
            height: '37px',
            minHeight: '32px',
            '> div': {
              '> input': {
                fontSize: '20px',
                fontWeight: '500',
                fontFamily: 'Inter',
                textAlign: 'end',
              },
            },
            '& .MuiOutlinedInput-root': {
              height: '37px',
              minHeight: '32px',
              padding: 0,
              textAlign: 'end',
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
            onClick={() => {
              setLockAmount(userKravBalance)
            }}
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
      {userLockPosition.amount.isEqualTo(0) && (
        <div>
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
              Locking Period
            </span>
            <span>1 year</span>
          </div>
          <Slider
            defaultValue={1}
            step={1}
            min={1}
            max={4}
            marks={marks}
            value={lockTime}
            onChange={handleLockTimeChange}
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
        </div>
      )}
      {userLockPosition.amount.isGreaterThan(0) && (
        <div
          css={css`
            margin-bottom: 24px;
            text-align: end;
          `}
        >
          <Checkbox
            checked={increaseUnlockTime}
            onChange={() => setIncreaseUnlockTime(!increaseUnlockTime)}
            sx={{
              padding: 0,
              '&.Mui-checked': {
                color: theme.palette.mode === 'dark' ? '#2832f5' : '#000',
              },
            }}
          />{' '}
          Increase unlock time
        </div>
      )}
      {userLockPosition.amount.isGreaterThan(0) && increaseUnlockTime && (
        <>
          <div>
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
              <span>{lockPeriod}</span>
            </div>
            <Slider
              defaultValue={1}
              step={1}
              min={1}
              max={4}
              marks={marks}
              value={lockTime}
              onChange={handleLockTimeChange}
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
          </div>
        </>
      )}
      <div
        css={css`
          padding-top: 31px;
          padding-bottom: 39px;
        `}
      >
        Extend your KRAV lock duration or add more KRAV to maximize your veKRAV rewards
      </div>
      <div className="overview">
        <span>Expected earnings</span>
        <span>≈ {getBigNumberStr(expectedVeAmount, 2)} veKRAV</span>
      </div>
      {/*<div*/}
      {/*  css={css`*/}
      {/*    text-align: end;*/}
      {/*    margin-bottom: 12px;*/}
      {/*  `}*/}
      {/*>*/}
      {/*  ≈201,256 KRAV (APR:2563.25%)*/}
      {/*</div>*/}
      {/*<div className="overview">*/}
      {/*  <span>Your voting power will be</span>*/}
      {/*  <span>≈201 veKRAV (Share:25.25%)</span>*/}
      {/*</div>*/}
      <div className="overview">
        <span>Locked until</span>
        <span>
          {' '}
          {moment(newLockTime * 1000)
            .utc()
            .format('MMM DD, YYYY HH:mm A')}{' '}
          &nbsp;UTC
        </span>
      </div>
      {userLockPosition.amount.isEqualTo(0) && userLockPosition.end === 0 && (
        <KRAVButton
          disabled={!lockButtonEnable}
          onClick={() => creatLock(addDecimals(lockAmount, 18), lockTime)}
          sx={{ mt: '20px' }}
        >
          {buttonText}
        </KRAVButton>
      )}
      {!increaseUnlockTime && userLockPosition.amount.isGreaterThan(0) && (
        <KRAVButton
          disabled={!lockButtonEnable}
          onClick={() => addLockAmount(addDecimals(lockAmount, 18))}
          sx={{ mt: '20px' }}
        >
          {buttonText}
        </KRAVButton>
      )}
      {increaseUnlockTime && userLockPosition.amount.isGreaterThan(0) && (
        <IncreaseUnlockTimeButton
          lockAmount={lockAmount}
          lockTime={lockTime}
          userKravBalance={userKravBalance}
          userPositionUnLockTime={userLockPosition.end}
        />
      )}
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
