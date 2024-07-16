/** @jsxImportSource @emotion/react */
import { Box, Stack, TextField, Typography, useTheme, styled } from '@mui/material'
import { dialogContent } from './sytle'
import CloseSharpIcon from '@mui/icons-material/CloseSharp'
import { css } from '@emotion/react'
import { align } from '../../globalStyle'
import KRAVButton from '../KravUIKit/KravButton'
import { RemoveLiquidityProps } from '../Liquidity/type'
import { useRedeemLiquidity, useRemoveLiquidity } from '../../hook/hookV8/useRemoveLiquidity'
import { useRootStore } from '../../store/root'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { addDecimals, eXDecimals } from '../../utils/math'
import BigNumber from 'bignumber.js'
import { useUserPosition } from '../../hook/hookV8/useUserPosition'
import { ReactComponent as WarningIcon } from '../../assets/imgs/warningIcon.svg'
import { useFactory } from '../../hook/hookV8/useFactory'
import { DialogLayout } from './DialogLayout'
import { useSingleCallResult, useSingleContractMultipleData } from '../../hook/multicall'
import { useContract } from '../../hook/hookV8/useContract'
import KTokenABI from '../../abi/k_token.json'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// import ExpandLessIcon from '@mui/icons-material/ExpandLess'
// import KravButtonHollow from '../KravUIKit/KravButtonHollow'
import { withDecimals } from '../../utils'
import { PoolParams } from '../../store/FactorySlice'
import KravButtonHollow from '../KravUIKit/KravButtonHollow'
import { Trans, t } from '@lingui/macro'
import { useCountDown } from 'ahooks'

const StyledBox = styled(Box)(() => ({
  borderBottom: '1px solid var(--ps-text-20)',
  my: '24px',
}))

export const RemoveLiquidity = ({ isOpen, setIsOpen }: RemoveLiquidityProps) => {
  const theme = useTheme()
  const { provider } = useWeb3React()
  const [withdrawAmount, setWithdrawAmount] = useState<string | number>('')
  const [maxWithdrawAmount, setMaxWithdrawAmount] = useState(new BigNumber(0))
  const [allowRequest, setAllowRequest] = useState(true)
  const liquidityInfo = useRootStore((store) => store.liquidityInfo)
  const userPositionDatas = useRootStore((store) => store.userPositionDatas)
  const getUserPosition = useUserPosition()
  const removeLiquidity = useRemoveLiquidity(liquidityInfo.vaultT)
  const updateFactory = useFactory()

  const targetPool = useMemo(() => {
    return userPositionDatas.find((item) => item.pool?.tradingT === liquidityInfo.tradingT)
  }, [liquidityInfo, userPositionDatas])

  const getPoolBalance = useCallback(() => {
    if (Object.keys(liquidityInfo).length > 0 && targetPool) {
      const res = targetPool?.maxDaiDeposited?.times(liquidityInfo?.maxWithdrawP.div(100) ?? 0)
      const lockedAmount = targetPool?.daiDeposited?.minus(res)
      const maxAmount = eXDecimals(
        lockedAmount?.isGreaterThan(0) ? res : targetPool?.daiDeposited,
        targetPool?.pool?.decimals
      )
      setMaxWithdrawAmount(maxAmount || 0)
    }
  }, [liquidityInfo, targetPool])

  useEffect(() => {
    getPoolBalance()
  }, [provider, liquidityInfo, getPoolBalance])

  const handleMaxInput = () => {
    setWithdrawAmount(maxWithdrawAmount.toFixed())
  }

  return (
    <DialogLayout isOpen={isOpen} setIsOpen={setIsOpen}>
      <>
        <div css={dialogContent}>
          <div
            className="dialog-header"
            css={css`
              border-bottom: ${theme.splitLine.primary};
            `}
          >
            <span>Remove Liquidity</span>
            <CloseSharpIcon
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setWithdrawAmount('')
                setIsOpen(false)
              }}
            />
          </div>
          <Box
            padding={'24px'}
            sx={{
              borderBottom: theme.splitLine.primary,
            }}
          >
            <Stack direction={'row'}>
              <WarningIcon />
              <Typography
                fontFamily={'Inter'}
                fontSize={16}
                fontWeight={500}
                lineHeight={'150%'}
                sx={{ marginLeft: '8px !important' }}
              >
                {t`Liquidity Remove Limit`}
              </Typography>
            </Stack>
            <Typography
              fontFamily={'Inter'}
              fontSize={14}
              fontWeight={400}
              lineHeight={'150%'}
              sx={{ marginTop: '16px !important' }}
            >
              <span style={{ fontWeight: 600 }}>{t`Note`}: </span>
              <span>
                To promote stable liquidity, there is a 2 epoch (48-72 hour) waiting period after requesting a
                withdrawal, followed by a one week claim period to make the withdrawal. 25% of initially deposited
                liquidity may be withdrawn at a time.
              </span>
            </Typography>
          </Box>
          <div
            css={css`
              padding: 24px;
            `}
          >
            <div
              className="confirm-content-input3"
              css={css`
                background: ${theme.background.second};
                color: ${theme.text.primary};
              `}
            >
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  width: 100%;
                  justify-content: space-between;
                  margin-bottom: 20px;
                `}
              >
                <span>
                  <Trans>Pay</Trans>
                </span>
                <span>
                  <Trans>Available</Trans>: {maxWithdrawAmount.toFixed(2, 3)} {liquidityInfo.symbol}
                </span>
              </div>
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  width: 100%;
                  justify-content: space-between;
                `}
              >
                <TextField
                  variant="standard"
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{
                    background: theme.background.second,
                    color: theme.text.primary,
                    height: '28px',
                    fontSize: '20px',
                    minHeight: '28px',
                    '& .MuiOutlinedInput-root': {
                      height: '28px',
                      minHeight: '28px',
                      padding: 0,
                    },
                  }}
                />
                <div css={align}>
                  <div
                    css={css`
                      border-radius: 2px;
                      background: ${theme.palette.mode === 'dark' ? '#2832f5' : '#a4a8fe'};
                      padding: 2px 6px;
                      font-size: 12px;
                      cursor: pointer;
                    `}
                    onClick={handleMaxInput}
                  >
                    MAX
                  </div>
                  <div css={align}>
                    <span
                      css={css`
                        margin: 0 6px;
                      `}
                    >
                      {liquidityInfo.symbol}
                    </span>
                    <img
                      css={css`
                        border-radius: 50%;
                        background: ${theme.palette.mode === 'dark' ? '#fff' : ''};
                      `}
                      src={liquidityInfo.logoSource}
                      height="16"
                      width="16"
                    />
                  </div>
                </div>
              </div>
            </div>
            <KRAVButton
              disabled={
                !allowRequest ||
                addDecimals(withdrawAmount.toString(), liquidityInfo.decimals).isGreaterThan(
                  addDecimals(maxWithdrawAmount.toString(), liquidityInfo.decimals)
                ) ||
                !new BigNumber(withdrawAmount).isGreaterThan(0)
              }
              onClick={async () => {
                setIsOpen(false)
                await removeLiquidity(
                  addDecimals(withdrawAmount.toString(), liquidityInfo.decimals),
                  liquidityInfo.symbol,
                  liquidityInfo.decimals
                )
                await Promise.all([updateFactory(), getUserPosition()])
                setWithdrawAmount('')
              }}
              sx={{ mt: '24px' }}
            >
              <Trans>Remove</Trans>
            </KRAVButton>
          </div>
          <ExistingRequest
            kToken={targetPool?.pool.vaultT}
            daiDeposited={targetPool?.daiDeposited}
            pool={targetPool?.pool}
            vaultAddress={liquidityInfo.vaultT}
            setIsOpen={setIsOpen}
            setAllowRequest={setAllowRequest}
          />
        </div>
      </>
    </DialogLayout>
  )
}

const claimableEpochLength = 7
function ExistingRequest({
  kToken,
  daiDeposited = new BigNumber(0),
  pool,
  vaultAddress,
  setIsOpen,
  setAllowRequest,
}: {
  kToken?: string
  daiDeposited?: BigNumber
  pool?: PoolParams
  vaultAddress: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setAllowRequest: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { account } = useWeb3React()
  const [showExistingRequest, setShowExistingRequest] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [countdown, { days, hours, minutes, seconds }] = useCountDown({ targetDate: remainingTime })
  const [claimRemainingTime, setClaimRemainingTime] = useState(0)
  const [claimCountdown, { days: cdays, hours: chours, minutes: cminutes, seconds: cseconds }] = useCountDown({
    targetDate: claimRemainingTime,
  })

  const redeemLiquidity = useRedeemLiquidity(vaultAddress)
  const kTokenContract = useContract(kToken, KTokenABI.abi)

  const getUpdateEpoch = useSingleCallResult(kTokenContract, 'updateEpoch', [])

  const getEpochDuration = useSingleCallResult(kTokenContract, 'epochDuration', [])

  const getCurrentEpoch = useSingleCallResult(kTokenContract, 'epochCurrent', [])

  const updateEpoch = useMemo(() => {
    if (getUpdateEpoch?.result?.[0]) return new BigNumber(getUpdateEpoch.result?.[0]._hex)
    else return new BigNumber(0)
  }, [getUpdateEpoch])

  const lastEpoch = useMemo(() => {
    if (getUpdateEpoch?.result?.[1]) return new BigNumber(getUpdateEpoch.result?.[1]._hex)
    else return new BigNumber(0)
  }, [getUpdateEpoch])

  const epochDuration = useMemo(() => {
    if (getEpochDuration?.result) {
      return new BigNumber(getEpochDuration.result[0]._hex).toNumber()
    } else return 0
  }, [getEpochDuration])

  const currentEpoch = useMemo(() => {
    if (getCurrentEpoch?.result?.[0]) return new BigNumber(getCurrentEpoch.result?.[0]._hex)
    else return new BigNumber(0)
  }, [getCurrentEpoch])

  const args = useMemo(() => [account, currentEpoch.toFixed()], [account, currentEpoch])
  const requestedSharesAt = useSingleCallResult(kTokenContract, 'requestedSharesAt', args)

  const requestedSharesData = useMemo(() => {
    if (requestedSharesAt?.result) {
      const data = {
        claimableEpoch: new BigNumber(requestedSharesAt.result?.claimableEpoch._hex),
        claimable: new BigNumber(requestedSharesAt.result?.claimable._hex),
        pending: new BigNumber(requestedSharesAt.result?.pending._hex),
      }
      if (data.claimable.gt('0') || data.pending.gt('0')) {
        false
      }
      return data
    } else {
      return {
        claimableEpoch: null,
        claimable: null,
        pending: null,
      }
    }
  }, [requestedSharesAt.result])

  const getRequestEc = useSingleContractMultipleData(
    kTokenContract,
    'reqWithdrawals',
    Array.from(Array(4).keys()).map((index) => [account, updateEpoch.plus(index).toString()])
  )

  const requestEc = useMemo<{ epoch: number; amount: BigNumber }[]>(() => {
    if (getRequestEc[0]?.result && updateEpoch && daiDeposited) {
      return getRequestEc.map((ec, index) => {
        return {
          epoch: updateEpoch.plus(index).toNumber(),
          amount: new BigNumber(ec?.result?.[0]._hex),
        }
      })
    } else
      return [
        {
          epoch: 0,
          amount: new BigNumber(0),
        },
        {
          epoch: 0,
          amount: new BigNumber(0),
        },
        {
          epoch: 0,
          amount: new BigNumber(0),
        },
        {
          epoch: 0,
          amount: new BigNumber(0),
        },
      ]
  }, [getRequestEc, updateEpoch, daiDeposited])

  const existingRequestLength = useMemo(() => {
    return requestEc.filter((req) => req.amount.isGreaterThan(0) && daiDeposited?.isGreaterThan(0)).length
  }, [requestEc, daiDeposited])

  const waitPeriod = useMemo(() => {
    let wait = -1
    requestEc.forEach((period, index) => {
      if (period.amount.isGreaterThan(0) && wait === -1) {
        wait = index
      }
    })
    return wait
  }, [requestEc])

  useEffect(() => {
    const currentStart = lastEpoch.times(1000)
    //TODO: currentEpoch is null
    if (waitPeriod === 0) {
      const t = currentStart.toNumber()
      setRemainingTime(t)
    }
    if (waitPeriod === 1) {
      const t = currentStart.plus(epochDuration * 1000).toNumber()
      setRemainingTime(t)
    }
    if (waitPeriod === 2) {
      const t = currentStart.plus(epochDuration * 2 * 1000).toNumber()
      setRemainingTime(t)
    }
    if (waitPeriod === 3) {
      const t = currentStart.plus(epochDuration * 3 * 1000).toNumber()
      setRemainingTime(t)
    }
  }, [lastEpoch, waitPeriod, setRemainingTime, epochDuration])

  useEffect(() => {
    if (lastEpoch.isGreaterThan(0) && epochDuration > 0) {
      setRemainingTime(lastEpoch.plus(epochDuration * waitPeriod).toNumber() * 1000)
    }
    if (requestedSharesData.claimableEpoch && lastEpoch.isGreaterThan(0) && currentEpoch) {
      const gap = requestedSharesData.claimableEpoch.plus(claimableEpochLength).minus(currentEpoch).toNumber()
      setClaimRemainingTime((lastEpoch.toNumber() + epochDuration * gap) * 1000)
    }
  }, [currentEpoch, epochDuration, lastEpoch, requestedSharesData.claimableEpoch, waitPeriod])

  if (!existingRequestLength && requestedSharesData.claimable?.eq(0)) {
    return null
  }

  return (
    <Box p={'20px'}>
      <Box>
        <Stack
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          onClick={() => setShowExistingRequest(!showExistingRequest)}
        >
          <Typography
            sx={{
              fontSize: '14px',
              lineHeight: '140%',
            }}
          >
            <Trans>Existing Request</Trans> (1)
          </Typography>
          {/* {!showExistingRequest ? <ExpandMoreIcon /> : <ExpandLessIcon />} */}
        </Stack>
      </Box>

      {(!!existingRequestLength || requestedSharesData.claimable?.gt(0)) && (
        <Box>
          <Typography
            component={'div'}
            sx={{
              mt: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
            }}
          >
            <span>{t`Amount`}</span>
            <span>{t`Withdraw Status`}</span>
          </Typography>
          {requestedSharesData?.claimable?.gt(0) ? (
            <Box>
              <Stack my={12} alignItems={'center'} flexDirection={'row'} justifyContent={'space-between'} margin={0}>
                <Typography
                  sx={{
                    fontSize: '15px',
                    lineHeight: '140%',
                  }}
                >
                  {requestedSharesData.claimable.isGreaterThan(withDecimals(daiDeposited, pool?.decimals ?? 18))
                    ? daiDeposited.toFormat(8)
                    : withDecimals(requestedSharesData.claimable, pool?.decimals ?? 18, false).toFormat(8)}
                  &nbsp;{pool?.symbol}
                </Typography>
                {
                  <Box display={'flex'} alignItems={'center'} gap="10px">
                    <Typography
                      sx={{
                        fontSize: '12px',
                        lineHeight: '140%',
                      }}
                      component={'div'}
                    >
                      Claimable until
                      <p>{claimCountdown > 0 ? `${cdays}d ${chours}h ${cminutes}m ${cseconds}s` : '00d 00h 00m 00s'}</p>
                    </Typography>
                    <KravButtonHollow
                      style={{ background: '#2832f5', border: 'none' }}
                      onClick={async () => {
                        await redeemLiquidity(
                          requestedSharesData.claimable.isGreaterThan(withDecimals(daiDeposited, pool?.decimals ?? 18))
                            ? withDecimals(daiDeposited, pool?.decimals ?? 18).toString()
                            : requestedSharesData.claimable.toString(),
                          requestedSharesData.claimable,
                          pool?.decimals,
                          pool?.symbol
                        )
                        setIsOpen(false)
                      }}
                      sx={{
                        padding: '6px 16px',
                        backgroundColor: 'var(--ps-text-100)',
                        width: 62,
                        height: 29,
                        borderRadius: '100px',
                      }}
                    >
                      {t`Claim`}
                    </KravButtonHollow>
                  </Box>
                }
              </Stack>
              <StyledBox />
            </Box>
          ) : (
            <Box>
              {requestEc
                .filter((item) => item.amount.isGreaterThan(0))
                .map((ec, index) => {
                  return (
                    <Box key={index}>
                      <Stack
                        my={12}
                        alignItems={'center'}
                        flexDirection={'row'}
                        justifyContent={'space-between'}
                        margin={0}
                      >
                        <Typography
                          sx={{
                            fontSize: '15px',

                            lineHeight: '140%',
                          }}
                        >
                          {ec.amount.isGreaterThan(withDecimals(daiDeposited, pool?.decimals ?? 18))
                            ? daiDeposited.toFormat(8)
                            : withDecimals(ec.amount, pool?.decimals ?? 18, false).toFormat(8)}
                          &nbsp;{pool?.symbol}
                        </Typography>
                        {requestedSharesData.claimableEpoch &&
                        currentEpoch.lt(requestedSharesData.claimableEpoch?.plus(7)) ? (
                          <>
                            <KravButtonHollow
                              onClick={async () => {
                                await redeemLiquidity(
                                  ec.amount.isGreaterThan(withDecimals(daiDeposited, pool?.decimals ?? 18))
                                    ? withDecimals(daiDeposited, pool?.decimals ?? 18).toString()
                                    : ec.amount.toString(),
                                  ec.amount,
                                  pool?.decimals,
                                  pool?.symbol
                                )
                                setIsOpen(false)
                              }}
                              sx={{
                                padding: '6px 16px',
                                backgroundColor: 'var(--ps-text-100)',
                                width: 62,
                                height: 29,
                                borderRadius: '100px',
                              }}
                            >
                              {t`Claim`}
                            </KravButtonHollow>
                            <Typography
                              sx={{
                                fontSize: '15px',
                                lineHeight: '140%',
                              }}
                            >
                              Claimable until
                              <span>
                                {claimCountdown > 0
                                  ? `${cdays}d ${chours}h ${cminutes}m ${cseconds}s`
                                  : '00d 00h 00m 00s'}
                              </span>
                            </Typography>
                          </>
                        ) : (
                          <Typography
                            sx={{
                              fontSize: '15px',
                              lineHeight: '140%',
                            }}
                          >
                            {t`Pending`}{' '}
                            <span>
                              {countdown > 0 ? `${days}d ${hours}h ${minutes}m ${seconds}s` : '00d 00h 00m 00s'}
                            </span>
                          </Typography>
                        )}
                      </Stack>
                      <StyledBox />
                    </Box>
                  )
                })}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
