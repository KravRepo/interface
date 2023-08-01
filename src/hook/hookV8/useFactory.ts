import { TEST_RPC_NODE } from 'constant/chain'
import { Contract, ethers } from 'ethers'
import { useFactoryContract } from './useContract'
import type { JsonRpcProvider } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useRootStore } from '../../store/root'
import { PoolParams } from '../../store/FactorySlice'
import test_erc20 from '../../abi/test_erc20.json'
import pair_storage from '../../abi/pair_storage_v6.json'
import pair_info from '../../abi/pair_info_v6_1.json'
import trading_vault from '../../abi/trading_vault_v5.json'
import { eXDecimals } from '../../utils/math'
import BigNumber from 'bignumber.js'

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
      const forMatter = [] as PoolParams[]
      const tokenTask: any[] = []
      const decimalsTask: any[] = []
      const pairStorageTask: any[] = []
      const vaultSupplyTask: any[] = []
      const vaultBalanceTask: any[] = []
      const groupCollateralLong: any[] = []
      const groupCollateralShort: any[] = []
      const maxWithdrawPTask: any[] = []
      const pairParams: any[] = []
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
        })
      })

      forMatter.forEach((item) => {
        const pairStorageContract = new Contract(item.pairStorageT, pair_storage.abi, provider)
        const pairInfoContract = new Contract(item.pairInfoT, pair_info.abi, provider)
        const tokenContract = new Contract(item.tokenT, test_erc20.abi, provider)
        const vaultContract = new Contract(item.vaultT, trading_vault.abi, provider)
        tokenTask.push(tokenContract.symbol())
        decimalsTask.push(tokenContract.decimals())
        pairStorageTask.push(pairStorageContract.pairs(0))
        vaultBalanceTask.push(vaultContract.currentBalanceDai())
        vaultSupplyTask.push(vaultContract.maxBalanceDai())
        groupCollateralLong.push(pairStorageContract.groupCollateral(0, true))
        groupCollateralShort.push(pairStorageContract.groupCollateral(0, false))
        maxWithdrawPTask.push(vaultContract.maxWithdrawP())
        pairParams.push(pairInfoContract.pairParams(0))
      })

      const factoryCall = await Promise.all([
        ...tokenTask,
        ...decimalsTask,
        ...pairStorageTask,
        ...vaultSupplyTask,
        ...vaultBalanceTask,
        ...groupCollateralLong,
        ...groupCollateralShort,
        ...maxWithdrawPTask,
        ...pairParams,
      ])

      forMatter.forEach((item, index) => {
        item.symbol = factoryCall[index]
        item.decimals = factoryCall[Task.decimalsTask * totalPools + index]
        item.proportionBTC = Number(factoryCall[Task.pairStorageTask * totalPools + index].proportionBTC._hex)
        item.fundingFeePerBlockP = new BigNumber(
          factoryCall[Task.pairParams * totalPools + index].fundingFeePerBlockP._hex
        )
        const totalSupply = new BigNumber(factoryCall[Task.vaultSupplyTask * totalPools + index]._hex)
        item.poolTotalSupply = eXDecimals(totalSupply, factoryCall[Task.decimalsTask * totalPools + index])
        item.poolCurrentBalance = eXDecimals(
          factoryCall[Task.vaultBalanceTask * totalPools + index]._hex,
          factoryCall[Task.decimalsTask * totalPools + index]
        )
        const utilization = new BigNumber(factoryCall[Task.groupCollateralLong * totalPools + index]._hex)
          .minus(factoryCall[Task.groupCollateralShort * totalPools + index]._hex)
          .absoluteValue()
          .div(totalSupply)
        item.utilization = utilization.times(100)
        item.maxWithdrawP = new BigNumber(factoryCall[Task.maxWithdrawPTask * totalPools + index]._hex)
        try {
          item.logoSource = require(`../../assets/imgs/tokens/${factoryCall[index]}.svg`)
        } catch (e) {
          item.logoSource = require('../../assets/imgs/tokens/default_token.svg')
        }
      })
      setAllPoolParams(forMatter)
      console.log('forMatter', forMatter)
      setIsLoadingFactory(false)
      return forMatter
    } catch (e) {
      console.error('get factory failed!', e)
      return [] as PoolParams[]
    }
  }, [factory])
}
