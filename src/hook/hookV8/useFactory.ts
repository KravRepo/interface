import { TEST_RPC_NODE } from 'constant/chain'
import { ethers } from 'ethers'
import { useFactoryContract } from './useContract'
import type { JsonRpcProvider } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useRootStore } from '../../store/root'
import { PoolParams } from '../../store/FactorySlice'
import test_erc20 from '../../abi/test_erc20.json'
import pair_storage from '../../abi/pair_storage_v6.json'
import trading_vault from '../../abi/trading_vault_v5.json'
import { eXDecimals } from '../../utils/math'
import { Contract, Provider } from 'ethers-multicall'
import BigNumber from 'bignumber.js'

export const useFactory = () => {
  const setAllPoolParams = useRootStore((store) => store.setAllPoolParams)
  const setIsLoadingFactory = useRootStore((store) => store.setIsLoadingFactory)
  const provider = new ethers.providers.JsonRpcProvider(TEST_RPC_NODE) as JsonRpcProvider

  const factory = useFactoryContract(provider)!

  return useCallback(async () => {
    try {
      const totalPools = await factory.quantosCount()
      const poolsParams = []
      const ethcallProvider = new Provider(provider)
      await ethcallProvider.init()
      for (let i = 0; i < totalPools; i++) {
        poolsParams.push(factory.quantos(i))
      }
      const res = await Promise.all(poolsParams)
      const forMatter = [] as PoolParams[]
      const tokenTask = [] as any
      const decimalsTask = [] as any
      const pairStorageTask = [] as any
      const vaultSupplyTask = [] as any
      const vaultBalanceTask = [] as any
      const groupCollateralLong = [] as any
      const groupCollateralShort = [] as any
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
          utilization: new BigNumber(0),
        })
      })

      forMatter.forEach((item) => {
        const pairStorageContract = new Contract(item.pairStorageT, pair_storage.abi)
        const tokenContract = new Contract(item.tokenT, test_erc20.abi)
        const vaultContract = new Contract(item.vaultT, trading_vault.abi)
        tokenTask.push(tokenContract.symbol())
        decimalsTask.push(tokenContract.decimals())
        pairStorageTask.push(pairStorageContract.pairs(0))
        vaultBalanceTask.push(vaultContract.currentBalanceDai())
        vaultSupplyTask.push(vaultContract.maxBalanceDai())
        groupCollateralLong.push(pairStorageContract.groupCollateral(0, true))
        groupCollateralShort.push(pairStorageContract.groupCollateral(0, false))
      })
      const testETHCall = await ethcallProvider.all([
        ...tokenTask,
        ...decimalsTask,
        ...pairStorageTask,
        ...vaultSupplyTask,
        ...vaultBalanceTask,
        ...groupCollateralLong,
        ...groupCollateralShort,
      ])
      forMatter.forEach((item, index) => {
        item.symbol = testETHCall[index]
        item.decimals = testETHCall[1 * totalPools + index]
        item.proportionBTC = Number(testETHCall[2 * totalPools + index].proportionBTC._hex)
        const totalSupply = new BigNumber(testETHCall[3 * totalPools + index]._hex)
        item.poolTotalSupply = eXDecimals(totalSupply, testETHCall[1 * totalPools + index])
        item.poolCurrentBalance = eXDecimals(
          testETHCall[4 * totalPools + index]._hex,
          testETHCall[1 * totalPools + index]
        )
        const utilization = new BigNumber(testETHCall[5 * totalPools + index]._hex)
          .minus(testETHCall[6 * totalPools + index]._hex)
          .absoluteValue()
          .div(totalSupply)
        item.utilization = utilization.times(100)
      })
      setAllPoolParams(forMatter)
      setIsLoadingFactory(false)
      return forMatter
    } catch (e) {
      console.error('get factory failed!', e)
      return [] as PoolParams[]
    }
  }, [factory])
}
