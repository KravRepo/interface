import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

const KRAVButton = styled(Button)(({ theme }) => ({
  whiteSpace: 'nowrap',
  textTransform: 'none',
  width: '100%',
  fontFamily: 'Inter',
  color: '#fff',
  background: '#000000',
  borderRadius: '4px',
  padding: '10px 16px',
  height: '40px',
  fontSize: '14px',
  '&:hover': {
    background: '#757575',
  },
  '&:active': {
    background: '#000000',
  },
  '&.Mui-disabled': {
    background: '#dadada',
    color: '#fff',
    cursor: 'not-allowed',
    pointerEvents: 'auto',
  },
  '& .MuiTouchRipple-root': {
    color: 'white',
  },
}))

export default KRAVButton
