/** @jsxImportSource @emotion/react */
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { DialogLayout } from '../Dialog/DialogLayout'
import { dialogContent } from '../Dialog/sytle'
import { css } from '@emotion/react'
import { TextField, Typography, useTheme } from '@mui/material'
import MarqueeTop from './MarqueeTop'
import KRAVButton from '../KravUIKit/KravButton'

export default function Gate({
  isOpen,
  setIsOpen,
  verifyReferral,
  errorStr,
}: {
  isOpen: boolean
  setIsOpen?: Dispatch<SetStateAction<boolean>>
  verifyReferral: (inviteCode: string) => Promise<void>
  errorStr: string
}) {
  const theme = useTheme()
  const [code, setCode] = useState('')

  const verify = useCallback(() => {
    verifyReferral(code)
  }, [code, verifyReferral])

  return (
    <DialogLayout isOpen={isOpen} setIsOpen={() => {}} blurBackdrop>
      <>
        (
        <div
          css={[
            dialogContent,
            css`
              padding: 24px;
            `,
          ]}
        >
          <div
            css={css`
              padding: 0;
            `}
          >
            <span
              css={css`
                font-weight: 700;
                font-size: 20px;
              `}
            >
              Enter a referral code
            </span>
          </div>
          <Typography
            fontFamily={'Inter'}
            fontSize={14}
            fontWeight={400}
            lineHeight={'150%'}
            sx={{ marginTop: '16px !important' }}
          >
            {/* <span style={{ fontWeight: 600 }}>{t`Note`}: </span> */}
            <span>Referral code is needed to start gaining points</span>
          </Typography>
          <div
            css={css`
              display: flex;
              align-items: center;
              width: 100%;
              justify-content: space-between;
              margin-top: 24px;
              margin-bottom: 24px;
              padding: 10px 24px;
              background: ${theme.background.third};
              border-radius: 5px;
              gap: 20px;
            `}
          >
            <TextField
              variant="standard"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                background: theme.background.third,
                color: theme.text.primary,
                height: '100%',
                fontSize: '20px',
                minHeight: '28px',
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  height: '28px',
                  minHeight: '28px',
                  padding: 0,
                },
              }}
            />{' '}
            <KRAVButton style={{ width: 'max-content' }} disabled={!code} onClick={verify}>
              Verify
            </KRAVButton>
          </div>
          {errorStr && <Typography color="error"> {errorStr}</Typography>}
          <div
            css={css`
              margin-top: -20px;
            `}
          >
            <MarqueeTop />
          </div>
        </div>
        )
      </>
    </DialogLayout>
  )
}
