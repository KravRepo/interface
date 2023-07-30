import { styled } from '@mui/material/styles'
import { TextField } from '@mui/material'

const KRAVTextField = styled(TextField)(({ theme }) => ({
  fontFamily: 'Inter',
  '& .MuiOutlinedInput-notchedOutline': {
    // borderColor: `${theme['inputBox'].borderColor} !important`,
  },
  '&.Mui-focused fieldset, &:hover fieldset': {
    // borderColor: `${theme['inputBox'].hoverBorderColor} !important`,
    borderWidth: '2px !important',
  },
  '& .MuiOutlinedInput-root': {
    '& input[type=number]': {
      MozAppearance: 'textfield',
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
  },
}))

export default KRAVTextField
