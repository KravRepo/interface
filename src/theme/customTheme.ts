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
    primary: '#dadada',
  },
  text: {
    primary: '#000000',
    second: '#757575',
    third: '#999999',
  },
  background: {
    primary: '#ffffff',
    second: '#f6f6f6',
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
    disableBg: '#1c1e23',
    defaultText: '#dedede',
    disableText: '#4b4b4b',
  },
  hollowButton: {
    border: '1px solid #727272',
    background: '#ffffff',
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
    disableBg: '#1c1e23',
    disableText: '#4b4b4b',
    hoverText: '#ffffff',
  },
  shortButton: {
    background: '#DB4C40',
    text: '#ffffff',
    hoverBg: '#C3352A',
    disableBg: '#1c1e23',
    disableText: '#ffffff',
    hoverText: '#ffffff',
  },
  splitLine: {
    primary: '#4b4b4b',
  },
  text: {
    primary: '#dedede',
    second: '#B3B3B3',
    third: '#727272',
  },
  background: {
    primary: '#0f1114',
    second: '#0f1114',
  },
})
