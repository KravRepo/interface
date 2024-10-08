/** @jsxImportSource @emotion/react */
import { useMediaQuery, useTheme } from '@mui/material'
import { dialogContent } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { useRootStore } from '../../store/root'
import { css } from '@emotion/react'
import { NavLink } from 'react-router-dom'
import { SelectTokenItem } from './SelectTokenItem'
import { DialogLayout } from './DialogLayout'
import { t } from '@lingui/macro'

type SelectTokenProps = {
  isOpen: boolean
  setIsOpen: (isOpenSelectToken: boolean) => void
}

export const SelectToken = ({ isOpen, setIsOpen }: SelectTokenProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const allPoolParams = useRootStore((state) => state.allPoolParams)

  for (let i = 0; i < allPoolParams.length; i++) {
    if (allPoolParams[i].symbol === 'ROOST') {
      allPoolParams[i].logoSource = 'https://random-stuff-mine.s3.amazonaws.com/roost.png'
    }

    if (allPoolParams[i].symbol === 'weETH') {
      allPoolParams[i].logoSource = 'https://krav-assets.s3.amazonaws.com/WebP+to+PNG+conversion.png'
    }

    if (allPoolParams[i].symbol === 'MIGGLES') {
      allPoolParams[i].logoSource = 'https://krav-assets.s3.amazonaws.com/miggles.png'
    }
  }

  return (
    <DialogLayout isOpen={isOpen} setIsOpen={setIsOpen} zIndex={1201}>
      <div css={dialogContent}>
        <div
          className="select-token-header"
          css={css`
            border-bottom: ${theme.splitLine.primary};
            font-size: ${isMobile ? '18px' : '20px'};
          `}
        >
          <div>
            <span>Select a token</span>
            <CloseSharpIcon sx={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
          </div>
        </div>
        <div
          className="select-token-list"
          css={css`
            border-bottom: ${theme.splitLine.primary};
            > div {
              :hover {
                background: ${theme.palette.mode === 'dark' ? '#4B4B4B' : '#f6f6f6'};
              }
            }
          `}
        >
          {allPoolParams.length > 0 &&
            allPoolParams.map((pool) => {
              return <SelectTokenItem pool={pool} setIsOpen={setIsOpen} key={pool.tradingT} />
            })}
        </div>

        <div
          css={css`
            padding: 24px 64px;
            text-align: center;
          `}
        >
          <span>{t`Can not find the target asset you want to trade?`} &nbsp;</span>
          <NavLink
            to={'/liquidity'}
            css={css`
              color: ${theme.palette.mode === 'dark' ? theme.text.primary : ''};
            `}
          >
            <span>{t`Come create one!`}</span>
          </NavLink>
        </div>
      </div>
    </DialogLayout>
  )
}
