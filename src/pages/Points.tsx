import { Box, Skeleton } from '@mui/material'
import MarqueeTop from '../components/Points/MarqueeTop'
import PointsPanels from '../components/Points/Panels'
import Gate from '../components/Points/Gate'
import { useEffect, useState } from 'react'
import { useReferral } from '../hook/useReferral'
import { DialogLayout } from '../components/Dialog/DialogLayout'
import YourCode from '../components/Points/YourCode'

export default function Points() {
  const [isReferred, setIsReferred] = useState(false)

  const { verifyReferral, errorStr, referralData, ready } = useReferral()
  useEffect(() => {
    if (!!referralData?.inviter) {
      setIsReferred(true)
    } else {
      setIsReferred(false)
    }
  }, [referralData?.inviter])

  return (
    <Box sx={{ maxWidth: '1200px', margin: 'auto', padding: '20px 20px 100px' }}>
      <Gate isOpen={ready && !isReferred} verifyReferral={verifyReferral} errorStr={errorStr} />
      <MarqueeTop />
      {referralData?.code && <YourCode referralData={referralData} />}
      <PointsPanels />
      {!ready && (
        <DialogLayout isOpen={!!ready} setIsOpen={() => {}}>
          <Skeleton variant="rectangular" width={210} height={60} />
        </DialogLayout>
      )}
    </Box>
  )
}
