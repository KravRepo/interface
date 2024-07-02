'use client'
import { Box } from '@mui/material'
// @ts-ignore
import marquee_url from '../../assets/points/marquee_top.svg'
import marquee_mobile_url from '../../assets/points/marquee_top_mobile.svg'
import { AnimatedBox } from './AnimatedBox'
import { HideOnMobile, ShowOnMobile } from '../utils'

export default function MarqueeTop() {
  return (
    <Box
      display="flex"
      flexDirection={'column'}
      alignItems={'center'}
      px={{ xs: '24px', md: '40px', lg: '120px' }}
      py={{ xs: '28px', md: '3rem' }}
      gap={{ xs: 42, sm: 62, md: 100 }}
    >
      <Box
        sx={{
          border: '1px solid #000000',
          borderRadius: '60px',
          background: '#2832F5',
          py: { xs: '18px', md: '20px' },
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <ShowOnMobile>
          <AnimatedBox sx={{ top: '6px', left: 0 }}>
            <Box display="flex" sx={{ '& *': { marginLeft: '20px' } }}>
              {Array.from(Array(6).keys()).map((_, idx) => (
                <img src={marquee_mobile_url} alt="" key={idx} />
              ))}
            </Box>
          </AnimatedBox>
        </ShowOnMobile>
        <HideOnMobile>
          <AnimatedBox sx={{ top: '2px', left: 0 }}>
            <Box
              display="flex"
              sx={{
                '& *': {
                  marginLeft: '20px',
                },
                '& img': {
                  height: '35px',
                },
              }}
            >
              {Array.from(Array(6).keys()).map((_, idx) => (
                <img src={marquee_url} alt="" key={idx} />
              ))}
            </Box>
          </AnimatedBox>
        </HideOnMobile>
      </Box>
    </Box>
  )
}
