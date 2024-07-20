import { Box, Stack, Typography, useTheme } from '@mui/material'
import { ReactComponent as AlertIcon } from '../../assets/imgs/alert.svg'
import { t } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import KRAVButton from '../KravUIKit/KravButton'
import { useRootStore } from '../../store/root'
import { PointsPools, usePoints, usePointsList } from '../../hook/usePoints'
import Table from '../Table'
import PaginationView from '../Pagination'
import { useMemo, useState } from 'react'
import { MAINNET_CHAINS } from '../../connectors/chain'

export default function PointsPanels() {
  const theme = useTheme()
  const points = usePoints()
  return (
    <Stack gap={'20px'}>
      <Box sx={{ background: theme.background.second, borderRadius: '20px', padding: '20px' }}>
        <Typography mb="20px" fontWeight={700} fontSize={'26px'}>
          KRAV Points
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
      <Box sx={{ background: theme.background.second, padding: '20px', borderRadius: '20px' }}>
        <Typography mb="20px" fontSize={'26px'} fontWeight={700}>
          K-Points Portfolio
        </Typography>
        <Portfolio pools={points?.pools} />
      </Box>
      <Box sx={{ background: theme.background.third, padding: '20px', borderRadius: '20px' }}>
        <Typography mb="20px" fontSize={'26px'} fontWeight={700}>
          History
        </Typography>
        <History />
      </Box>
    </Stack>
  )
}

function History() {
  const { account } = useWeb3React()
  const setWalletDialogVisibility = useRootStore((store) => store.setWalletDialogVisibility)
  const [page, setPage] = useState(1)
  const { pointsList, pageTotal } = usePointsList(page)
  const theme = useTheme()
  return (
    <Box>
      <Box sx={{ background: theme.background.second }} borderRadius={'10px'}>
        <Typography padding="24px">
          <b>Note:</b> Candies are distributed every 24 hours if a user is in the pool for the entire epoch. Rollies are
          earned immediately upon opening a trade
        </Typography>
      </Box>
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

function Portfolio({ pools }: { pools?: { [key: number]: PointsPools } }) {
  const allPoolParams = useRootStore((state) => state.allPoolParams)
  const theme = useTheme()

  const referralPoints = useMemo(() => {
    if (!pools) return 0
    const points = Object.keys(pools).reduce((acc, key) => {
      const p = pools[+key as keyof typeof pools]
      const invitePoints = p.Invite ? +p.Invite : 0
      acc += invitePoints
      return acc
    }, 0)
    return points
  }, [pools])

  if (!pools) return <></>
  return (
    <Box display={'flex'} flexWrap={'wrap'} gap="10px">
      {Object.keys(pools).map((key: string) => {
        const pool = pools[+key as keyof typeof pools]
        if (+pool.LPAdd + +pool.TradeLong + +pool.TradeShort == 0) {
          return null
        }
        const chain = MAINNET_CHAINS[pool.chainId as number]
        const poolParams = allPoolParams[pool.quantoIndex]
        if (!poolParams) return null
        return (
          <Box
            flexShrink={0}
            key={pool.chainId + pool.quantoIndex}
            sx={{ background: theme.background.third, padding: '20px', borderRadius: '10px' }}
          >
            <Box display="flex" alignItems={'center'} gap="10px" mb="10px">
              <img
                src={poolParams.logoSource}
                style={{ height: '22px', width: '22px', borderRadius: '50%', border: '1px solid #666666' }}
              ></img>
              <Typography fontWeight={700}>
                <span style={{ fontWeight: 700, fontSize: '20px' }}>{poolParams.symbol}</span>
              </Typography>
            </Box>
            <Box
              sx={{
                '> p': { color: theme.text.second, width: '100%', display: 'flex', justifyContent: 'space-between' },
                '& .points': {
                  color: '#ffffff',
                  marginLeft: '10px',
                  textAlign: 'right',
                  fontWeight: 700,
                },
              }}
            >
              {pool.LPAdd && (
                <Typography>
                  <span className="points">{pool.LPAdd} </span>
                  <span style={{ marginLeft: '10px' }}>CANDIES</span>
                </Typography>
              )}

              {pool.TradeLong && pool.TradeShort && (
                <Typography>
                  <span className="points">{+pool.TradeLong + +pool.TradeShort} </span>
                  <span style={{ marginLeft: '10px' }}>ROLLIES</span>
                </Typography>
              )}
            </Box>
            <Box
              display={'flex'}
              alignItems={'center'}
              gap={'10px'}
              width="100%"
              justifyContent={'flex-end'}
              mt={'10px'}
              fontSize={'12px'}
            >
              <Box
                height={'15px'}
                width="15px"
                sx={{
                  borderRadius: '50%',
                  overflow: 'hidden',

                  '& svg': {
                    height: '100%',
                    width: '100%',
                  },
                }}
              >
                {chain.logo}
              </Box>
              {chain.name}
            </Box>
          </Box>
        )
      })}
      {referralPoints > 0 && (
        <Box flexShrink={0} sx={{ background: theme.background.third, padding: '20px', borderRadius: '10px' }}>
          <Box display="flex" alignItems={'center'} gap="10px" mb="10px">
            <Typography fontWeight={700}>
              <span style={{ fontWeight: 700, fontSize: '20px' }}>Referral Points</span>
            </Typography>
          </Box>
          <Box
            sx={{
              '> p': { color: theme.text.second, width: '100%', display: 'flex', justifyContent: 'space-between' },
              '& .points': {
                color: '#ffffff',
                marginLeft: '10px',
                textAlign: 'right',
                fontWeight: 700,
              },
            }}
          >
            <Typography>
              <span className="points">{referralPoints} </span>
              <span style={{ marginLeft: '10px' }}>CANDIES</span>
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}
