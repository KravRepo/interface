/** @jsxImportSource @emotion/react */
import { creatPool } from './style'
import { ReactComponent as BackIcon } from '../../assets/imgs/backIcon.svg'
import { ReactComponent as BackDarkIcon } from '../../assets/imgs/darkModel/back_icon_dark.svg'
import { ReactComponent as RightHook } from '../../assets/imgs/rightHook.svg'
import { css } from '@emotion/react'
import { align } from '../../globalStyle'
import { MenuItem, Select, useMediaQuery, useTheme } from '@mui/material'
import KRAVTextField from '../KravUIKit/KravTextField'
import KRAVButton from '../KravUIKit/KravButton'
import { ConfirmCreatPool } from '../../components/Dialog/ConfirmCreatPool'
import { useCallback, useEffect, useState } from 'react'
import { CreateLiquidityProps } from './type'
import { useRootStore } from '../../store/root'
import { useCheckAddressValidity } from '../../hook/hookV8/useCheckAddressValidity'
import { useContract } from '../../hook/hookV8/useContract'
import erc_20 from '../../abi/erc20.json'
import { VALIDITY_ADDRESS_LENGTH } from '../../constant/math'
import { Step } from './Step'

export const CreateLiquidity = ({ setCreateLiquidityPool }: CreateLiquidityProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [confirm, setConfirm] = useState(false)
  const [ticketSize, setTicketSize] = useState<string | number>(1)
  const [LPProvision, setLPProvision] = useState<string | number>('')
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [tokenDecimals, setTokenDecimals] = useState(1)
  const [market, setMarket] = useState('BTC')
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
      <div
        css={[
          creatPool,
          css`
            background: ${theme.background.primary};
            color: ${theme.text.primary};
          `,
        ]}
      >
        <div className="creat-pool-content">
          <div className="creat-pool-title">
            <div css={align}>
              {theme.palette.mode === 'dark' ? (
                <BackDarkIcon
                  css={css`
                    cursor: pointer;
                  `}
                  onClick={() => setCreateLiquidityPool(false)}
                  height="32"
                  width="32"
                />
              ) : (
                <BackIcon
                  css={css`
                    cursor: pointer;
                  `}
                  onClick={() => setCreateLiquidityPool(false)}
                  height="32"
                  width="32"
                />
              )}
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
          <div className={!isMobile ? 'creat-pool-table' : 'creat-pool-table-mobile'}>
            {isMobile && <Step />}
            <div className="table-left">
              <div className="input-params">
                <div>Choose Target Market</div>
                <Select
                  sx={{
                    width: '320px',
                    '& .MuiSelect-select>svg': {
                      display: 'none',
                    },
                  }}
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                >
                  <MenuItem
                    value={'BTC'}
                    selected={'BTC'.includes(market)}
                    sx={{
                      '& svg': {
                        marginLeft: 'auto',
                      },
                    }}
                  >
                    <span>BTC</span>
                    <span
                      css={css`
                        color: ${isBTCRise ? '#009b72' : '#db4c40'};
                        margin-left: 12px;
                      `}
                    >
                      {BTCPrice.toFixed(2)}
                    </span>
                    <RightHook />
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
                <div>Initial LP Provision</div>
                <KRAVTextField
                  value={LPProvision}
                  type="number"
                  onChange={(event) => setLPProvision(event.target.value)}
                  sx={{ width: '100%' }}
                />
                {/*<p>2000 X token Value about $200</p>*/}
              </div>
              <KRAVButton
                onClick={async () => {
                  const isValidity = await checkAddressValidity(tokenAddress)
                  if (isValidity) {
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
                background: ${theme.palette.mode === 'dark' ? '#4b4b4b' : '#dadada'};
              `}
            />
            {!isMobile && <Step />}
          </div>
        </div>
      </div>
    </>
  )
}
