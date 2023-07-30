import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

const KRAVMenuButton = styled(Button)(({ theme }) => ({
  whiteSpace: 'nowrap',
  fontFamily: 'Inter',
  justifyContent: 'start',
  fontWeight: 500,
  color: '#000',
  textTransform: 'none',
  width: '100%',
  borderRadius: '8px',
  padding: '0 20px',
  height: '56px',
  fontSize: '16px',
  ' > span': {
    marginLeft: '12px',
  },
  '&:hover': {
    background: '#F6F6F6',
  },
  '&:active': {
    background: '#F6F6F6',
  },
  '& .MuiTouchRipple-root': {
    color: 'white',
  },
}))

export default KRAVMenuButton
