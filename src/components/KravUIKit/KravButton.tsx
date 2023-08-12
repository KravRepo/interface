import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

const KRAVButton = styled(Button)(({ theme }) => ({
  whiteSpace: 'nowrap',
  textTransform: 'none',
  width: '100%',
  fontFamily: 'Inter',
  color: theme.button.defaultText,
  background: theme.button.defaultBg,
  borderRadius: '4px',
  padding: '10px 16px',
  height: '40px',
  fontSize: '14px',
  '&:hover': {
    background: theme.button.hoverBg,
  },
  // '&:active': {
  //   background: '#000000',
  // },
  '&.Mui-disabled': {
    background: theme.button.disableBg,
    color: theme.button.disableText,
    cursor: 'not-allowed',
    pointerEvents: 'auto',
  },
  '& .MuiTouchRipple-root': {
    color: 'white',
  },
}))

export default KRAVButton
