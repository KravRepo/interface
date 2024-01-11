/** @jsxImportSource @emotion/react */
import { ReactComponent as KravToken } from '../../assets/imgs/krav_token.svg'
import { ReactComponent as VeKravToken } from '../../assets/imgs/tokens/default_token.svg'
import { css } from '@emotion/react'
import KRAVTab from '../KravUIKit/KravTab'
import { useMediaQuery, useTheme } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { BURN_ADDRESS, ChainId } from '../../constant/chain'
import { useWeb3React } from '@web3-react/core'
import { eXDecimals } from '../../utils/math'
import { formatNumber, getProviderOrSigner } from '../../utils'
import { useRootStore } from '../../store/root'
import { Contract } from 'ethers'
import erc20 from '../../abi/test_erc20.json'

export const ExchangeOverview = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const { account, chainId, provider } = useWeb3React()
  const [totalStakeAmount, setTotalStakeAmount] = useState(new BigNumber(0))
  const userPositionDatas = useRootStore((store) => store.userPositionDatas)
  const oldKravDetails = useMemo(() => {
    if (userPositionDatas.length > 0) {
      const krav = userPositionDatas.find((item) => item.pool.symbol === 'KRAV')
      if (krav) return krav
      else return
    } else return
  }, [userPositionDatas])
  const getTotalStaked = useCallback(async () => {
    if (chainId === ChainId.BASE || chainId === ChainId.BASE_TEST) {
      if (account && provider && oldKravDetails) {
        const kravContract = new Contract(oldKravDetails.pool.tokenT, erc20.abi, getProviderOrSigner(provider, account))
        const totalStakeAmount = await kravContract.balanceOf(BURN_ADDRESS)
        setTotalStakeAmount(eXDecimals(new BigNumber(totalStakeAmount._hex), 18))
      }
    }
  }, [account, chainId, provider, oldKravDetails])

  useEffect(() => {
    getTotalStaked().then()
    const interval = setInterval(() => getTotalStaked(), 15000)
    return () => clearInterval(interval)
  }, [getTotalStaked])

  return (
    <div
      css={css`
        padding: ${isMobile ? '32px 16px' : '64px 40px'};
        display: ${isMobile ? 'block' : 'grid'};
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        border-radius: 0 0 8px 8px;
        background: ${theme.background.primary};
        font-family: 'GT-Flexa-Bold-Trial';
        margin-bottom: 24px;
      `}
    >
      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr 1px 1.52fr;
          align-items: center;
          background: ${theme.background.second};
          border-radius: 16px;
          height: ${isMobile ? '110px' : '200px'};
          padding: ${isMobile ? '14px 20px' : '18px 48px'};
          > div:last-of-type {
            padding-left: ${isMobile ? '14px' : '56px'};
          }
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: center;
            > span {
              margin-left: 8px;
              font-size: ${isMobile ? '20px' : '40px'};
            }
          `}
        >
          <KravToken
            css={css`
              height: ${isMobile ? '32px' : '64px'};
              width: ${isMobile ? '32px' : '64px'};
            `}
          />
          <span>KRAV</span>
        </div>
        <div
          css={css`
            border: ${theme.splitLine.primary};
            height: 100%;
          `}
        />
        <div>
          <KRAVTab>Total Stake</KRAVTab>
          <p
            css={css`
              margin-top: 10px;
              font-size: ${isMobile ? '20px' : '28px'};
            `}
          >
            {formatNumber(totalStakeAmount.toString(), 4, false)} KRAV
          </p>
        </div>
      </div>
      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr 1px 1.52fr;
          align-items: center;
          height: ${isMobile ? '110px' : '200px'};
          padding: ${isMobile ? '14px 20px' : '18px 48px'};
          background: ${theme.background.second};
          border-radius: 16px;
          margin-top: ${isMobile ? '24px' : ''};
          > div:last-of-type {
            padding-left: ${isMobile ? '14px' : '56px'};
          }
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: center;
            > span {
              margin-left: 8px;
              font-size: ${isMobile ? '20px' : '40px'};
            }
          `}
        >
          <VeKravToken
            css={css`
              height: ${isMobile ? '32px' : '64px'};
              width: ${isMobile ? '32px' : '64px'};
            `}
          />
          <span>???</span>
        </div>
        <div
          css={css`
            border: ${theme.splitLine.primary};
            height: 100%;
          `}
        />
        <div>
          <KRAVTab>Mint will start after</KRAVTab>
          <p
            css={css`
              margin-top: 10px;
              font-size: ${isMobile ? '20px' : '28px'};
            `}
          >
            ??:??:??
          </p>
        </div>
      </div>
    </div>
  )
}
