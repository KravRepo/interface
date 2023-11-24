/** @jsxImportSource @emotion/react */
import { Dialog, DialogContent, SwipeableDrawer, useMediaQuery, useTheme } from '@mui/material'
import { css } from '@emotion/react'

type DialogLayoutProps = {
  isOpen: boolean
  setIsOpen: (isOpenSelectToken: boolean) => void
  children: JSX.Element
}

export const DialogLayout = ({ isOpen, setIsOpen, children }: DialogLayoutProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  return (
    <>
      {!isMobile && (
        <Dialog
          sx={{
            '.MuiDialog-paper': {
              width: '440px',
              borderRadius: '8px',
              background: theme.background.primary,
            },
          }}
          open={isOpen}
        >
          <DialogContent sx={{ padding: 0, color: theme.text.primary }}>{children}</DialogContent>
        </Dialog>
      )}
      {isMobile && (
        <SwipeableDrawer
          sx={{
            '& .MuiPaper-root': {
              borderRadius: '8px 8px 0px 0px',
            },
          }}
          onOpen={() => console.log('open')}
          anchor={'bottom'}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div
            css={css`
              display: flex;
              justify-content: center;
              padding-top: 16px;
            `}
          >
            <div
              css={css`
                width: 96px;
                border: ${theme.splitLine.primary};
              `}
            />
          </div>
          {children}
        </SwipeableDrawer>
      )}
    </>
  )
}
