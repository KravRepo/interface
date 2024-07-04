import { Box, Stack, Typography, useTheme } from '@mui/material'
import { ReactComponent as AlertIcon } from '../../assets/imgs/alert.svg'
import { t } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import KRAVButton from '../KravUIKit/KravButton'
import { useRootStore } from '../../store/root'
import { usePoints, usePointsList } from '../../hook/usePoints'
import Table from '../Table'
import PaginationView from '../Pagination'
import { useState } from 'react'

export default function PointsPanels() {
  const theme = useTheme()
  const points = usePoints()
  return (
    <Stack gap={'20px'}>
      <Box sx={{ background: theme.background.second, borderRadius: '20px', padding: '20px' }}>
        <Typography mb="20px" fontWeight={700} fontSize={'26px'}>
          RAVE Points
        </Typography>
        <Box display={'grid'} gridTemplateColumns={'1fr 1fr'} gap="20px">
          <Box sx={{ background: theme.background.third, borderRadius: '20px', padding: '20px' }}>
            <Typography>Liquidity Points</Typography>
            <Typography>
              <Typography fontSize={'50px'} component={'span'}>
                {points?.pointLP}{' '}
              </Typography>
              CANDIES
            </Typography>
          </Box>
          <Box sx={{ background: theme.background.third, borderRadius: '20px', padding: '20px' }}>
            <Typography>Trading Points</Typography>
            <Typography>
              <Typography fontSize={'50px'} component={'span'}>
                {points?.pointTrade}{' '}
              </Typography>
              ROLLIES
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          background: theme.background.third,
          padding: '20px',
          borderRadius: '20px',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start',
        }}
      >
        <AlertIcon style={{ marginTop: '5px' }} />
        <Typography>
          Earn Points for Trading and Liquidity Provision on KRAV! Maximize your rewards with exclusive multipliers for
          select tokens. <br />
          Check{' '}
          <Typography component="a" href="" sx={{ color: '#ffffff' }} target="_blank">
            Medium
          </Typography>{' '}
          for more details
        </Typography>
      </Box>
      <Box sx={{ background: theme.background.third, padding: '20px', borderRadius: '20px' }}>
        <Typography mb="20px" fontSize={'26px'} fontWeight={700}>
          Portfolio
        </Typography>
        <Portfolio />
      </Box>
    </Stack>
  )
}

function Portfolio() {
  const { account } = useWeb3React()
  const setWalletDialogVisibility = useRootStore((store) => store.setWalletDialogVisibility)
  const [page, setPage] = useState(1)
  const { pointsList, pageTotal } = usePointsList(page)

  return (
    <Box>
      <Box>
        {pointsList && pointsList.length === 0 && account && (
          <div className="no-data" style={{ textAlign: 'center' }}>{t`No record`}</div>
        )}
        {!account && (
          <Box width="100%" display={'flex'} justifyContent={'center'}>
            <KRAVButton
              onClick={() => setWalletDialogVisibility(true)}
              sx={{ width: '113px', mt: '32px', mb: '25px', zIndex: 3, px: '10px' }}
            >
              {t`Connect Wallet`}
            </KRAVButton>
          </Box>
        )}
        {account && pointsList === null && (
          <Box height="100px" textAlign={'center'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
            Loading
          </Box>
        )}

        {pointsList && pointsList.length > 0 && account && (
          <>
            <Table
              header={[
                t`EARNING EVENTS`,
                t`DATE OPENED`,
                t`MULTIPLIER`,
                t`VOLUME (ETH)`,
                t`CHAIN`,
                t`POINTS EARNED`,
                t`DATE CLOSED`,
              ]}
              rows={pointsList}
            />
          </>
        )}
        {account && pageTotal > 1 && (
          <PaginationView
            count={pageTotal}
            page={page}
            onChange={(_, p) => {
              setPage(p)
            }}
          />
        )}
      </Box>
    </Box>
  )
}
