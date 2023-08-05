/** @jsxImportSource @emotion/react */
import { ReactComponent as HandIcon } from '../../assets/imgs/referral_hand.svg'
import { ReactComponent as TWIcon } from '../../assets/imgs/referral_tw.svg'
import { ReactComponent as TGIcon } from '../../assets/imgs/referral_tg.svg'
import { ReactComponent as DiscordIcon } from '../../assets/imgs/referral_discord.svg'
import { ReactComponent as KravLogo } from '../../assets/imgs/referral_logo.svg'
import { ReactComponent as Notify } from '../../assets/imgs/referral_notify.svg'
import KRAVButton from '../KravUIKit/KravButton'
import { referral } from './style'
import { css } from '@emotion/react'
import { align } from '../../globalStyle'
import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { base64 } from 'ethers/lib/utils'
import { utils } from 'ethers'
import { Tooltip } from '@mui/material'
import { useRootStore } from '../../store/root'
import { useNumReferral } from '../../hook/hookV8/useNumReferral'

export const Referral = () => {
  const { account } = useWeb3React()
  const [openTooltip, setOpenTooltip] = useState(false)
  const [numReferral, setNumReferral] = useState(0)
  useNumReferral(setNumReferral)
  const setWalletDialogVisibility = useRootStore((store) => store.setWalletDialogVisibility)
  const useCopyLink = useCallback(async () => {
    if (account) {
      try {
        const host = document.documentURI
        const url = host.split('/')
        const link = url[0] + '//' + url[2] + '/trade/'
        console.log('link', link)
        const encode = base64.encode(utils.toUtf8Bytes(account))
        await navigator.clipboard.writeText(link + encode)
        setOpenTooltip(true)
        setTimeout(() => {
          setOpenTooltip(false)
        }, 3000)
      } catch (e) {
        console.error('copy failed!', e)
      }
    }
  }, [account])
  return (
    <div css={referral}>
      <div className="referral-title">
        <div className="referral-title-left">
          <div>
            <span>Invite Friends Now!</span>
            <HandIcon
              css={css`
                margin-left: 19px;
              `}
            />
          </div>
          <p>Invite Friends Now! Invite Friends Now! Invite Friends Now!Invite Friends Now!</p>
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
            `}
          >
            <div className="ellipse" />
            <div className="ellipse" />
            <div className="ellipse" />
            <div className="ellipse" />
            <div className="ellipse" />
            <div className="ellipse" />
            <div className="ellipse" />
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
            `}
          >
            <div className="triangle-down" />
            <div className="triangle-up" />
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
            <div className="rotate-text">Invite your friends</div>
            <div className="referral-title-right">
              <p>COPY REFERRAL LINK</p>
              <KRAVButton sx={{ width: '115px' }}>Invite friends</KRAVButton>
              <div />
            </div>
          </div>
        </div>
      </div>
      <div className="referral-link">
        <div>
          <p>Invite Chain</p>
          <p>Base</p>
        </div>
        <div>
          <div>
            <span>Your Referral Link</span>
          </div>
          <div css={align}>
            <div className="link-text">
              <span>https://base.krav.trade/trade/</span>
              <div>
                <span>Hash</span>
                <span>Referral Code</span>
              </div>
            </div>
            {account && (
              <Tooltip placement="top" sx={{ color: '#009B72' }} open={openTooltip} title="Copied to clipboard!">
                <KRAVButton
                  onClick={useCopyLink}
                  sx={{
                    width: '140px',
                    ml: '8px',
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
                sx={{ width: '140px', ml: '8px' }}
                onClick={() => {
                  setWalletDialogVisibility(true)
                }}
              >
                Connect Wallet
              </KRAVButton>
            )}
          </div>
        </div>
        <div>
          <p>Share On Social Media</p>
          <div className="social">
            <TWIcon />
            <TGIcon
              css={css`
                margin: 0 12px;
              `}
            />
            <DiscordIcon />
          </div>
        </div>
      </div>
      <div className="referral-stats">
        <p>Your Referral stats</p>
        <div>
          <div className="referral-stats-item">
            <p>{numReferral}</p>
            <p css={align}>
              FRIENDS INVITED&nbsp; <Notify />{' '}
            </p>
          </div>
          <div className="referral-stats-item line">
            <p>-- </p>
            <p>You Have Earned</p>
          </div>
          <div className="referral-stats-item line">
            <p>--</p>
            <p css={align}>
              REFERRALS POINTS&nbsp; <Notify />{' '}
            </p>
          </div>
        </div>
      </div>
      {/*<div className="referral-leaderboard">*/}
      {/*  <div>Invite Friends Leaderboard</div>*/}
      {/*  <div>*/}
      {/*    <span>ADDRESS</span>*/}
      {/*    <span>INVITE NUMBERS</span>*/}
      {/*  </div>*/}
      {/*  <div className="friends-item">*/}
      {/*    <span>0x813ce1ad36...4eb65a7d722A61</span>*/}
      {/*    <span>566</span>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  )
}
