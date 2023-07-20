/* eslint-disable */
import { Theme, ThemeOptions } from '@mui/material/styles'
declare module '@mui/material/styles' {
  interface Theme {
    button: {
      defaultBg: string
      hoverBg: string
      activeBg: string
      disableBg: string
      defaultText: string
      disableText: string
    }
    card: {
      border: string
      borderSecond: string
      backgroundPrimary: string
      backgroundSecond: string
      backgroundThird: string
      backgroundFourth: string
      splitLine: string
    }
    text: {
      primary: string
      second: string
      third: string
    }
  }

  interface ThemeOptions {
    button: {
      defaultBg: string
      hoverBg: string
      activeBg: string
      disableBg: string
      defaultText: string
      disableText: string
    }
    card: {
      border: string
      borderSecond: string
      backgroundPrimary: string
      backgroundSecond: string
      backgroundThird: string
      backgroundFourth: string
      splitLine: string
    }
    text: {
      primary: string
      second: string
      third: string
    }
  }
}
