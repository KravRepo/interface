/** @jsxImportSource @emotion/react */
import { creatPool } from './style'
import { ReactComponent as BackIcon } from '../../assets/imgs/backIcon.svg'
import { css } from '@emotion/react'
import { align } from '../../globalStyle'
import { MenuItem, Select } from '@mui/material'
import KRAVTextField from '../KravUIKit/KravTextField'
import KRAVButton from '../KravUIKit/KravButton'
import { Trans } from '@lingui/macro'
import { ConfirmCreatPool } from 'components/Dialog/ConfirmCreatPool'
import { useCallback, useEffect, useState } from 'react'
import { CreateLiquidityProps } from './type'

import { useRootStore } from '../../store/root'
import { useCheckAddressValidity } from '../../hook/hookV8/useCheckAddressValidity'
import { useContract } from '../../hook/hookV8/useContract'
import erc_20 from 'abi/erc20.json'
import { VALIDITY_ADDRESS_LENGTH } from '../../constant/math'

export const CreateLiquidity = ({ setCreateLiquidityPool }: CreateLiquidityProps) => {
  const [confirm, setConfirm] = useState(false)
  const [ticketSize, setTicketSize] = useState<string | number>('')
  const [LPProvision, setLPProvision] = useState<string | number>('')
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [tokenDecimals, setTokenDecimals] = useState(1)
  const [market, setMarket] = useState('')
  const isBTCRise = useRootStore((state) => state.isBTCRise)
  const BTCPrice = useRootStore((state) => state.BTCPrice)
  const checkAddressValidity = useCheckAddressValidity()
  const tokenContract = useContract(tokenAddress.length === VALIDITY_ADDRESS_LENGTH ? tokenAddress : '', erc_20)
  const getTokenSymbol = useCallback(
    async (isAddressValidity: boolean) => {
      if (tokenAddress && isAddressValidity && tokenContract) {
        const req = await Promise.all([tokenContract.symbol(), tokenContract.decimals()])
        const symbol = req[0]
        const decimals = req[1]
        setTokenSymbol(symbol)
        setTokenDecimals(decimals)
      }
    },
    [tokenAddress, tokenContract]
  )

  useEffect(() => {
    if (tokenContract && tokenAddress?.length === VALIDITY_ADDRESS_LENGTH) {
      let isValidity = false
      try {
        checkAddressValidity(tokenAddress).then((res) => {
          isValidity = res
          if (isValidity) {
            getTokenSymbol(isValidity).then()
          }
        })
      } catch (e) {}
    }
  }, [tokenContract, tokenAddress])

  return (
    <>
      <ConfirmCreatPool
        ticketSize={ticketSize}
        tokenAddress={tokenAddress}
        LPProvision={LPProvision}
        setLPProvision={setLPProvision}
        setTicketSize={setTicketSize}
        setTokenAddress={setTokenAddress}
        isOpen={confirm}
        setIsOpen={setConfirm}
        tokenSymbol={tokenSymbol}
        tokenDecimals={tokenDecimals}
        setCreateLiquidityPool={setCreateLiquidityPool}
      />
      <div css={creatPool}>
        <div className="creat-pool-content">
          <div className="creat-pool-title">
            <div css={align}>
              <BackIcon
                css={css`
                  cursor: pointer;
                `}
                onClick={() => setCreateLiquidityPool(false)}
                height="32"
                width="32"
              />
              <span
                css={css`
                  padding-left: 12px;
                `}
              >
                Go back
              </span>
            </div>
            <div
              css={css`
                font-size: 20px;
              `}
            >
              Liquidity Creation
            </div>
            <div />
          </div>
          <div className="creat-pool-table">
            <div className="table-left">
              <div className="input-params">
                <div>Choose Target Market</div>
                <Select sx={{ width: '320px' }} value={market} onChange={(e) => setMarket(e.target.value)}>
                  <MenuItem value={'BTC'}>
                    <span>BTC</span>
                    <span
                      css={css`
                        color: ${isBTCRise ? '#009b72' : '#db4c40'};
                        margin-left: 12px;
                      `}
                    >
                      {BTCPrice.toFixed(2)}
                    </span>
                  </MenuItem>
                </Select>
              </div>
              <div className="input-params">
                <div>Select Token Collateral</div>
                <KRAVTextField
                  label="Enter Asset contract or select Asset"
                  // InputProps={{
                  //   endAdornment: <KRAVButton sx={{ width: '92px' }}>My asset</KRAVButton>,
                  // }}
                  value={tokenAddress}
                  onChange={(event) => setTokenAddress(event.target.value)}
                  sx={{ width: '100%' }}
                >
                  <span>My Asset</span>
                </KRAVTextField>
              </div>
              <div className="input-params">
                <div>Set Ticket Size</div>
                <div
                  css={css`
                    display: grid;
                    grid-template-columns: auto 1fr;
                    align-items: center;
                  `}
                >
                  <div
                    css={css`
                      margin-right: 16px;
                    `}
                  >
                    1 BTC =
                  </div>
                  <div>
                    <KRAVTextField
                      value={ticketSize}
                      type="number"
                      onChange={(event) => setTicketSize(Number(event.target.value))}
                      sx={{ width: '100%' }}
                    >
                      <span>DAI token</span>
                    </KRAVTextField>
                  </div>
                </div>
              </div>
              <div className="input-params">
                <div>Initial LP Provision</div>
                <KRAVTextField
                  value={LPProvision}
                  type="number"
                  onChange={(event) => setLPProvision(Number(event.target.value))}
                  sx={{ width: '100%' }}
                />
                {/*<p>2000 X token Value about $200</p>*/}
              </div>
              <KRAVButton
                onClick={async () => {
                  const isValidity = await checkAddressValidity(tokenAddress)
                  console.log('checked pass')
                  if (isValidity) {
                    console.log('get token symbol')
                    await getTokenSymbol(isValidity)
                    setConfirm(true)
                  }
                }}
                disabled={tokenAddress.length !== VALIDITY_ADDRESS_LENGTH || !ticketSize || !LPProvision}
                sx={{ position: 'absolute', bottom: 0 }}
              >
                Deposit and create
              </KRAVButton>
            </div>
            <div
              css={css`
                width: 1px;
                background: #dadada;
              `}
            />
            <div className="table-right">
              <div className="step">
                <p>
                  <Trans>Step 1 Choose Target Market</Trans>
                </p>
                <p>
                  <Trans>
                    With BTC as the underlying asset, different assets are used as investment products for perpetual
                    option transactions. The asset selected by the pool you created now will be used as the transaction
                    asset.
                  </Trans>
                </p>
              </div>
              <div className="step">
                <p>
                  <Trans>Step 2 Select Token Collateral</Trans>
                </p>
                <p>
                  <Trans>
                    With BTC as the underlying asset, different assets are used as investment products for perpetual
                    option transactions. The asset selected by the pool you created now will be used as the transaction
                    asset.
                  </Trans>
                </p>
              </div>
              <div className="step">
                <p>
                  <Trans>Step 3 Set Ticket Size</Trans>
                </p>
                <p>
                  This conversion ratio is a fixed value and is not affected by the price of{' '}
                  <span
                    css={css`
                      color: #009b72;
                    `}
                  >
                    {tokenSymbol === '' ? 'X' : tokenSymbol}
                  </span>{' '}
                  token. The transaction profit and loss will be settled in BTC, and finally settled with{' '}
                  <span
                    css={css`
                      color: #009b72;
                    `}
                  >
                    {tokenSymbol === '' ? 'X' : tokenSymbol}
                  </span>{' '}
                  token according to the conversion ratio.
                </p>
              </div>
              <div className="step">
                <p>
                  <Trans>Step 4 Initial LP Provision</Trans>
                </p>
                <p>
                  <Trans>
                    The assets you deposit will be part of the liquidity pool and receive fees from each trade placed on
                    the platform in exchange for serving as the counterparty to all trades.
                  </Trans>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
