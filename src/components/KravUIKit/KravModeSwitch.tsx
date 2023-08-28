import { styled } from '@mui/material/styles'
import { Switch } from '@mui/material'
import SwitchDarkIcon from '../../assets/imgs/darkModel/theme_Switch_dark_icon.svg'
import SwitchIcon from '../../assets/imgs/theme_icon_light.svg'

export const KravModeSwitch = styled(Switch)(({ theme }) => ({
  width: 50,
  height: 28,
  padding: 0,
  borderRadius: '18px',
  '& .MuiSwitch-switchBase': {
    margin: '2px 0 0 0',
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url(${theme.palette.mode === 'dark' ? SwitchDarkIcon : SwitchIcon})`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#0F1114' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#ffffff',
    width: 24,
    height: 24,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#0F1114' : '#aab4be',
    borderRadius: 20 / 2,
  },
}))
