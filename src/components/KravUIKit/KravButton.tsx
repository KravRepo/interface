import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

const KRAVButton = styled(Button)(({ theme }) => ({
  whiteSpace: 'nowrap',
  textTransform: 'none',
  width: '100%',
  color: '#fff',
  background: '#000000',
  borderRadius: '4px',
  padding: '10px 16px',
  height: '40px',
  fontSize: '14px',
  '&:hover': {
    background: '#000000',
  },
  '&:active': {
    background: '#000000',
  },
  '&.Mui-disabled': {
    background: theme['button'].disableBg,
    color: theme['button'].disableText,
  },
  '& .MuiTouchRipple-root': {
    color: 'white',
  },
}))

export default KRAVButton
