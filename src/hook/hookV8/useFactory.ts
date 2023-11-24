import { API_CONFIG, ChainId, CONTRACT_CONFIG, DEFAULT_CHAIN, SUPPORT_CHAIN } from '../../constant/chain'
import { Contract, ethers } from 'ethers'
import { creatCall, decodeCallResult } from './useContract'
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
import krav_factory from '../../abi/krav_factory.json'

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
  minPosition = 10,
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
  POSITION_MIN_LEV = 'pairMinLevPosDai',
}

export const useFactory = () => {
  const setAllPoolParams = useRootStore((store) => store.setAllPoolParams)
  const setIsLoadingFactory = useRootStore((store) => store.setIsLoadingFactory)
  const expectChainId = useRootStore((store) => store.expectChainId)
  const setTradePool = useRootStore((store) => store.setTradePool)
  const isLoadingFactory = useRootStore((store) => store.isLoadingFactory)
  const setFactoryLock = useRootStore((store) => store.setFactoryLock)

  return useCallback(
    async (localChainId?: number) => {
      try {
        let provider: JsonRpcProvider
        let factory: Contract
        let multicall: Contract

        if (localChainId && SUPPORT_CHAIN.includes(localChainId)) {
          provider = new ethers.providers.JsonRpcProvider(API_CONFIG[localChainId].rpcNode) as JsonRpcProvider
          factory = new Contract(CONTRACT_CONFIG[localChainId].factory, krav_factory.abi, provider)
          multicall = new Contract(CONTRACT_CONFIG[localChainId].multicall, multicall2.abi, provider)
        } else {
          provider = new ethers.providers.JsonRpcProvider(
            expectChainId && SUPPORT_CHAIN.includes(expectChainId)
              ? API_CONFIG[expectChainId].rpcNode
              : API_CONFIG[DEFAULT_CHAIN].rpcNode
          ) as JsonRpcProvider
          factory = new Contract(
            CONTRACT_CONFIG[
              expectChainId && SUPPORT_CHAIN.includes(expectChainId) ? expectChainId : DEFAULT_CHAIN
            ].factory,
            krav_factory.abi,
            provider
          )
          multicall = new Contract(
            expectChainId && SUPPORT_CHAIN.includes(expectChainId)
              ? CONTRACT_CONFIG[expectChainId].multicall
              : CONTRACT_CONFIG[DEFAULT_CHAIN].multicall,
            multicall2.abi,
            provider
          )
        }

        const totalPools = await factory.quantosCount()
        const blockNumber = await provider.getBlockNumber()
        const poolsParams = []
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
        const minPositionTask: any[] = []
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
            minPositionLev: new BigNumber(0),
            logoSource: null,
            fundingFeePerBlockP: new BigNumber(0),
            accDaiPerDai: new BigNumber(0),
          })
        })

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
          minPositionTask.push(creatCall(item.pairStorageT, pairStorageInterface, TaskFunc.POSITION_MIN_LEV, [0]))
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
          ...minPositionTask,
        ])
        const factoryCall = factoryReturn.returnData

        forMatter.forEach((item, index) => {
          item.symbol = decodeCallResult(tokenInterface, TaskFunc.SYMBOL, factoryCall[index])
          item.decimals = decodeCallResult(
            tokenInterface,
            TaskFunc.DECIMALS,
            factoryCall[Task.decimalsTask * totalPools + index]
          )
          item.proportionBTC = Number(
            decodeCallResult(
              pairStorageInterface,
              TaskFunc.PAIRS,
              factoryCall[Task.pairStorageTask * totalPools + index]
            ).proportionBTC._hex
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
          item.minPositionLev = eXDecimals(
            new BigNumber(
              decodeCallResult(
                pairStorageInterface,
                TaskFunc.POSITION_MIN_LEV,
                factoryCall[Task.minPosition * totalPools + index]
              )._hex
            ),
            item.decimals
          )
          try {
            item.logoSource = require(`../../assets/imgs/tokens/${item.symbol}.svg`)
          } catch (e) {
            item.logoSource = require('../../assets/imgs/tokens/default_token.svg').default
          }
        })
        forMatter = forMatter.filter((pool) => pool.symbol !== 'MAG')
        setAllPoolParams(forMatter)
        if (isLoadingFactory) {
          if (forMatter.length === 0) {
            const nullTradePool = {
              tokenT: '',
              storageT: '',
              pairInfoT: '',
              pairStorageT: '',
              apr: new BigNumber(0),
              tradingT: '',
              callbackT: '',
              rewardT: '',
              vaultT: '',
              priceAggregatorT: '',
              symbol: '',
              proportionBTC: 1,
              decimals: 18,
              blockNumber: 0,
              logoSource: require('../../assets/imgs/tokens/default_token.svg').default,
              utilization: new BigNumber(0),
              maxWithdrawP: new BigNumber(0),
              accDaiPerDai: new BigNumber(0),
              minPositionLev: new BigNumber(0),
              fundingFeePerBlockP: new BigNumber(0),
              poolTotalSupply: new BigNumber(0),
              poolCurrentBalance: new BigNumber(0),
            }
            setTradePool(nullTradePool)
          } else {
            const target = forMatter.find((pool) => pool.tradingT === CONTRACT_CONFIG[ChainId.BASE].kravTrading)
            if (target) setTradePool(target)
            else setTradePool(forMatter[0])
          }
        }
        setIsLoadingFactory(false)
        setFactoryLock(false)
        return forMatter
      } catch (e) {
        console.error('get factory failed!', e)
        return [] as PoolParams[]
      }
    },
    [expectChainId, isLoadingFactory]
  )
}
