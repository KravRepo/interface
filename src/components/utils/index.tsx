import { styled } from '@mui/material'

export const HideOnMobile = styled('div', {
  shouldForwardProp: () => true,
})<{ breakpoint?: 'sm' | 'md' }>(({ theme, breakpoint }) => ({
  [theme.breakpoints.down(breakpoint ?? 'md')]: {
    display: 'none',
  },
}))

export const ShowOnMobile = styled('div', {
  shouldForwardProp: () => true,
})<{ breakpoint?: 'sm' | 'md' }>(({ theme, breakpoint }) => ({
  display: 'none',
  [theme.breakpoints.down(breakpoint ?? 'md')]: {
    display: 'block',
  },
}))
