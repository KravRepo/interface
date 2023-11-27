/** @jsxImportSource @emotion/react */
import { ReactComponent as HandIcon } from '../../assets/imgs/referral_hand.svg'
import { ReactComponent as TWIcon } from '../../assets/imgs/referral_tw.svg'
import { ReactComponent as TGIcon } from '../../assets/imgs/referral_tg.svg'
import { ReactComponent as TWDarkIcon } from '../../assets/imgs/darkModel/referral_tw_dark.svg'
import { ReactComponent as TGDarkIcon } from '../../assets/imgs/darkModel/referral_tg_dark.svg'
// import { ReactComponent as Medium } from '../../assets/imgs/medium.svg'
// import { ReactComponent as DiscordIcon } from '../../assets/imgs/referral_discord.svg'
import { ReactComponent as KravLogo } from '../../assets/imgs/referral_logo.svg'
import { ReactComponent as Notify } from '../../assets/imgs/referral_notify.svg'
import KRAVButton from '../KravUIKit/KravButton'
import { referral } from './style'
import { css } from '@emotion/react'
import { align } from '../../globalStyle'
import { useCallback, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { base64 } from 'ethers/lib/utils'
import { utils } from 'ethers'
import { Tooltip, useMediaQuery, useTheme } from '@mui/material'
import { useRootStore } from '../../store/root'
import { useNumReferral } from '../../hook/hookV8/useNumReferral'
import { useReferral } from '../../hook/hookV8/useReferral'
import { getBigNumberStr } from '../../utils'
import copy from 'copy-to-clipboard'
import { CHAINS } from '../../connectors/chain'

export const Referral = () => {
  const { account } = useWeb3React()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [openTooltip, setOpenTooltip] = useState(false)
  const [numReferral, setNumReferral] = useState(0)
  useNumReferral(setNumReferral)
  const { useRewardInfo, claimRewards, buttonEnable } = useReferral()
  const setWalletDialogVisibility = useRootStore((store) => store.setWalletDialogVisibility)
  const expectChainId = useRootStore((store) => store.expectChainId)
  const inviteChain = useMemo(() => {
    return CHAINS[expectChainId]?.name
  }, [expectChainId])
  const useCopyLink = useCallback(async () => {
    if (account) {
      const host = document.documentURI
      const url = host.split('/')
      const link = url[0] + '//' + url[2] + '/trade/'
      const encode = base64.encode(utils.toUtf8Bytes(account))
      try {
        await navigator.clipboard.writeText(link + encode)
        setOpenTooltip(true)
        setTimeout(() => {
          setOpenTooltip(false)
        }, 3000)
      } catch (e) {
        console.error('copy failed!', e)
        copy(link + encode)
        setTimeout(() => {
          setOpenTooltip(false)
        }, 3000)
      }
    }
  }, [account])
  return (
    <div css={referral}>
      <div className="referral-title">
        <div className="referral-title-left">
          <div>
            <span
              css={css`
                color: ${theme.text.primary};
              `}
            >
              Invite Friends Now!
            </span>
            <HandIcon
              css={css`
                margin-left: 19px;
              `}
            />
          </div>
          <p
            css={css`
              color: ${theme.text.third};
            `}
          >
            Invite Friends Now! Invite Friends Now! Invite Friends Now!Invite Friends Now!
          </p>
        </div>
        <div
          css={css`
            display: flex;
          `}
        >
          <div
            css={css`
              background: #2832f5;
              width: 21px;
              height: 216px;
              border-radius: 4px 0 0 4px;
              padding: 14px 0;
              @media screen and (max-width: 360px) {
                display: none;
              }
            `}
          >
            <div
              className="ellipse"
              css={css`
                background: ${theme.background.second};
              `}
            />
            <div
              className="ellipse"
              css={css`
                background: ${theme.background.second};
              `}
            />
            <div
              className="ellipse"
              css={css`
                background: ${theme.background.second};
              `}
            />
            <div
              className="ellipse"
              css={css`
                background: ${theme.background.second};
              `}
            />
            <div
              className="ellipse"
              css={css`
                background: ${theme.background.second};
              `}
            />
            <div
              className="ellipse"
              css={css`
                background: ${theme.background.second};
              `}
            />
            <div
              className="ellipse"
              css={css`
                background: ${theme.background.second};
              `}
            />
          </div>
          <div
            css={css`
              background: #2832f5;
              width: 90px;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 216px;
              color: white;
              font-size: 14px;
              @media screen and (max-width: 360px) {
                display: none;
              }
            `}
          >
            <div>
              <KravLogo />
              <p>Referral</p>
            </div>
          </div>
          <div
            css={css`
              width: 11px;
              height: 216px;
              position: relative;
              border-right: 2px dashed #959595;
              background: #2832f5;
              @media screen and (max-width: 360px) {
                display: none;
              }
            `}
          >
            <div
              className="triangle-down"
              css={css`
                border-top: 15px solid ${theme.background.second};
              `}
            />
            <div
              className="triangle-up"
              css={css`
                border-bottom: 15px solid ${theme.background.second};
              `}
            />
          </div>
          <div
            css={css`
              background: #2832f5;
              width: 322px;
              height: 216px;
              border-radius: 4px;
              position: relative;
            `}
          >
            <div
              css={css`
                @media screen and (max-width: 450px) {
                  display: none;
                }
              `}
              className="rotate-text"
            >
              Invite your friends
            </div>
            <div className="referral-title-right">
              <p>COPY REFERRAL LINK</p>
              <KRAVButton sx={{ width: '115px', background: '#000' }}>Invite friends</KRAVButton>
              <div />
            </div>
          </div>
        </div>
      </div>
      <div
        className="referral-link"
        css={css`
          border-bottom: ${isMobile ? 'unset' : theme.splitLine.primary};
          color: ${theme.text.primary};
        `}
      >
        <div
          css={css`
            border-right: ${isMobile ? 'unset' : theme.splitLine.primary};
            border-bottom: ${isMobile ? theme.splitLine.primary : 'unset'};
            padding-bottom: ${isMobile ? '24px' : ''};
          `}
        >
          <p
            css={css`
              color: ${theme.text.third};
            `}
          >
            Invite Chain
          </p>
          <p>{inviteChain}</p>
        </div>
        <div
          css={css`
            border-bottom: ${isMobile ? theme.splitLine.primary : 'unset'};
          `}
        >
          <div>
            <span
              css={css`
                color: ${theme.text.third};
              `}
            >
              Your Referral Link
            </span>
          </div>
          <div
            css={css`
              display: ${isMobile ? 'block' : 'flex'};
              align-items: center;
            `}
          >
            <div
              className="link-text"
              css={css`
                border: ${theme.splitLine.primary};
                background: ${theme.palette.mode === 'dark' ? '#1c1e23' : '#f6f6f6'};
              `}
            >
              <span>https://app.krav.trade/trade/</span>
              <div
                css={css`
                  border-left: ${theme.splitLine.primary};
                `}
              >
                <span>Hash</span>
                <span
                  css={css`
                    color: ${theme.text.third};
                  `}
                >
                  Referral Code
                </span>
              </div>
            </div>
            {account && (
              <Tooltip placement="top" sx={{ color: '#009B72' }} open={openTooltip} title="Copied to clipboard!">
                <KRAVButton
                  onClick={useCopyLink}
                  sx={{
                    width: '140px',
                    ml: isMobile ? '0' : '8px',
                    mt: isMobile ? '8px' : '0',
                    '&:hover': {
                      backgroundColor: '#757575',
                    },
                    '&:active': {
                      backgroundColor: '#2e2e2e',
                    },
                  }}
                >
                  Copy referral link
                </KRAVButton>
              </Tooltip>
            )}
            {!account && (
              <KRAVButton
                sx={{ width: '140px', ml: isMobile ? '0' : '8px', mt: isMobile ? '8px' : '0' }}
                onClick={() => {
                  setWalletDialogVisibility(true)
                }}
              >
                Connect Wallet
              </KRAVButton>
            )}
          </div>
        </div>
        <div
          css={css`
            border-left: ${isMobile ? 'unset' : theme.splitLine.primary};
          `}
        >
          <p
            css={css`
              color: ${theme.text.third};
            `}
          >
            Share On Social Media
          </p>
          <div className="social">
            {theme.palette.mode === 'dark' ? (
              <TWDarkIcon onClick={() => window.open('https://twitter.com/kravtrade')} />
            ) : (
              <TWIcon onClick={() => window.open('https://twitter.com/kravtrade')} />
            )}
            {theme.palette.mode === 'dark' ? (
              <TGDarkIcon
                onClick={() => window.open('https://t.me/kravtrade')}
                css={css`
                  margin: 0 12px;
                `}
              />
            ) : (
              <TGIcon
                onClick={() => window.open('https://t.me/kravtrade')}
                css={css`
                  margin: 0 12px;
                `}
              />
            )}

            {/* <Medium onClick={() => window.open('https://medium.com/kravtrade')} /> */}
          </div>
        </div>
      </div>
      <div
        className="referral-stats"
        css={css`
          background: ${theme.palette.mode === 'dark' ? '#1c1e23' : '#f6f6f6'};
          color: ${theme.text.primary};
        `}
      >
        <p>Your Referral stats</p>
        <div>
          <div className="referral-stats-item">
            <p>{numReferral}</p>
            <p
              css={[
                align,
                css`
                  color: ${theme.text.third};
                `,
              ]}
            >
              FRIENDS INVITED&nbsp; <Notify />{' '}
            </p>
          </div>
          {/*<div className="referral-stats-item line">*/}
          {/*  <p>-- </p>*/}
          {/*  <p>You Have Earned</p>*/}
          {/*</div>*/}
          {/*<div className="referral-stats-item line">*/}
          {/*  <p>--</p>*/}
          {/*  <p css={align}>*/}
          {/*    REFERRALS POINTS&nbsp; <Notify />{' '}*/}
          {/*  </p>*/}
          {/*</div>*/}
        </div>
      </div>
      <div
        className="referral-leaderboard"
        css={css`
          color: ${theme.text.primary};
        `}
      >
        <div>
          <span>Invite Rewards</span>
          <KRAVButton
            disabled={!buttonEnable}
            onClick={async () => {
              await claimRewards()
            }}
            sx={{ width: 'auto' }}
          >
            Claim
          </KRAVButton>
        </div>
        <div
          css={css`
            background: ${theme.palette.mode === 'dark' ? '#1c1e23' : '#f6f6f6'};
          `}
        >
          <span>TOKEN</span>
          <span>AMOUNT</span>
        </div>
        {useRewardInfo.map((info) => {
          return (
            <div
              key={info.pool.tradingT}
              className="friends-item"
              css={css`
                border-bottom: ${theme.splitLine.primary};
              `}
            >
              <span>{info.pool.symbol}</span>
              <span>{getBigNumberStr(info.amount, 4)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
