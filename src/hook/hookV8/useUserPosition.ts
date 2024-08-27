// import { useWeb3React } from '@web3-react/core'
import { useRootStore } from '../../store/root'
import { useEffect, useMemo, useState } from 'react'
// import { Contract } from 'ethers'
import KTokenABI from '../../abi/k_token.json'
import { PoolParams } from '../../store/FactorySlice'
import BigNumber from 'bignumber.js'
import test_erc20 from '../../abi/test_erc20.json'
import { eXDecimals } from '../../utils/math'
// import multicall2 from '../../abi/multicall2.json'
// import { creatCall, decodeCallResult } from './useContract'
import { Interface } from 'ethers/lib/utils'
// import { CONTRACT_CONFIG, DEFAULT_CHAIN, SUPPORT_CHAIN } from '../../constant/chain'
import { useMultipleContractSingleData } from '../multicall'

const tokenInterface = new Interface(test_erc20.abi)
const vaultInterface = new Interface(KTokenABI.abi)

export type UserData = {
  pool: PoolParams
  daiDeposited: BigNumber
  maxDaiDeposited: BigNumber
  withdrawBlock: BigNumber
  // debtDai: BigNumber
  // debtMatic: BigNumber
  walletBalance: BigNumber
  hasPosition: boolean
  shareToAssetsPrice: BigNumber
}
const account = '0x7A4018187538D9745Ce4f6F9F62f487f2b3577c6'
export const useUserPosition = () => {
  // const { account } = useWeb3React()
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const setUserPositionDatas = useRootStore((store) => store.setUserPositionDatas)

  const [isLoading, setIsLoading] = useState(false)

  const data = useMemo(() => {
    const addresses = {
      vaultT: [] as string[],
      tokenT: [] as string[],
    }
    const args = {
      balanceOf: [account],
    }
    allPoolParams?.forEach((pool) => {
      addresses.vaultT.push(pool.vaultT)
      addresses.tokenT.push(pool.tokenT)
    })
    return {
      args,
      addresses,
    }
  }, [account, allPoolParams])

  const vaultBalanceOf = useMultipleContractSingleData(
    data.addresses.vaultT,
    vaultInterface,
    'balanceOf',
    data.args.balanceOf
  )

  const tokenBalanceOf = useMultipleContractSingleData(
    data.addresses.tokenT,
    tokenInterface,
    'balanceOf',
    data.args.balanceOf
  )
  const shareToAssetsPrices = useMultipleContractSingleData(data.addresses.vaultT, vaultInterface, 'shareToAssetsPrice')

  const maxDepositedShares = useMultipleContractSingleData(
    data.addresses.vaultT,
    vaultInterface,
    'maxDepositedShares',
    data.args.balanceOf
  )

  useEffect(() => {
    setIsLoading(
      tokenBalanceOf[0]?.loading ||
        vaultBalanceOf[0]?.loading ||
        shareToAssetsPrices[0]?.loading ||
        maxDepositedShares[0]?.loading
    )
    const userPositionDatas: UserData[] = []
    allPoolParams.forEach((pool, index) => {
      const positionDetails = {} as UserData

      // const tokenSupplyDecode = decodeCallResult(vaultInterface, 'maxDepositedShares', tokenSupply[index])
      // const priceDecode = decodeCallResult(vaultInterface, 'shareToAssetsPrice', priceRes.returnData[index])
      // const userAllBalanceDecode = decodeCallResult(tokenInterface, 'balanceOf', userAllBalance[index])
      // const userAllBackendDecode = decodeCallResult(vaultInterface, 'balanceOf', userAllBackend[index])
      positionDetails.walletBalance = eXDecimals(tokenBalanceOf[index]?.result?.[0]?._hex ?? '0', pool.decimals)
      positionDetails.pool = pool
      if (new BigNumber(vaultBalanceOf[index]?.result?.[0]?._hex ?? '0').isGreaterThan(0)) {
        positionDetails.hasPosition = true
        const shareToAssetsPrice = eXDecimals(shareToAssetsPrices[index]?.result?.[0]?._hex ?? '0', pool.decimals)

        positionDetails.shareToAssetsPrice = new BigNumber(shareToAssetsPrices[index]?.result?.[0]?._hex ?? '0')
        positionDetails.daiDeposited = new BigNumber(vaultBalanceOf[index]?.result?.[0]?._hex).times(shareToAssetsPrice)
        ;(positionDetails.maxDaiDeposited = new BigNumber(maxDepositedShares?.[index]?.result?.[0]?._hex ?? '0')).times(
          shareToAssetsPrice
        ),
          (positionDetails.withdrawBlock = new BigNumber(1))

        // positionDetails.withdrawBlock = new BigNumber(userAllBackendDecode.withdrawBlock._hex)
        // positionDetails.debtDai = new BigNumber(userAllBackendDecode.debtDai._hex)
        // positionDetails.debtMatic = new BigNumber(userAllBackendDecode.debtMatic._hex)
      }
      userPositionDatas.push(positionDetails)
    })
    setUserPositionDatas(userPositionDatas)
  }, [allPoolParams, maxDepositedShares, setUserPositionDatas, shareToAssetsPrices, tokenBalanceOf, vaultBalanceOf])

  return { isLoading }

  // return useCallback(async () => {
  //   try {
  //     if (allPoolParams.length > 0 && account && provider && chainId) {
  //       const multicall = new Contract(
  //         chainId && SUPPORT_CHAIN.includes(chainId)
  //           ? CONTRACT_CONFIG[chainId].multicall
  //           : CONTRACT_CONFIG[DEFAULT_CHAIN].multicall,
  //         multicall2.abi,
  //         provider
  //       )

  //       const task: any[] = []
  //       const balanceTask: any[] = []
  //       const supplyTask: any[] = []
  //       const priceTask: any[] = []
  //       const tokenInterface = new Interface(test_erc20.abi)
  //       const vaultInterface = new Interface(KTokenABI.abi)
  //       allPoolParams.forEach((pool) => {
  //         task.push(creatCall(pool.vaultT, vaultInterface, 'balanceOf', [account]))
  //         supplyTask.push(creatCall(pool.vaultT, vaultInterface, 'maxDepositedShares', [account]))
  //         priceTask.push(creatCall(pool.vaultT, vaultInterface, 'shareToAssetsPrice', []))
  //         balanceTask.push(creatCall(pool.tokenT, tokenInterface, 'balanceOf', [account]))
  //       })
  //       const res = await multicall.callStatic.aggregate([...task, ...balanceTask])
  //       const supplyRes = await multicall.callStatic.aggregate(supplyTask)
  //       const priceRes = await multicall.callStatic.aggregate(priceTask)
  //       const userAllBackend = res.returnData.slice(0, allPoolParams.length)
  //       const userAllBalance = res.returnData.slice(allPoolParams.length, res.returnData.length)
  //       const tokenSupply = supplyRes.returnData.slice(0, allPoolParams.length)
  //       const userPositionDatas: UserData[] = []
  //       allPoolParams.forEach((pool, index) => {
  //         const positionDetails = {} as UserData
  //         const tokenSupplyDecode = decodeCallResult(vaultInterface, 'maxDepositedShares', tokenSupply[index])
  //         const priceDecode = decodeCallResult(vaultInterface, 'shareToAssetsPrice', priceRes.returnData[index])
  //         const userAllBalanceDecode = decodeCallResult(tokenInterface, 'balanceOf', userAllBalance[index])
  //         const userAllBackendDecode = decodeCallResult(vaultInterface, 'balanceOf', userAllBackend[index])
  //         positionDetails.walletBalance = eXDecimals(userAllBalanceDecode._hex, pool.decimals)
  //         positionDetails.pool = pool
  //         if (new BigNumber(userAllBackendDecode._hex).isGreaterThan(0)) {
  //           positionDetails.hasPosition = true
  //           const shareToAssetsPrice = eXDecimals(priceDecode._hex, pool.decimals)
  //           positionDetails.shareToAssetsPrice = new BigNumber(priceDecode._hex)
  //           positionDetails.daiDeposited = new BigNumber(userAllBackendDecode._hex).times(shareToAssetsPrice)
  //           ;(positionDetails.maxDaiDeposited = new BigNumber(tokenSupplyDecode._hex)).times(shareToAssetsPrice),
  //             (positionDetails.withdrawBlock = new BigNumber(1))

  //           // positionDetails.withdrawBlock = new BigNumber(userAllBackendDecode.withdrawBlock._hex)
  //           // positionDetails.debtDai = new BigNumber(userAllBackendDecode.debtDai._hex)
  //           // positionDetails.debtMatic = new BigNumber(userAllBackendDecode.debtMatic._hex)
  //         }
  //         userPositionDatas.push(positionDetails)
  //       })
  //       setUserPositionDatas(userPositionDatas)
  //     }
  //   } catch (e) {
  //     console.log('get user position failed!', e)
  //   }
  // }, [allPoolParams, account, provider, chainId, setUserPositionDatas])
}
