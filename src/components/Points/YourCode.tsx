import { Box, Stack, Typography, useTheme } from '@mui/material'
import { referralInitData } from '../../hook/useReferral'
import Copy from '../Copy'

export default function YourCode({ referralData }: { referralData: referralInitData }) {
  const theme = useTheme()
  return (
    <Stack mb={'20px'}>
      <Box
        sx={{
          background: theme.background.second,
          borderRadius: '20px',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Typography fontWeight={700} fontSize={'20px'}>
          My Referral Code:{' '}
        </Typography>
        <Typography fontSize={'30px'} component={'span'}>
          {' '}
          {referralData?.code}
        </Typography>
        <Copy toCopy={referralData?.code} />
      </Box>
    </Stack>
  )
}
