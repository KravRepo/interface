/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import KRAVButton from '../KravUIKit/KravButton'
import { TextField, useMediaQuery, useTheme } from '@mui/material'
import { ReactComponent as KravToken } from '../../assets/imgs/krav_token.svg'
import { ReactComponent as VeKravToken } from '../../assets/imgs/tokens/default_token.svg'
import { ReactComponent as TipDark } from '../../assets/imgs/darkModel/exchange_tip_dark.svg'
import { ReactComponent as Tip } from '../../assets/imgs/exchange_tip.svg'
import { ReactComponent as Arrow } from '../../assets/imgs/mint_arrow.svg'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useRootStore } from '../../store/root'
import BigNumber from 'bignumber.js'
import { formatNumber, getProviderOrSigner } from '../../utils'
import { useWeb3React } from '@web3-react/core'
import { ChainId } from '../../constant/chain'
import { useTokenSwap } from '../../hook/hookV8/useContract'
import { TransactionAction, TransactionState } from '../../store/TransactionSlice'
import { MAX_UNIT_256 } from '../../constant/math'
import { Contract } from 'ethers'
import erc20 from '../../abi/test_erc20.json'
import { addDecimals, eXDecimals } from '../../utils/math'
import { useUpdateError } from '../../hook/hookV8/useUpdateError'
import { useUpdateSuccessDialog } from '../../hook/hookV8/useUpdateSuccessDialog'

export const ExchangeAction = () => {
  const { chainId, account, provider } = useWeb3React()
  const userPositionDatas = useRootStore((store) => store.userPositionDatas)
  const setTransactionState = useRootStore((state) => state.setTransactionState)
  const setTransactionDialogVisibility = useRootStore((store) => store.setTransactionDialogVisibility)
  const setSuccessSnackbarInfo = useRootStore((state) => state.setSuccessSnackbarInfo)
  const [showMint] = useState(false)
  const [stakeAmount, setStakeAmount] = useState(new BigNumber(0))

  const [userStakedAmount, setUserStakedAmount] = useState(new BigNumber(0))
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const oldKravDetails = useMemo(() => {
    if (userPositionDatas.length > 0) {
      const krav = userPositionDatas.find((item) => item.pool.symbol === 'KRAV')
      if (krav) return krav
      else return
    } else return
  }, [userPositionDatas])
  const userOldKravBalance = useMemo(() => {
    if (oldKravDetails) {
      return oldKravDetails.walletBalance
    } else return new BigNumber(0)
  }, [oldKravDetails])

  const stakeAmountInput = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newValue = new BigNumber(event.target.value)
    setStakeAmount(newValue)
  }

  const tokenSwapContract = useTokenSwap(chainId || ChainId.BASE_TEST)

  const updateError = useUpdateError()

  const updateSuccessDialog = useUpdateSuccessDialog()

  const stakeOldKrav = useCallback(async () => {
    if (chainId === ChainId.BASE || chainId === ChainId.BASE_TEST) {
      if (account && tokenSwapContract && oldKravDetails && provider) {
        try {
          setTransactionState(TransactionState.CHECK_APPROVE)
          setTransactionDialogVisibility(true)
          const kravContract = new Contract(
            oldKravDetails.pool.tokenT,
            erc20.abi,
            getProviderOrSigner(provider, account)
          )
          const allowance = await kravContract.allowance(account, tokenSwapContract.address)
          if (
            addDecimals(stakeAmount, 18).isGreaterThan(new BigNumber(allowance.toString())) ||
            Number(allowance) === 0
          ) {
            setTransactionState(TransactionState.APPROVE)
            const approveTX = await kravContract.approve(tokenSwapContract.address, MAX_UNIT_256)
            await approveTX.wait()
          }
          setTransactionState(TransactionState.INTERACTION)
          const tx = await tokenSwapContract.burn(addDecimals(stakeAmount, 18).toString())
          setTransactionState(TransactionState.STAKE_KRAV)
          await tx.wait()
          setTransactionDialogVisibility(false)
          setTransactionState(TransactionState.START)
          updateSuccessDialog(TransactionAction.STAKE_KRAV)
          setSuccessSnackbarInfo({
            snackbarVisibility: true,
            title: 'Stake',
            content: `Your ${stakeAmount.toFixed(2)} krav has been staked successfully`,
          })
          setStakeAmount(new BigNumber(0))
        } catch (e) {
          updateError(TransactionAction.STAKE_KRAV)
          console.log('e', e)
        }
      }
    }
  }, [chainId, account, tokenSwapContract, oldKravDetails, provider, stakeAmount])

  const getUserStakedAmount = useCallback(async () => {
    if (chainId === ChainId.BASE || chainId === ChainId.BASE_TEST) {
      if (account && tokenSwapContract && provider) {
        const amountStaked = await tokenSwapContract.amountStaked(account)
        setUserStakedAmount(eXDecimals(new BigNumber(amountStaked._hex), 18))
      }
    }
  }, [account, chainId, provider, tokenSwapContract])

  useEffect(() => {
    getUserStakedAmount().then()
    const interval = setInterval(() => getUserStakedAmount(), 15000)
    return () => clearInterval(interval)
  }, [getUserStakedAmount])

  return (
    <div
      css={css`
        border-radius: 8px;
        background: ${theme.background.primary};
        margin-bottom: 24px;
        padding: ${isMobile ? '24px 16px 40px' : '15px 40px 42px'};
      `}
    >
      <div
        css={css`
          padding: 16px 24px;
          background: rgba(164, 168, 254, 0.2);
          display: flex;
          align-items: center;
          font-size: 12px;
          font-weight: 600;
          color: ${theme.palette.mode === 'dark' ? '#fff' : '#a4a8fe'};
          border-radius: 8px;
          margin-bottom: 24px;
        `}
      >
        {theme.palette.mode === 'dark' ? <TipDark /> : <Tip />}
        <span>
          &nbsp;
          {'You need to stake KRAV Token first, and the "mint" operation will not be officially started until the mint\n' +
            'start time.'}
        </span>
      </div>
      <div
        css={css`
          display: grid;
          grid-template-columns: ${isMobile ? '' : '1fr 1.1fr'};
          gap: 26px;
        `}
      >
        <div
          css={css`
            display: grid;
            grid-template-columns: ${isMobile ? '' : '1fr 1fr'};
            gap: 26px;
            font-size: 20px;
            font-weight: 600;
            position: relative;
          `}
        >
          <Arrow
            css={css`
              position: absolute;
              left: calc(50% - 26px);
              top: calc(50%);
              transform: ${isMobile ? 'rotate(0.25turn)' : ''};
            `}
          />
          <div>
            <p
              css={css`
                padding-left: 6px;
                margin-bottom: 16px;
              `}
            >
              Burn
            </p>
            <div
              css={css`
                padding: ${isMobile ? '36px 20px' : '48px 0 72px 40px'};
                background: ${theme.background.second};
                border-radius: 16px;
                align-items: center;
              `}
            >
              <div
                css={css`
                  display: ${isMobile ? 'flex' : ''};
                  align-items: center;
                  justify-content: space-between;
                `}
              >
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                    > span {
                      margin-left: 8px;
                    }
                  `}
                >
                  <KravToken
                    css={css`
                      height: ${isMobile ? '32px' : '40px'};
                      width: ${isMobile ? '32px' : '40px'};
                    `}
                  />
                  <span>KRAV</span>
                </div>
                <p
                  css={css`
                    color: ${theme.text.second};
                    font-size: 14px;
                    font-weight: 700;
                    margin-top: ${isMobile ? '' : '32px'};
                  `}
                >
                  Base Chain Network
                </p>
              </div>
            </div>
          </div>
          <div>
            {!isMobile && (
              <p
                css={css`
                  padding-left: 6px;
                  margin-bottom: 16px;
                `}
              >
                Mint
              </p>
            )}
            <div
              css={css`
                padding: ${isMobile ? '36px 20px' : '48px 0 72px 40px'};
                background: ${theme.background.second};
                border-radius: 16px;
              `}
            >
              <div
                css={css`
                  display: ${isMobile ? 'flex' : ''};
                  align-items: center;
                  justify-content: space-between;
                `}
              >
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                    > span {
                      margin-left: 8px;
                    }
                  `}
                >
                  <VeKravToken
                    css={css`
                      height: ${isMobile ? '32px' : '40px'};
                      width: ${isMobile ? '32px' : '40px'};
                    `}
                  />
                  <span>???</span>
                </div>
                <p
                  css={css`
                    color: ${theme.text.second};
                    font-size: 14px;
                    font-weight: 700;
                    margin-top: ${isMobile ? '' : '32px'};
                  `}
                >
                  ???? ???? ????
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          css={css`
            padding: ${isMobile ? '24px 20px' : '24px 48px'};
            border: ${theme.splitLine.primary};
            font-size: ${isMobile ? '18px' : '20px'};
            border-radius: 16px;
            font-weight: 700;
            > p {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
          `}
        >
          {!showMint && (
            <>
              <p>
                <span>Your staked :</span>
                <span>{formatNumber(userStakedAmount.toString(), 4, false)} KRAV</span>
              </p>
              <p
                css={css`
                  font-size: 14px;
                `}
              >
                <span>Amount</span>
                <span>Available: {formatNumber(userOldKravBalance.toString(), 4, false)} KRAV</span>
              </p>
              <div
                css={css`
                  margin-bottom: 18px;
                `}
              >
                <div
                  css={css`
                    background: ${theme.background.second};
                    border-radius: 8px;
                    padding: 8px 12px;
                    display: flex;
                    align-items: center;
                  `}
                >
                  <KravToken />
                  <TextField
                    variant="standard"
                    type="number"
                    value={stakeAmount}
                    onChange={stakeAmountInput}
                    InputProps={{
                      disableUnderline: true,
                    }}
                    sx={{
                      height: '28px',
                      fontSize: '20px',
                      minHeight: '28px',
                      marginLeft: '12px',
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        height: '28px',
                        minHeight: '28px',
                        padding: 0,
                      },
                    }}
                  />
                  <span
                    css={css`
                      font-size: 16px;
                      margin-right: 8px;
                    `}
                  >
                    KRAV
                  </span>
                  <div
                    onClick={() => setStakeAmount(userOldKravBalance)}
                    css={css`
                      border-radius: 2px;
                      color: ${theme.text.primary};
                      background: ${theme.palette.mode === 'dark' ? '#2832f5' : '#a4a8fe'};
                      padding: 2px 6px;
                      font-size: 12px;
                      cursor: pointer;
                    `}
                  >
                    MAX
                  </div>
                </div>
              </div>
              <p
                css={css`
                  font-size: 12px;
                `}
              >
                <span>Exchange ratio :</span>
                <span>1 KRAV→ 1 ???</span>
              </p>
              <KRAVButton
                disabled={
                  !userOldKravBalance.isGreaterThan(0) ||
                  stakeAmount.isGreaterThan(userOldKravBalance) ||
                  stakeAmount.isEqualTo(0) ||
                  stakeAmount.isNaN()
                }
                onClick={() => stakeOldKrav().then()}
                sx={{
                  mt: '4px',
                }}
              >
                Stake
              </KRAVButton>
            </>
          )}
          {showMint && (
            <div
              css={css`
                text-align: center;
              `}
            >
              <p
                css={css`
                  padding-top: 24px;
                `}
              >
                Amount that can be claimed
              </p>
              <p
                css={css`
                  font-size: 48px;
                  padding-top: 16px;
                  padding-bottom: 27px;
                  font-family: 'GT-Flexa-Bold-Trial';
                `}
              >
                200.56 ???
              </p>
              <KRAVButton>Mint</KRAVButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
