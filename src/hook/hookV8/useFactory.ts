import { TEST_RPC_NODE } from '../../constant/chain'
import { Contract, ethers } from 'ethers'
import { creatCall, decodeCallResult, useFactoryContract } from './useContract'
import type { JsonRpcProvider } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useRootStore } from '../../store/root'
import { PoolParams } from '../../store/FactorySlice'
import test_erc20 from '../../abi/test_erc20.json'
import pair_storage from '../../abi/pair_storage_v6.json'
import pair_info from '../../abi/pair_info_v6_1.json'
import multicall2 from '../../abi/multicall2.json'
import trading_vault from '../../abi/trading_vault_v5.json'
import { eXDecimals } from '../../utils/math'
import BigNumber from 'bignumber.js'
import { Interface } from 'ethers/lib/utils'

enum Task {
  tokenTask = 0,
  decimalsTask = 1,
  pairStorageTask = 2,
  vaultSupplyTask = 3,
  vaultBalanceTask = 4,
  groupCollateralLong = 5,
  groupCollateralShort = 6,
  maxWithdrawPTask = 7,
  pairParams = 8,
  accDaiPerDaiTask = 9,
}

enum TaskFunc {
  SYMBOL = 'symbol',
  DECIMALS = 'decimals',
  PAIRS = 'pairs',
  CURRENT_BALANCE_DAI = 'currentBalanceDai',
  MAX_BALANCE_DAI = 'maxBalanceDai',
  GROUP_COLLATERAL = 'groupCollateral',
  MAX_WITHDRAW_P = 'maxWithdrawP',
  PAIR_PARAMS = 'pairParams',
  ACC_DAI_PER_DAI = 'accDaiPerDai',
}

export const useFactory = () => {
  const setAllPoolParams = useRootStore((store) => store.setAllPoolParams)
  const setIsLoadingFactory = useRootStore((store) => store.setIsLoadingFactory)
  const provider = new ethers.providers.JsonRpcProvider(TEST_RPC_NODE) as JsonRpcProvider
  const factory = useFactoryContract(provider)!

  return useCallback(async () => {
    try {
      const totalPools = await factory.quantosCount()
      const blockNumber = await provider.getBlockNumber()
      const poolsParams = []
      // const ethcallProvider = new Provider(provider)
      // await ethcallProvider.init()
      for (let i = 0; i < totalPools; i++) {
        poolsParams.push(factory.quantos(i))
      }
      const res = await Promise.all(poolsParams)
      let forMatter = [] as PoolParams[]
      const tokenTask: any[] = []
      const decimalsTask: any[] = []
      const pairStorageTask: any[] = []
      const vaultSupplyTask: any[] = []
      const vaultBalanceTask: any[] = []
      const groupCollateralLong: any[] = []
      const groupCollateralShort: any[] = []
      const maxWithdrawPTask: any[] = []
      const pairParams: any[] = []
      const accDaiPerDaiTask: any[] = []
      res.forEach((item) => {
        //TODO check pairs tokenT is ERC20
        forMatter.push({
          tokenT: item.tokenT,
          storageT: item.storageT,
          pairInfoT: item.pairInfoT,
          pairStorageT: item.pairStorageT,
          tradingT: item.tradingT,
          callbackT: item.callbackT,
          rewardT: item.rewardT,
          vaultT: item.vaultT,
          priceAggregatorT: item.priceAggregatorT,
          symbol: '',
          proportionBTC: 0,
          decimals: 0,
          blockNumber: blockNumber,
          utilization: new BigNumber(0),
          maxWithdrawP: new BigNumber(0),
          logoSource: null,
          fundingFeePerBlockP: new BigNumber(0),
          accDaiPerDai: new BigNumber(0),
        })
      })
      console.log('before task', forMatter)
      const multicall = new Contract(multicall2.address, multicall2.abi, provider)
      const pairStorageInterface = new Interface(pair_storage.abi)
      const pairInfoInterface = new Interface(pair_info.abi)
      const tokenInterface = new Interface(test_erc20.abi)
      const vaultInterface = new Interface(trading_vault.abi)
      forMatter.forEach((item) => {
        tokenTask.push(creatCall(item.tokenT, tokenInterface, TaskFunc.SYMBOL, []))
        decimalsTask.push(creatCall(item.tokenT, tokenInterface, TaskFunc.DECIMALS, []))
        pairStorageTask.push(creatCall(item.pairStorageT, pairStorageInterface, TaskFunc.PAIRS, [0]))
        vaultBalanceTask.push(creatCall(item.vaultT, vaultInterface, TaskFunc.CURRENT_BALANCE_DAI, []))
        vaultSupplyTask.push(creatCall(item.vaultT, vaultInterface, TaskFunc.MAX_BALANCE_DAI, []))
        groupCollateralLong.push(
          creatCall(item.pairStorageT, pairStorageInterface, TaskFunc.GROUP_COLLATERAL, [0, true])
        )
        groupCollateralShort.push(
          creatCall(item.pairStorageT, pairStorageInterface, TaskFunc.GROUP_COLLATERAL, [0, false])
        )
        maxWithdrawPTask.push(creatCall(item.vaultT, vaultInterface, TaskFunc.MAX_WITHDRAW_P, []))
        pairParams.push(creatCall(item.pairInfoT, pairInfoInterface, TaskFunc.PAIR_PARAMS, [0]))
        accDaiPerDaiTask.push(creatCall(item.vaultT, vaultInterface, TaskFunc.ACC_DAI_PER_DAI, []))
      })

      const factoryReturn = await multicall.callStatic.aggregate([
        ...tokenTask,
        ...decimalsTask,
        ...pairStorageTask,
        ...vaultSupplyTask,
        ...vaultBalanceTask,
        ...groupCollateralLong,
        ...groupCollateralShort,
        ...maxWithdrawPTask,
        ...pairParams,
        ...accDaiPerDaiTask,
      ])
      const factoryCall = factoryReturn.returnData
      // forMatter.forEach((item) => {
      //   const pairStorageContract = new Contract(item.pairStorageT, pair_storage.abi, provider)
      //   const pairInfoContract = new Contract(item.pairInfoT, pair_info.abi, provider)
      //   const tokenContract = new Contract(item.tokenT, test_erc20.abi, provider)
      //   const vaultContract = new Contract(item.vaultT, trading_vault.abi, provider)
      //   tokenTask.push(tokenContract.symbol())
      //   decimalsTask.push(tokenContract.decimals())
      //   pairStorageTask.push(pairStorageContract.pairs(0))
      //   vaultBalanceTask.push(vaultContract.currentBalanceDai())
      //   vaultSupplyTask.push(vaultContract.maxBalanceDai())
      //   groupCollateralLong.push(pairStorageContract.groupCollateral(0, true))
      //   groupCollateralShort.push(pairStorageContract.groupCollateral(0, false))
      //   maxWithdrawPTask.push(vaultContract.maxWithdrawP())
      //   pairParams.push(pairInfoContract.pairParams(0))
      //   accDaiPerDaiTask.push(vaultContract.accDaiPerDai())
      // })
      //
      // const factoryCall = await Promise.all([
      //   ...tokenTask,
      //   ...decimalsTask,
      //   ...pairStorageTask,
      //   ...vaultSupplyTask,
      //   ...vaultBalanceTask,
      //   ...groupCollateralLong,
      //   ...groupCollateralShort,
      //   ...maxWithdrawPTask,
      //   ...pairParams,
      //   ...accDaiPerDaiTask,
      // ])

      forMatter.forEach((item, index) => {
        item.symbol = decodeCallResult(tokenInterface, TaskFunc.SYMBOL, factoryCall[index])
        item.decimals = decodeCallResult(
          tokenInterface,
          TaskFunc.DECIMALS,
          factoryCall[Task.decimalsTask * totalPools + index]
        )
        item.proportionBTC = Number(
          decodeCallResult(pairStorageInterface, TaskFunc.PAIRS, factoryCall[Task.pairStorageTask * totalPools + index])
            .proportionBTC._hex
        )
        item.fundingFeePerBlockP = new BigNumber(
          decodeCallResult(
            pairInfoInterface,
            TaskFunc.PAIR_PARAMS,
            factoryCall[Task.pairParams * totalPools + index]
          ).fundingFeePerBlockP._hex
        )
        item.fundingFeePerBlockP = new BigNumber(0)
        const totalSupply = new BigNumber(
          decodeCallResult(
            vaultInterface,
            TaskFunc.CURRENT_BALANCE_DAI,
            factoryCall[Task.vaultSupplyTask * totalPools + index]
          )._hex
        )
        item.poolTotalSupply = eXDecimals(totalSupply, item.decimals)
        item.poolCurrentBalance = eXDecimals(
          decodeCallResult(
            vaultInterface,
            TaskFunc.MAX_BALANCE_DAI,
            factoryCall[Task.vaultBalanceTask * totalPools + index]
          )._hex,
          item.decimals
        )
        const utilization = new BigNumber(
          decodeCallResult(
            pairStorageInterface,
            TaskFunc.GROUP_COLLATERAL,
            factoryCall[Task.groupCollateralLong * totalPools + index]
          )._hex
        )
          .minus(
            decodeCallResult(
              pairStorageInterface,
              TaskFunc.GROUP_COLLATERAL,
              factoryCall[Task.groupCollateralShort * totalPools + index]
            )._hex
          )
          .absoluteValue()
          .div(totalSupply)
        item.utilization = utilization.times(100)
        item.maxWithdrawP = new BigNumber(
          decodeCallResult(
            vaultInterface,
            TaskFunc.MAX_WITHDRAW_P,
            factoryCall[Task.maxWithdrawPTask * totalPools + index]
          )._hex
        )
        item.accDaiPerDai = new BigNumber(
          decodeCallResult(
            vaultInterface,
            TaskFunc.ACC_DAI_PER_DAI,
            factoryCall[Task.accDaiPerDaiTask * totalPools + index]
          )._hex
        )
        try {
          item.logoSource = require(`../../assets/imgs/tokens/${item.symbol}.svg`)
        } catch (e) {
          item.logoSource = require('../../assets/imgs/tokens/default_token.svg').default
        }
      })
      forMatter = forMatter.filter((pool) => pool.symbol !== 'MAG')
      setAllPoolParams(forMatter)
      setIsLoadingFactory(false)
      return forMatter
    } catch (e) {
      console.error('get factory failed!', e)
      return [] as PoolParams[]
    }
  }, [factory])
}
