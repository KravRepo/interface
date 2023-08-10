import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

const KRAVShortButton = styled(Button)(({ theme }) => ({
  whiteSpace: 'nowrap',
  textTransform: 'none',
  width: '100%',
  fontFamily: 'Inter',
  color: '#fff',
  background: '#DB4C40',
  borderRadius: '4px',
  padding: '10px 16px',
  height: '40px',
  fontSize: '14px',
  '&:hover': {
    backgroundColor: '#C3352A',
  },
  '&:active': {
    background: '#C3352A',
  },
  '&.Mui-disabled': {
    background: theme.shortButton.disableBg,
    color: theme.shortButton.disableText,
    cursor: 'not-allowed',
    pointerEvents: 'auto',
  },
  '& .MuiTouchRipple-root': {
    color: 'white',
  },
}))

export default KRAVShortButton
