import BigNumber from 'bignumber.js'
import { Tuple } from '../../../components/Trades/type'
import { eXDecimals } from '../../../utils/math'
import {
  FOUR_YEAR_TIMESTAMP,
  HALF_YEAR_TIMESTAMP,
  ONE_WEEK_TIMESTAMP,
  ONE_YEAR_TIMESTAMP,
  TOW_YEAR_TIMESTAMP,
} from '../../../constant/math'
import { creatCall, CreatCall, decodeCallResult } from '../useContract'
import { Contract } from 'ethers'

export type EthersBigNumber = {
  _hex: string
  _isBigNumber: boolean
}

export type openTradeRawData = {
  buy: boolean
  index: EthersBigNumber
  initialPosToken: EthersBigNumber
  trader: string
  sl: EthersBigNumber
  tp: EthersBigNumber
  pairIndex: EthersBigNumber
  openPrice: EthersBigNumber
  leverage: EthersBigNumber
  positionSizeDai: EthersBigNumber
}

export const forMatterOpenTrades = (
  res: openTradeRawData[],
  trades: number,
  account: string,
  isPendingOrder: boolean,
  orderId?: BigNumber,
  isInPending?: boolean
) => {
  if (!isPendingOrder) {
    res = res.filter((item) => new BigNumber(item.leverage._hex).isGreaterThan(0))
  }
  const userOpenTrades: Tuple[] = []

  for (let i = 0; i < trades; i++) {
    userOpenTrades.push({
      buy: res[i].buy,
      index: new BigNumber(res[i].index._hex).toNumber(),
      initialPosToken: isPendingOrder
        ? eXDecimals(res[i].positionSizeDai._hex, 18)
        : eXDecimals(res[i].initialPosToken._hex, 18),
      trader: account,
      sl: eXDecimals(res[i].sl._hex, 10),
      tp: eXDecimals(res[i].tp._hex, 10),
      pairIndex: new BigNumber(res[i].pairIndex._hex).toNumber(),
      openPrice: eXDecimals(res[i].openPrice._hex, 10),
      leverage: new BigNumber(res[i].leverage._hex).toNumber(),
      positionSizeDai: eXDecimals(res[i].positionSizeDai._hex, 18),
      beingMarketClosed: false,
      isPendingOrder: isPendingOrder,
      orderId: orderId,
      isInPending: isInPending,
    })
  }
  return userOpenTrades
}

export const isBeingMarketClosed = (marketOrders: Tuple[], pendingMarketOrders: Tuple[]) => {
  marketOrders.forEach((order) => {
    pendingMarketOrders.forEach((pendingOrder) => {
      if (pendingOrder.index === order.index && pendingOrder.leverage === 0) order.beingMarketClosed = true
    })
  })
}

export const getLockTime = (lockTime: number) => {
  let forMatterLockTime = 0
  switch (lockTime) {
    case 1:
      forMatterLockTime = Math.floor(HALF_YEAR_TIMESTAMP / ONE_WEEK_TIMESTAMP) * ONE_WEEK_TIMESTAMP
      break
    case 2:
      forMatterLockTime = Math.floor(ONE_YEAR_TIMESTAMP / ONE_WEEK_TIMESTAMP) * ONE_WEEK_TIMESTAMP
      break
    case 3:
      forMatterLockTime = Math.floor(TOW_YEAR_TIMESTAMP / ONE_WEEK_TIMESTAMP) * ONE_WEEK_TIMESTAMP
      break
    case 4:
      forMatterLockTime = Math.floor(FOUR_YEAR_TIMESTAMP / ONE_WEEK_TIMESTAMP) * ONE_WEEK_TIMESTAMP
      break
    default:
      forMatterLockTime = 0
  }
  return forMatterLockTime
}

export type Task = {
  call: CreatCall[]
  method: string[]
  contractIns: Contract[]
  withDetails: any[]
}
export class Multicall {
  public muticall: Contract
  public task = {} as Task
  public call: CreatCall[] = []
  public method: string[] = []
  public contractIns: Contract[] = []
  public withDetails: any[] = []
  constructor(multicall: Contract) {
    this.muticall = multicall
    this.task = {
      call: [],
      method: [],
      contractIns: [],
      withDetails: [],
    }
  }
  public addTask(func: string, params: any[], contract: Contract, withDetails: any) {
    this.task.call.push(creatCall(contract.address, contract.interface, func, params))
    this.task.method.push(func)
    this.task.contractIns.push(contract)
    this.task.withDetails.push(withDetails)
  }
  public async sendCall() {
    const send = await this.muticall.callStatic.aggregate(this.task.call)
    let returnData = send.returnData
    returnData = returnData.map((data: string, index: number) => {
      return decodeCallResult(this.task.contractIns[index].interface, this.task.method[index], data)
    })
    return {
      returnData: returnData,
      details: this.task.withDetails,
    }
  }
  public clear() {
    this.task = {
      call: [],
      method: [],
      contractIns: [],
      withDetails: [],
    }
  }
}
