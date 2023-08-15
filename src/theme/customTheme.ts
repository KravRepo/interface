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
    defaultBg: '#000',
    hoverBg: '#757575',
    activeBg: '#6ed394',
    disableBg: '#dadada',
    defaultText: '#ffffff',
    disableText: '#ffffff',
  },
  hollowButton: {
    border: '1px solid #2e2e2e',
    background: '#ffffff',
    text: '#2e2e2e',
    hoverBg: '#2e2e2e',
    disableBg: '#dadada',
    disableText: '#ffffff',
    hoverText: '#ffffff',
  },
  longButton: {
    background: '#009B72',
    text: '#ffffff',
    hoverBg: '#077054',
    disableBg: '#dadada',
    disableText: '#ffffff',
    hoverText: '#ffffff',
  },
  shortButton: {
    background: '#DB4C40',
    text: '#ffffff',
    hoverBg: '#C3352A',
    disableBg: '#dadada',
    disableText: '#ffffff',
    hoverText: '#ffffff',
  },
  splitLine: {
    primary: '1px solid #dadada',
  },
  text: {
    primary: '#000000',
    second: '#757575',
    third: '#999999',
  },
  background: {
    primary: '#ffffff',
    second: '#f6f6f6',
    third: '#000000',
    fourth: '#ffffff',
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
    defaultBg: '#2832F5',
    hoverBg: '#6d75ff',
    activeBg: '#ccfac3',
    disableBg: '#393D46',
    defaultText: '#dedede',
    disableText: '#4b4b4b',
  },
  hollowButton: {
    border: '1px solid #727272',
    background: 'transparent',
    text: '#dedede',
    hoverBg: '#4b4b4b',
    disableBg: '#1c1e23',
    disableText: '#4b4b4b',
    hoverText: '#f6f6f6',
  },
  longButton: {
    background: '#009B72',
    text: '#ffffff',
    hoverBg: '#077054',
    disableBg: '#393D46',
    disableText: '#4B4B4B',
    hoverText: '#ffffff',
  },
  shortButton: {
    background: '#DB4C40',
    text: '#ffffff',
    hoverBg: '#C3352A',
    disableBg: '#393D46',
    disableText: '#4B4B4B',
    hoverText: '#ffffff',
  },
  splitLine: {
    primary: '1px solid #727272',
  },
  text: {
    primary: '#dedede',
    second: '#B3B3B3',
    third: '#727272',
  },
  background: {
    primary: '#1c1e23',
    second: '#0f1114',
    third: '#4B4B4B',
    fourth: '#0f1114',
  },
})
