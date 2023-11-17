/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import DashboardBg from '../../assets/imgs/dashboard_bg.png'
import { ReactComponent as KRAVIcon } from 'assets/imgs/tokens/KRAV.svg'
import KRAVButton from '../KravUIKit/KravButton'
import { stake } from './style'
import { align } from '../../globalStyle'
import { Button } from '@mui/material'
import { ReactComponent as AddIcon } from '../../assets/imgs/addIcon.svg'
import { ReactComponent as SubIcon } from '../../assets/imgs/subIcon.svg'
import { ReactComponent as ArrowRight } from '../../assets/imgs/arrowRight.svg'
import { useGetKravStake } from '../../hook/hookV8/useGetKravStake'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { eXDecimals } from '../../utils/math'
import { getBigNumberStr } from '../../utils'
import { StakeDialog } from '../Dialog/StakeDialog'

export const Stake = () => {
  const { account } = useWeb3React()
  const [hasStake, setHasStake] = useState(true)
  const [userReward, setUserReward] = useState(new BigNumber(0))
  const [userStake, setUserStake] = useState(new BigNumber(0))
  const [poolStake, setPoolStake] = useState(new BigNumber(0))
  const [userKravBalance, setUserKravBalance] = useState(new BigNumber(0))
  const [openStakeDialog, setOpenStakeDialog] = useState(false)
  const [isStake, setIsStake] = useState(false)
  const { getTotalStake, getUserReward, getUserStake, claimReward, getUserKRAVBalance } = useGetKravStake()

  useEffect(() => {
    getTotalStake().then((totalStake) => setPoolStake(eXDecimals(totalStake, 18)))
    setInterval(() => {
      getTotalStake().then((totalStake) => setPoolStake(eXDecimals(totalStake, 18)))
    }, 10000)
  }, [])

  useEffect(() => {
    if (account) {
      getUserReward().then((rewardAmount) => setUserReward(eXDecimals(rewardAmount, 18)))
      getUserStake().then((stakeAmount) => setUserStake(eXDecimals(stakeAmount, 18)))
      getUserKRAVBalance().then((balance) => setUserKravBalance(eXDecimals(balance, 18)))
      setInterval(() => {
        getUserReward().then((rewardAmount) => setUserReward(eXDecimals(rewardAmount, 18)))
        getUserStake().then((stakeAmount) => setUserStake(eXDecimals(stakeAmount, 18)))
        getUserKRAVBalance().then((balance) => setUserKravBalance(eXDecimals(balance, 18)))
      }, 10000)
    }
  }, [account])

  return (
    <>
      <StakeDialog
        isOpen={openStakeDialog}
        setIsOpen={setOpenStakeDialog}
        isStake={isStake}
        userKravBalance={userKravBalance}
        useStakeAmount={userStake}
        setPoolStake={setPoolStake}
        setUserStake={setUserStake}
        setUserKravBalance={setUserKravBalance}
      />
      <div css={stake} onClick={() => setHasStake(!hasStake)}>
        <div className="title">My Staking</div>
        {userStake.isGreaterThan(0) && account && (
          <div>
            <div className="overview">
              <div>
                <div>
                  <span>Total Staked</span>
                  <span>{poolStake.toFixed(2)} KRAV</span>
                </div>
                {/*<span>≈ $246,556,893.30</span>*/}
                <KRAVButton
                  sx={{ width: '90px' }}
                  disabled={userReward.isEqualTo(0)}
                  className="more"
                  onClick={async () => {
                    await claimReward()
                    await getUserReward()
                  }}
                >
                  Claim
                </KRAVButton>
              </div>
            </div>
            <div>
              <div
                css={css`
                  margin: 24px 0;
                `}
                className="grid-layout grey"
              >
                <span>ASSET</span>
                <span>POOL TOTAL STAKED</span>
                <span>YOUR STAKED</span>
                <span>APR</span>
                <span>REWARD</span>
              </div>
              <div className="grid-layout">
                <div css={align}>
                  <KRAVIcon height="40" width="40" />
                  <div
                    css={css`
                      margin-left: 12px;
                    `}
                  >
                    <p>KRAV</p>
                    <p className="grey">Krav coin</p>
                  </div>
                </div>
                <div>
                  <p>{poolStake.toFixed(2)} KRAV</p>
                  {/*<p className="grey">($236,123.00)</p>*/}
                </div>
                <div>{getBigNumberStr(userStake, 2)} KRAV</div>
                <div>--</div>
                <div>{getBigNumberStr(userReward, 2)} KRAV</div>
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                    justify-content: end;
                    white-space: nowrap;
                  `}
                >
                  <Button
                    sx={{
                      height: '32px',
                      width: '32px',
                      minWidth: '32px',
                      border: '1px solid #2E2E2E',
                      margin: '12px',
                    }}
                    onClick={() => {
                      setIsStake(true)
                      setOpenStakeDialog(true)
                    }}
                  >
                    <AddIcon height="17" width="17" />
                  </Button>
                  <Button
                    onClick={() => {
                      setIsStake(false)
                      setOpenStakeDialog(true)
                    }}
                    sx={{ height: '32px', width: '32px', minWidth: '32px', border: '1px solid #2E2E2E' }}
                  >
                    <SubIcon height="17" width="17" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {userStake.isEqualTo(0) && (
          <div
            className="no-stake"
            css={css`
              background: url(${DashboardBg}), no-repeat, #f1f1f1;
            `}
          >
            <p>You have no Staked Krav</p>
            {account && (
              <KRAVButton
                onClick={() => {
                  setIsStake(true)
                  setOpenStakeDialog(true)
                }}
                sx={{ width: '113px', mt: '32px', mb: '25px', zIndex: 3 }}
              >
                Staking Krav
              </KRAVButton>
            )}
            {!account && (
              <KRAVButton sx={{ width: '113px', mt: '32px', mb: '25px', zIndex: 3 }}>Connect Wallet</KRAVButton>
            )}
            <p>
              <span
                css={css`
                  font-family: 'Inter';
                  font-size: 16px;
                  font-weight: 500;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                `}
              >
                Learn more about Staking Krav&nbsp; <ArrowRight />
              </span>
            </p>
          </div>
        )}
      </div>
    </>
  )
}
