import { styled } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import { ReactComponent as SearchIcon } from '../../assets/imgs/searchIcon.svg'
import { StandardTextFieldProps } from '@mui/material/TextField/TextField'
import KRAVTextField from './KravTextField'

interface KARVSearchTextFieldProps extends StandardTextFieldProps {
  onClear?: () => void
  adornment?: string
}

const KARVSearchTextField = styled(({ children, onClear, adornment, ...rest }: KARVSearchTextFieldProps) => {
  return (
    <KRAVTextField
      autoComplete={'off'}
      InputProps={
        adornment === 'start'
          ? {
              startAdornment:
                rest.value && typeof onClear === 'function' ? (
                  <InputAdornment position="end">
                    <img
                      src="/img/collection_icon_search_delete.svg"
                      className="h-5 w-5 cursor-pointer"
                      alt=""
                      onClick={() => {
                        onClear()
                      }}
                    />
                  </InputAdornment>
                ) : (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
            }
          : {
              endAdornment:
                rest.value && typeof onClear === 'function' ? (
                  <InputAdornment position="end">
                    <img
                      src="/img/collection_icon_search_delete.svg"
                      alt=""
                      onClick={() => {
                        onClear()
                      }}
                    />
                  </InputAdornment>
                ) : (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
            }
      }
      {...rest}
    >
      {children}
    </KRAVTextField>
  )
})(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    height: '40px',
    minWidth: '320px',
    '&.Mui-focused fieldset,&:hover fieldset': {
      border: '2px solid !important',
      // borderColor: `${theme['inputBox'].hoverBorderColor} !important`,
    },
  },
}))

export default KARVSearchTextField
