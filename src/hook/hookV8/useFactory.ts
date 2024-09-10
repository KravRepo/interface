import { CONTRACT_CONFIG, DEFAULT_CHAIN } from '../../constant/chain'
import { useContract } from './useContract'
import { useCallback, useEffect, useMemo } from 'react'
import { useRootStore } from '../../store/root'
import { PoolParams } from '../../store/FactorySlice'
import test_erc20 from '../../abi/test_erc20.json'
import { PairsStorageABI } from '../../abi/deployed/PairsStorageABI'
import { PairInfosABI } from '../../abi/deployed/PairInfosABI'
import { eXDecimals } from '../../utils/math'
import BigNumber from 'bignumber.js'
import { Interface } from 'ethers/lib/utils'
import { KravFactoryABI } from '../../abi/deployed/KravFactoryABI'
import { KTokenABI } from '../../abi/deployed/KTokenABI'
import { useMultipleContractSingleData, useSingleCallResult, useSingleContractMultipleData } from '../multicall'
import useBlockNumber from '../useBlockNumber'
import { nullTradePool } from '../../constant/nullTradePool'

const pairStorageInterface = new Interface(PairsStorageABI)
const pairInfoInterface = new Interface(PairInfosABI)
const tokenInterface = new Interface(test_erc20.abi)
const vaultInterface = new Interface(KTokenABI)

// enum Task {
//   tokenTask = 0,
//   decimalsTask = 1,
//   pairStorageTask = 2,
//   vaultSupplyTask = 3,
//   vaultBalanceTask = 4,
//   groupCollateralLong = 5,
//   groupCollateralShort = 6,
//   maxWithdrawPTask = 7,
//   pairParams = 8,
//   accDaiPerDaiTask = 9,
//   minPosition = 10,
// }

enum TaskFunc {
  SYMBOL = 'symbol',
  DECIMALS = 'decimals',
  PAIRS = 'pairs',
  CURRENT_BALANCE_DAI = 'currentBalanceDai',
  MAX_BALANCE_DAI = 'totalSupply',
  GROUP_COLLATERAL = 'groupCollateral',
  MAX_WITHDRAW_P = 'maxWithdrawP',
  PAIR_PARAMS = 'pairParams',
  ACC_DAI_PER_DAI = 'accPnlPerToken',
  POSITION_MIN_LEV = 'pairMinLevPosDai',
}

export const useFactory = () => {
  const setAllPoolParams = useRootStore((store) => store.setAllPoolParams)
  const setIsLoadingFactory = useRootStore((store) => store.setIsLoadingFactory)
  // const expectChainId = useRootStore((store) => store.expectChainId)
  const setTradePool = useRootStore((store) => store.setTradePool)
  // const isLoadingFactory = useRootStore((store) => store.isLoadingFactory)
  const setFactoryLock = useRootStore((store) => store.setFactoryLock)

  const chainId = useMemo(() => {
    const localChainId = localStorage.getItem('krav-chain-id')
    return localChainId ? Number(localChainId) : DEFAULT_CHAIN
  }, [])

  const factoryContract = useContract(CONTRACT_CONFIG[chainId].factory, KravFactoryABI)

  const totalPools = useSingleCallResult(factoryContract, 'quantosCount')
  const blockNumber = useBlockNumber()

  const quontoArgs = useMemo(() => {
    if (!totalPools.result) return []

    const args = []
    for (let i = 0; i < totalPools.result[0]; i++) {
      args.push([i])
    }

    return args
  }, [totalPools.result])

  const quantos = useSingleContractMultipleData(factoryContract, 'quantos', quontoArgs)

  const args = useMemo(() => {
    const tokenTask = { addresses: [] as any[], args: undefined, func: TaskFunc.SYMBOL }
    const decimalsTask = { addresses: [] as any[], args: undefined, func: TaskFunc.DECIMALS }
    const pairStorageTask = {
      func: TaskFunc.PAIRS,
      addresses: [] as any[],
      args: [0],
    }
    const vaultSupplyTask = { addresses: [] as any[], args: undefined, func: TaskFunc.MAX_BALANCE_DAI }

    const vaultBalanceTask = { addresses: [] as any[], args: undefined, func: TaskFunc.CURRENT_BALANCE_DAI }

    const groupCollateralLong = { addresses: [] as any[], args: [0, 'true'], func: TaskFunc.GROUP_COLLATERAL }

    const groupCollateralShort = {
      func: TaskFunc.GROUP_COLLATERAL,
      addresses: [] as any[],
      args: [0, 'false'],
    }

    const maxWithdrawPTask = {
      func: TaskFunc.MAX_WITHDRAW_P,
      addresses: [] as any[],
      args: undefined,
    }
    const pairParams = {
      func: TaskFunc.PAIR_PARAMS,
      addresses: [] as any[],
      args: [0],
    }
    const accDaiPerDaiTask = {
      func: TaskFunc.ACC_DAI_PER_DAI,
      addresses: [] as any[],
      args: undefined,
    }
    const minPositionTask = {
      func: TaskFunc.POSITION_MIN_LEV,
      addresses: [] as any[],
      args: [0],
    }
    if (!quantos[0]?.result || !blockNumber) {
      return {
        tokenTask,
        decimalsTask,
        pairStorageTask,
        vaultSupplyTask,
        vaultBalanceTask,
        groupCollateralLong,
        groupCollateralShort,
        maxWithdrawPTask,
        pairParams,
        accDaiPerDaiTask,
        minPositionTask,
      }
    }

    quantos.forEach((i) => {
      const item = i.result
      if (!item) return
      //TODO check pairs tokenT is ERC20
      tokenTask.addresses.push(item.tokenT)
      decimalsTask.addresses.push(item.tokenT)

      pairStorageTask.addresses.push(item.pairStorageT)

      vaultSupplyTask.addresses.push(item.kTokenT)

      vaultBalanceTask.addresses.push(item.kTokenT)

      groupCollateralLong.addresses.push(item.pairStorageT)

      groupCollateralShort.addresses.push(item.pairStorageT)

      maxWithdrawPTask.addresses.push(item.kTokenT)

      pairParams.addresses.push(item.pairInfoT)

      accDaiPerDaiTask.addresses.push(item.kTokenT)

      minPositionTask.addresses.push(item.pairStorageT)
    })

    return {
      tokenTask,
      decimalsTask,
      pairStorageTask,
      vaultSupplyTask,
      vaultBalanceTask,
      groupCollateralLong,
      groupCollateralShort,
      maxWithdrawPTask,
      pairParams,
      accDaiPerDaiTask,
      minPositionTask,
    }
  }, [blockNumber, quantos])

  const tokenTasks = useMultipleContractSingleData(
    args.tokenTask.addresses,
    tokenInterface,
    args.tokenTask.func,
    args.tokenTask.args
  )
  const decimalsTasks = useMultipleContractSingleData(
    args.decimalsTask.addresses,
    tokenInterface,
    args.decimalsTask.func,
    args.decimalsTask.args
  )

  const pairStorageTasks = useMultipleContractSingleData(
    args.pairStorageTask.addresses,
    pairStorageInterface,
    args.pairStorageTask.func,
    args.pairStorageTask.args
  )

  const vaultSupplyTasks = useMultipleContractSingleData(
    args.vaultSupplyTask.addresses,
    vaultInterface,
    args.vaultSupplyTask.func,
    args.vaultSupplyTask.args
  )

  const vaultBalanceTasks = useMultipleContractSingleData(
    args.vaultBalanceTask.addresses,
    vaultInterface,
    args.vaultBalanceTask.func,
    args.vaultBalanceTask.args
  )

  const groupCollateralLongs = useMultipleContractSingleData(
    args.groupCollateralLong.addresses,
    pairStorageInterface,
    args.groupCollateralLong.func,
    args.groupCollateralLong.args
  )

  const groupCollateralShorts = useMultipleContractSingleData(
    args.groupCollateralShort.addresses,
    pairStorageInterface,
    args.groupCollateralShort.func,
    args.groupCollateralShort.args
  )

  const maxWithdrawPTasks = useMultipleContractSingleData(
    args.maxWithdrawPTask.addresses,
    vaultInterface,
    args.maxWithdrawPTask.func,
    args.maxWithdrawPTask.args
  )

  const pairParams = useMultipleContractSingleData(
    args.pairParams.addresses,
    pairInfoInterface,
    args.pairParams.func,
    args.pairParams.args
  )

  const accDaiPerDaiTasks = useMultipleContractSingleData(
    args.accDaiPerDaiTask.addresses,
    vaultInterface,
    args.accDaiPerDaiTask.func,
    args.accDaiPerDaiTask.args
  )

  const minPositionTasks = useMultipleContractSingleData(
    args.minPositionTask.addresses,
    pairStorageInterface,
    args.minPositionTask.func,
    args.minPositionTask.args
  )

  const shareToAssetsPrices = useMultipleContractSingleData(
    args.vaultBalanceTask.addresses,
    vaultInterface,
    'shareToAssetsPrice'
  )

  // console.log({
  //   args,
  //   tokenTasks,
  //   decimalsTasks,
  //   pairStorageTasks,
  //   vaultSupplyTasks,
  //   vaultBalanceTasks,
  //   groupCollateralLongs,
  //   groupCollateralShorts,
  //   maxWithdrawPTasks,
  //   pairParams,
  //   accDaiPerDaiTasks,
  //   minPositionTasks,
  // })
  useEffect(() => {
    if (!totalPools.result || !factoryContract) return

    try {
      let forMatter = [] as PoolParams[]
      quantos.forEach((i, idx) => {
        const item = i.result

        if (!item) return
        const decimals = decimalsTasks?.[idx]?.result?.[0] ?? 18
        const totalSupply = new BigNumber(vaultSupplyTasks?.[idx]?.result?.[0]._hex)
        const utilization = new BigNumber(groupCollateralLongs?.[idx]?.result?.[0]._hex)
          .plus(groupCollateralShorts?.[idx]?.result?.[0]._hex)
          .absoluteValue()
          .div(totalSupply)

        const shareToAssetsPrice = eXDecimals(
          shareToAssetsPrices[idx]?.result?.[0]?._hex ?? '0',
          18
          //kToken decimals is 18
        )

        //TODO check pairs tokenT is ERC20
        const formatted = {
          quantoIndex: idx,
          tokenT: item.tokenT,
          storageT: item.storageT,
          pairInfoT: item.pairInfoT,
          pairStorageT: item.pairStorageT,
          tradingT: item.tradingT,
          callbackT: item.callbackT,
          rewardT: item.rewardT,
          vaultT: item.kTokenT,
          priceAggregatorT: item.priceAggregatorT,
          symbol: tokenTasks?.[idx]?.result?.[0] ?? '',
          proportionBTC: Number(pairStorageTasks?.[idx]?.result?.[0]._hex ?? '0'),
          decimals: decimals,
          blockNumber: blockNumber ?? 0,
          utilization: utilization.times(100),
          maxWithdrawP: new BigNumber(maxWithdrawPTasks?.[idx]?.result?.[0]._hex) ?? new BigNumber(0),
          minPositionLev: eXDecimals(
            new BigNumber(minPositionTasks?.[idx]?.result?.[0]._hex) ?? new BigNumber(0),
            decimals
          ),
          logoSource: null,
          fundingFeePerBlockP: new BigNumber(pairParams?.[idx]?.result?.fundingFeePerBlockP._hex) ?? new BigNumber(0),
          accDaiPerDai: new BigNumber(accDaiPerDaiTasks?.[idx]?.result?.[0]._hex) ?? new BigNumber(0),
          poolTotalSupply: eXDecimals(
            new BigNumber(vaultSupplyTasks?.[idx]?.result?.[0]._hex) ?? new BigNumber(0),
            decimals
            //kToken precision 18
          ).times(shareToAssetsPrice),
          poolCurrentBalance: eXDecimals(
            new BigNumber(vaultBalanceTasks?.[idx]?.result?.[0]._hex) ?? new BigNumber(0),
            decimals
          ),
        }
        try {
          formatted.logoSource = require(`../../assets/imgs/tokens/${tokenTasks?.[idx]?.result?.[0]}.svg`)
        } catch (e) {
          formatted.logoSource = require('../../assets/imgs/tokens/default_token.svg').default
        }
        forMatter.push(formatted)
      })

      forMatter = forMatter.filter((pool) => pool.symbol !== 'MAG')
      setAllPoolParams(forMatter)

      if (forMatter.length === 0) {
        setTradePool(nullTradePool)
      } else {
        // const target = forMatter.find((pool) => pool.tradingT === CONTRACT_CONFIG[ChainId.BASE].kravTrading)
        // if (target) setTradePool(target)
        // else setTradePool(forMatter[0])
      }
    } catch (e) {
      console.log('get Factory Error', e)
    }
  }, [
    accDaiPerDaiTasks,
    blockNumber,
    decimalsTasks,
    factoryContract,
    groupCollateralLongs,
    groupCollateralShorts,
    maxWithdrawPTasks,
    minPositionTasks,
    pairParams,
    pairStorageTasks,
    quantos,
    setAllPoolParams,
    setTradePool,
    shareToAssetsPrices,
    tokenTasks,
    totalPools.result,
    vaultBalanceTasks,
    vaultSupplyTasks,
  ])

  useEffect(() => {
    if (quantos?.[0]?.loading === false) {
      setFactoryLock(false)
      setIsLoadingFactory(false)
    }
  }, [quantos, setFactoryLock, setIsLoadingFactory])

  return useCallback(async (localChainId?: number) => {
    // try {
    //   let provider: JsonRpcProvider
    //   let factory: Contract
    //   let multicall: Contract
    //   if (localChainId && SUPPORT_CHAIN.includes(localChainId)) {
    //     provider = new ethers.providers.JsonRpcProvider(API_CONFIG[localChainId].rpcNode) as JsonRpcProvider
    //     factory = new Contract(CONTRACT_CONFIG[localChainId].factory, KravFactoryABI, provider)
    //     multicall = new Contract(CONTRACT_CONFIG[localChainId].multicall, multicall2.abi, provider)
    //   } else {
    //     provider = new ethers.providers.JsonRpcProvider(
    //       expectChainId && SUPPORT_CHAIN.includes(expectChainId)
    //         ? API_CONFIG[expectChainId].rpcNode
    //         : API_CONFIG[DEFAULT_CHAIN].rpcNode
    //     ) as JsonRpcProvider
    //     factory = new Contract(
    //       CONTRACT_CONFIG[
    //         expectChainId && SUPPORT_CHAIN.includes(expectChainId) ? expectChainId : DEFAULT_CHAIN
    //       ].factory,
    //       KravFactoryABI,
    //       provider
    //     )
    //     multicall = new Contract(
    //       expectChainId && SUPPORT_CHAIN.includes(expectChainId)
    //         ? CONTRACT_CONFIG[expectChainId].multicall
    //         : CONTRACT_CONFIG[DEFAULT_CHAIN].multicall,
    //       multicall2.abi,
    //       provider
    //     )
    //   }
    //   const totalPools = await factory.quantosCount()
    //   const blockNumber = await provider.getBlockNumber()
    //   const poolsParams = []
    //   for (let i = 0; i < totalPools; i++) {
    //     poolsParams.push(factory.quantos(i))
    //   }
    //   const res = await Promise.all(poolsParams)
    //   let forMatter = [] as PoolParams[]
    //   const tokenTask: any[] = []
    //   const decimalsTask: any[] = []
    //   const pairStorageTask: any[] = []
    //   const vaultSupplyTask: any[] = []
    //   const vaultBalanceTask: any[] = []
    //   const groupCollateralLong: any[] = []
    //   const groupCollateralShort: any[] = []
    //   const maxWithdrawPTask: any[] = []
    //   const pairParams: any[] = []
    //   const accDaiPerDaiTask: any[] = []
    //   const minPositionTask: any[] = []
    //   res.forEach((item) => {
    //     //TODO check pairs tokenT is ERC20
    //     forMatter.push({
    //       tokenT: item.tokenT,
    //       storageT: item.storageT,
    //       pairInfoT: item.pairInfoT,
    //       pairStorageT: item.pairStorageT,
    //       tradingT: item.tradingT,
    //       callbackT: item.callbackT,
    //       rewardT: item.rewardT,
    //       vaultT: item.kTokenT,
    //       priceAggregatorT: item.priceAggregatorT,
    //       symbol: '',
    //       proportionBTC: 0,
    //       decimals: 0,
    //       blockNumber: blockNumber,
    //       utilization: new BigNumber(0),
    //       maxWithdrawP: new BigNumber(0),
    //       minPositionLev: new BigNumber(0),
    //       logoSource: null,
    //       fundingFeePerBlockP: new BigNumber(0),
    //       accDaiPerDai: new BigNumber(0),
    //     })
    //   })
    //   const pairStorageInterface = new Interface(PairsStorageABI)
    //   const pairInfoInterface = new Interface(PairInfosABI)
    //   const tokenInterface = new Interface(test_erc20.abi)
    //   const vaultInterface = new Interface(KTokenABI)
    //   forMatter.forEach((item) => {
    //     tokenTask.push(creatCall(item.tokenT, tokenInterface, TaskFunc.SYMBOL, []))
    //     decimalsTask.push(creatCall(item.tokenT, tokenInterface, TaskFunc.DECIMALS, []))
    //     pairStorageTask.push(creatCall(item.pairStorageT, pairStorageInterface, TaskFunc.PAIRS, [0]))
    //     vaultSupplyTask.push(creatCall(item.vaultT, vaultInterface, TaskFunc.MAX_BALANCE_DAI, []))
    //     vaultBalanceTask.push(creatCall(item.vaultT, vaultInterface, TaskFunc.CURRENT_BALANCE_DAI, []))
    //     groupCollateralLong.push(
    //       creatCall(item.pairStorageT, pairStorageInterface, TaskFunc.GROUP_COLLATERAL, [0, true])
    //     )
    //     groupCollateralShort.push(
    //       creatCall(item.pairStorageT, pairStorageInterface, TaskFunc.GROUP_COLLATERAL, [0, false])
    //     )
    //     maxWithdrawPTask.push(creatCall(item.vaultT, vaultInterface, TaskFunc.MAX_WITHDRAW_P, []))
    //     pairParams.push(creatCall(item.pairInfoT, pairInfoInterface, TaskFunc.PAIR_PARAMS, [0]))
    //     accDaiPerDaiTask.push(creatCall(item.vaultT, vaultInterface, TaskFunc.ACC_DAI_PER_DAI, []))
    //     minPositionTask.push(creatCall(item.pairStorageT, pairStorageInterface, TaskFunc.POSITION_MIN_LEV, [0]))
    //   })
    //   const factoryReturn = await multicall.callStatic.aggregate([
    //     ...tokenTask,
    //     ...decimalsTask,
    //     ...pairStorageTask,
    //     ...vaultSupplyTask,
    //     ...vaultBalanceTask,
    //     ...groupCollateralLong,
    //     ...groupCollateralShort,
    //     ...maxWithdrawPTask,
    //     ...pairParams,
    //     ...accDaiPerDaiTask,
    //     ...minPositionTask,
    //   ])
    //   const factoryCall = factoryReturn.returnData
    //   forMatter.forEach((item, index) => {
    //     item.symbol = decodeCallResult(tokenInterface, TaskFunc.SYMBOL, factoryCall[index])
    //     item.decimals = decodeCallResult(
    //       tokenInterface,
    //       TaskFunc.DECIMALS,
    //       factoryCall[Task.decimalsTask * totalPools + index]
    //     )
    //     // item.proportionBTC = Number(
    //     //   decodeCallResult(
    //     //     pairStorageInterface,
    //     //     TaskFunc.PAIRS,
    //     //     factoryCall[Task.pairStorageTask * totalPools + index]
    //     //   )._hex
    //     // )
    //     item.fundingFeePerBlockP = new BigNumber(
    //       decodeCallResult(
    //         pairInfoInterface,
    //         TaskFunc.PAIR_PARAMS,
    //         factoryCall[Task.pairParams * totalPools + index]
    //       ).fundingFeePerBlockP._hex
    //     )
    //     item.fundingFeePerBlockP = new BigNumber(0)
    //     const totalSupply = new BigNumber(
    //       decodeCallResult(
    //         vaultInterface,
    //         TaskFunc.CURRENT_BALANCE_DAI,
    //         factoryCall[Task.vaultSupplyTask * totalPools + index]
    //       )._hex
    //     )
    //     item.poolTotalSupply = eXDecimals(totalSupply, item.decimals)
    //     item.poolCurrentBalance = eXDecimals(
    //       decodeCallResult(
    //         vaultInterface,
    //         TaskFunc.MAX_BALANCE_DAI,
    //         factoryCall[Task.vaultBalanceTask * totalPools + index]
    //       )._hex,
    //       item.decimals
    //     )
    //     const utilization = new BigNumber(
    //       decodeCallResult(
    //         pairStorageInterface,
    //         TaskFunc.GROUP_COLLATERAL,
    //         factoryCall[Task.groupCollateralLong * totalPools + index]
    //       )._hex
    //     )
    //       .plus(
    //         decodeCallResult(
    //           pairStorageInterface,
    //           TaskFunc.GROUP_COLLATERAL,
    //           factoryCall[Task.groupCollateralShort * totalPools + index]
    //         )._hex
    //       )
    //       .absoluteValue()
    //       .div(totalSupply)
    //     item.utilization = utilization.times(100)
    //     item.maxWithdrawP = new BigNumber(
    //       decodeCallResult(
    //         vaultInterface,
    //         TaskFunc.MAX_WITHDRAW_P,
    //         factoryCall[Task.maxWithdrawPTask * totalPools + index]
    //       )._hex
    //     )
    //     item.accDaiPerDai = new BigNumber(
    //       decodeCallResult(
    //         vaultInterface,
    //         TaskFunc.ACC_DAI_PER_DAI,
    //         factoryCall[Task.accDaiPerDaiTask * totalPools + index]
    //       )._hex
    //     )
    //     item.minPositionLev = eXDecimals(
    //       new BigNumber(
    //         decodeCallResult(
    //           pairStorageInterface,
    //           TaskFunc.POSITION_MIN_LEV,
    //           factoryCall[Task.minPosition * totalPools + index]
    //         )._hex
    //       ),
    //       item.decimals
    //     )
    //     try {
    //       item.logoSource = require(`../../assets/imgs/tokens/${item.symbol}.svg`)
    //     } catch (e) {
    //       item.logoSource = require('../../assets/imgs/tokens/default_token.svg').default
    //     }
    //   })
    //   forMatter = forMatter.filter((pool) => pool.symbol !== 'MAG')
    //   setAllPoolParams(forMatter)
    //   if (isLoadingFactory) {
    //     if (forMatter.length === 0) {
    //       const nullTradePool = {
    //         tokenT: '',
    //         storageT: '',
    //         pairInfoT: '',
    //         pairStorageT: '',
    //         apr: new BigNumber(0),
    //         tradingT: '',
    //         callbackT: '',
    //         rewardT: '',
    //         vaultT: '',
    //         priceAggregatorT: '',
    //         symbol: '',
    //         proportionBTC: 1,
    //         decimals: 18,
    //         blockNumber: 0,
    //         logoSource: require('../../assets/imgs/tokens/default_token.svg').default,
    //         utilization: new BigNumber(0),
    //         maxWithdrawP: new BigNumber(0),
    //         accDaiPerDai: new BigNumber(0),
    //         minPositionLev: new BigNumber(0),
    //         fundingFeePerBlockP: new BigNumber(0),
    //         poolTotalSupply: new BigNumber(0),
    //         poolCurrentBalance: new BigNumber(0),
    //       }
    //       setTradePool(nullTradePool)
    //     } else {
    //       const target = forMatter.find((pool) => pool.tradingT === CONTRACT_CONFIG[ChainId.BASE].kravTrading)
    //       if (target) setTradePool(target)
    //       else setTradePool(forMatter[0])
    //     }
    //   }
    //   setIsLoadingFactory(false)
    //   setFactoryLock(false)
    //   return forMatter
    // } catch (e) {
    //   console.error('get factory failed!', e)
    //   return [] as PoolParams[]
    // }
  }, [])
}
