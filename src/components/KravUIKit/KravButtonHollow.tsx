import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

const KravButtonHollow = styled(Button)(({ theme }) => ({
  whiteSpace: 'nowrap',
  textTransform: 'none',
  width: '100%',
  fontFamily: 'Inter',
  borderRadius: '4px',
  padding: '10px 16px',
  height: '40px',
  fontSize: '14px',
  backgroundColor: theme.hollowButton.background,
  border: theme.hollowButton.border,
  color: theme.hollowButton.text,
  '&:hover': {
    backgroundColor: theme.hollowButton.hoverBg,
    color: theme.hollowButton.hoverText,
  },
  '& .MuiTouchRipple-root': {
    color: 'white',
  },
}))

export default KravButtonHollow
