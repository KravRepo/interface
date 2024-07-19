import React from 'react'
import { Box, SxProps, Theme } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import useCopyClipboard from '../../hook/useCopyClipboard'

interface Props {
  toCopy: string
  children?: React.ReactNode
  sx?: SxProps<Theme>
  height?: string
  margin?: string
  svgColor?: string
  svgWidth?: number
  CopySvg?: React.ReactNode
}

export default function Copy(props: Props) {
  const [isCopied, setCopied] = useCopyClipboard()
  const { toCopy, children, sx, margin, svgColor, CopySvg, svgWidth, height } = props

  return (
    <Box
      sx={{
        display: 'flex',
        cursor: 'pointer',
        height: height ?? '17px',
        alignItems: 'center',
        '& svg': {
          width: svgWidth ?? 14,
          margin: margin ?? ' 0 10px 0 0',
          path: {
            fill: svgColor ?? 'var(--ps-neutral3)',
          },
        },
        ...sx,
      }}
      onClick={() => setCopied(toCopy)}
    >
      {isCopied ? (
        <CheckIcon sx={{ opacity: 0.6, fontSize: 16 }} />
      ) : (
        CopySvg ?? (
          <svg width="20" height="20" viewBox="0 0 14 14" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.25 7.58333C5.25 6.29467 6.29467 5.25 7.58333 5.25H10.5C11.7887 5.25 12.8333 6.29467 12.8333 7.58333V10.5C12.8333 11.7887 11.7887 12.8333 10.5 12.8333H7.58333C6.29467 12.8333 5.25 11.7887 5.25 10.5V7.58333ZM7.58333 6.41667C6.939 6.41667 6.41667 6.939 6.41667 7.58333V10.5C6.41667 11.1443 6.939 11.6667 7.58333 11.6667H10.5C11.1443 11.6667 11.6667 11.1443 11.6667 10.5V7.58333C11.6667 6.939 11.1443 6.41667 10.5 6.41667H7.58333Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.16699 3.49996C1.16699 2.21129 2.21166 1.16663 3.50033 1.16663H6.41699C7.70566 1.16663 8.75033 2.21129 8.75033 3.49996V3.62149C8.75033 3.94365 8.48916 4.20482 8.16699 4.20482C7.84483 4.20482 7.58366 3.94365 7.58366 3.62149V3.49996C7.58366 2.85563 7.06132 2.33329 6.41699 2.33329H3.50033C2.85599 2.33329 2.33366 2.85563 2.33366 3.49996V6.41663C2.33366 7.06096 2.85599 7.58329 3.50033 7.58329H3.62185C3.94402 7.58329 4.20519 7.84446 4.20519 8.16663C4.20519 8.48879 3.94402 8.74996 3.62185 8.74996H3.50033C2.21166 8.74996 1.16699 7.70529 1.16699 6.41663V3.49996Z"
              fill="white"
            />
          </svg>
        )
      )}
      {children}
    </Box>
  )
}
