import { ThemeProvider, createTheme } from '@mui/material/styles'

export const FONTS = {
  primary: ['"Inter"', 'Arial', 'sans-serif'].join(','),
}
const defaultTheme = createTheme()
export const theme = createTheme({
  ...defaultTheme,
  typography: {
    fontFamily: FONTS.primary,
  },
})

export default function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
