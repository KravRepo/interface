/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useState } from 'react'
import { headerBtn } from './sytle'
import { Button, Menu, MenuItem, css, useTheme } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useLingui } from '@lingui/react'
import { align } from '../../globalStyle'
import { LOCALES, activateLocale, locales } from '../../constant/locales'

export function LocaleSwitch() {
  const theme = useTheme()
  const { i18n } = useLingui()

  const [localeAnchorEl, setLocaleAnchorEl] = useState<null | HTMLElement>(null)

  const localeMenuOpen = useMemo(() => {
    return Boolean(localeAnchorEl)
  }, [localeAnchorEl])

  useEffect(() => {
    activateLocale('en-US')
  }, [])

  const handleLocaleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLocaleAnchorEl(event.currentTarget)
  }

  const handleLocaleClose = () => {
    setLocaleAnchorEl(null)
  }

  const changeLocale = async (locale: string) => {
    await activateLocale(locale)
    handleLocaleClose()
  }

  return (
    <>
      <Button
        css={headerBtn}
        sx={{
          color: '#ffffff',
          borderRadius: '4px',
          border: theme.palette.mode === 'dark' ? '1px solid #4B4B4B' : '1px solid #DADADA',
          textTransform: 'none',
          minWidth: '60px',
          marginRight: '10px',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? '#4B4B4B' : '#DADADA',
          },
        }}
        endIcon={
          localeMenuOpen ? (
            <KeyboardArrowUpIcon sx={{ color: theme.palette.mode === 'dark' ? '#dedede' : '' }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ color: theme.palette.mode === 'dark' ? '#dedede' : '' }} />
          )
        }
        id="network-button"
        aria-controls={localeMenuOpen ? 'network-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={localeMenuOpen ? 'true' : undefined}
        onClick={handleLocaleClick}
      >
        {LOCALES[(i18n.locale ? i18n.locale : 'en-US') as keyof typeof LOCALES]}
      </Button>
      <Menu
        sx={{
          '& .MuiPaper-root': {
            minWidth: 220,
          },
        }}
        id="network-menu"
        anchorEl={localeAnchorEl}
        open={localeMenuOpen}
        onClose={handleLocaleClose}
        MenuListProps={{
          'aria-labelledby': 'network-button',
        }}
      >
        {Object.keys(locales).map((key) => (
          <MenuItem key={key} sx={{ width: '100%' }} onClick={() => changeLocale(key)}>
            <div
              css={css`
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
              `}
            >
              <div css={align}>
                <span
                  css={css`
                    margin-left: 12px;
                  `}
                >
                  {LOCALES[key as keyof typeof LOCALES]}
                </span>
              </div>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
