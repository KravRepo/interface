import { Dispatch, SetStateAction } from 'react'
import { PoolParams } from 'store/FactorySlice'
import { UserData } from '../../hook/hookV8/useUserPosition'

export type DepositDAIParams = {}

export type YourPositionProps = {
  setAddLiquidity: Dispatch<SetStateAction<boolean>>
  setRemoveLiquidity: Dispatch<SetStateAction<boolean>>
  isLoadingUserPosition: boolean
}

export type TargetMarketProps = {
  setCreateLiquidityPool: Dispatch<SetStateAction<boolean>>
  setAddLiquidity: Dispatch<SetStateAction<boolean>>
}

export type ConfirmCreatPoolProps = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  tokenAddress: string
  ticketSize: number | string
  LPProvision: number | string
  tokenSymbol: string
  tokenDecimals: number
  setCreateLiquidityPool: Dispatch<SetStateAction<boolean>>
  setLPProvision: Dispatch<SetStateAction<string | number>>
  setTicketSize: Dispatch<SetStateAction<string | number>>
  setTokenAddress: Dispatch<SetStateAction<string>>
}

export type CreateLiquidityProps = {
  setCreateLiquidityPool: Dispatch<SetStateAction<boolean>>
}

export type AddLiquidityProps = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export type RemoveLiquidityProps = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export type PositionItemProps = {
  position: UserData
  setAddLiquidity: Dispatch<SetStateAction<boolean>>
  setRemoveLiquidity: Dispatch<SetStateAction<boolean>>
}

export type MarketItemProps = {
  setAddLiquidity: Dispatch<SetStateAction<boolean>>
  poolParams: PoolParams
}
