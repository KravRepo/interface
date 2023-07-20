import { createTheme } from '@mui/material'

export const lightTheme = createTheme({
  typography: {
    button: {
      textTransform: 'none',
    },
  },
  palette: {
    mode: 'light',
  },
  button: {
    defaultBg: '#6ed394',
    hoverBg: '#2fc77d',
    activeBg: '#6ed394',
    disableBg: '#f0f0f0',
    defaultText: '#ffffff',
    disableText: '#999999',
  },
  card: {
    border: '',
    borderSecond: '1px solid #F0F0F0',
    backgroundPrimary: 'white',
    backgroundSecond: '#ffffff',
    backgroundThird: '#ffffff',
    backgroundFourth: '#fafafa',
    splitLine: '1px solid #DADADA',
  },
  text: {
    primary: '#000000',
    second: '#666666',
    third: '#999999',
  },
})

export const darkTheme = createTheme({
  typography: {
    button: {
      textTransform: 'none',
    },
  },
  palette: {
    mode: 'dark',
  },
  button: {
    defaultBg: '#b2f9ad',
    hoverBg: '#bef0b4',
    activeBg: '#ccfac3',
    disableBg: '#2d353d',
    defaultText: '#000000',
    disableText: '#b3b3b3',
  },

  card: {
    border: '1px solid #2D3833',
    borderSecond: '1px solid #2D3833',
    backgroundPrimary: '#1B1E24',
    backgroundSecond: '#2E353D',
    backgroundThird: '#22282E',
    backgroundFourth: '#22282E',
    splitLine: '1px solid #313836',
  },
  text: {
    primary: '#FFFFFF',
    second: '#B3B3B3',
    third: '#CCCCCC',
  },
})
