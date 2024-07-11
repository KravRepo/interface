import { Box } from '@mui/material'
import MarqueeTop from '../components/Points/MarqueeTop'
import PointsPanels from '../components/Points/Panels'

export default function Points() {
  return (
    <Box sx={{ maxWidth: '1200px', margin: 'auto', padding: '20px 20px 100px' }}>
      <MarqueeTop />
      <PointsPanels />
    </Box>
  )
}
