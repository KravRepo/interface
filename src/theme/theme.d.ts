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
    hollowButton: {
      border: string,
      background: string,
      text: string,
      hoverBg: string,
      disableBg: string,
      disableText: string,
      hoverText: string,
    }
    longButton: {
      background: string,
      text: string,
      hoverBg: string,
      disableBg: string,
      disableText: string,
      hoverText: string,
    }
    shortButton: {
      background: string,
      text: string,
      hoverBg: string,
      disableBg: string,
      disableText: string,
      hoverText: string,
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
    splitLine: {
      primary: string,
    }
    text: {
      primary: string
      second: string
      third: string
    }
    background: {
      primary: string,
      second: string,
      third: string,
      fourth: string,
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
    hollowButton: {
      border: string,
      background: string,
      text: string,
      hoverBg: string,
      disableBg: string,
      disableText: string,
      hoverText: string,
    }
    longButton: {
      background: string,
      text: string,
      hoverBg: string,
      disableBg: string,
      disableText: string,
      hoverText: string,
    }
    shortButton: {
      background: string,
      text: string,
      hoverBg: string,
      disableBg: string,
      disableText: string,
      hoverText: string,
    }
    splitLine: {
      primary: string,
    }
    text: {
      primary: string
      second: string
      third: string
    }
    background: {
      primary: string
      second: string
      third: string
      fourth: string
    }
  }
}
