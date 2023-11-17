import BigNumber from 'bignumber.js'

export const MAX_UNIT_256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const LIQ_THRESHOLD_P = 90
export const OPEN_FEES = 0.0015
export const CLOSE_FEES = 0.0006
export const DAI_TO_BTC = 1000
export const MAX_GAIN_P = 900
export const PRECISION = new BigNumber(10).pow(10)
export const VALIDITY_ADDRESS_LENGTH = 42
export const POSITION_LIMITS = 3
export const MINI_POSITION_SIZE = 1500
export const ONE_DAY_TIMESTAMP = 3600000 * 24
export const BASE_ONE_HOUR_BLOCK = (60 * 60) / 2
export const ONE_YEAR_TIMESTAMP = ONE_DAY_TIMESTAMP * 365
export const WITHDRAW_BLOCK_DIFF = 43200
export const API_DECIMALS = 10000
export const TOW_YEAR_TIMESTAMP = ONE_YEAR_TIMESTAMP * 2
export const FOUR_YEAR_TIMESTAMP = ONE_YEAR_TIMESTAMP * 4
export const HALF_YEAR_TIMESTAMP = ONE_DAY_TIMESTAMP * 180
export const ONE_WEEK_TIMESTAMP = ONE_DAY_TIMESTAMP * 7
