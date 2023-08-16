import { styled } from '@mui/material/styles'
import { Typography } from '@mui/material'

const KRAVTab = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? theme.text.primary : '#fff',
  background: theme.palette.mode === 'dark' ? '#2832f5' : '#a4a8fe',
  padding: '2px 8px',
  borderRadius: '100px',
  fontSize: '14px',
  width: 'fit-content',
  whiteSpace: 'nowrap',
}))

export default KRAVTab
