import { useWeb3React } from '@web3-react/core'
import { useRootStore } from '../../store/root'
import { useCallback } from 'react'
import { Contract } from 'ethers'
import trading_vault from '../../abi/trading_vault_v5.json'
import { PoolParams } from '../../store/FactorySlice'
import BigNumber from 'bignumber.js'
import test_erc20 from '../../abi/test_erc20.json'
import { eXDecimals } from '../../utils/math'
import multicall2 from '../../abi/multicall2.json'
import { creatCall, decodeCallResult } from './useContract'
import { Interface } from 'ethers/lib/utils'
import { CONTRACT_CONFIG, DEFAULT_CHAIN, SUPPORT_CHAIN } from '../../constant/chain'

export type UserData = {
  pool: PoolParams
  daiDeposited: BigNumber
  maxDaiDeposited: BigNumber
  withdrawBlock: BigNumber
  debtDai: BigNumber
  debtMatic: BigNumber
  walletBalance: BigNumber
  hasPosition: boolean
}

export const useUserPosition = () => {
  const { provider, account, chainId } = useWeb3React()
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const setUserPositionDatas = useRootStore((store) => store.setUserPositionDatas)
  return useCallback(async () => {
    try {
      if (allPoolParams.length > 0 && account && provider && chainId) {
        const multicall = new Contract(
          chainId && SUPPORT_CHAIN.includes(chainId)
            ? CONTRACT_CONFIG[chainId].multicall
            : CONTRACT_CONFIG[DEFAULT_CHAIN].multicall,
          multicall2.abi,
          provider
        )
        const task: any[] = []
        const balanceTask: any[] = []
        const tokenInterface = new Interface(test_erc20.abi)
        const vaultInterface = new Interface(trading_vault.abi)
        allPoolParams.forEach((pool) => {
          task.push(creatCall(pool.vaultT, vaultInterface, 'users', [account]))
          balanceTask.push(creatCall(pool.tokenT, tokenInterface, 'balanceOf', [account]))
        })
        const res = await multicall.callStatic.aggregate([...task, ...balanceTask])
        const userAllBackend = res.returnData.slice(0, allPoolParams.length)
        const userAllBalance = res.returnData.slice(allPoolParams.length, res.returnData.length)
        const userPositionDatas: UserData[] = []
        allPoolParams.forEach((pool, index) => {
          const positionDetails = {} as UserData
          const userAllBalanceDecode = decodeCallResult(tokenInterface, 'balanceOf', userAllBalance[index])
          const userAllBackendDecode = decodeCallResult(vaultInterface, 'users', userAllBackend[index])
          positionDetails.walletBalance = eXDecimals(userAllBalanceDecode._hex, pool.decimals)
          positionDetails.pool = pool
          if (new BigNumber(userAllBackendDecode.daiDeposited._hex).isGreaterThan(0)) {
            positionDetails.hasPosition = true
            positionDetails.daiDeposited = new BigNumber(userAllBackendDecode.daiDeposited._hex)
            positionDetails.maxDaiDeposited = new BigNumber(userAllBackendDecode.maxDaiDeposited._hex)
            positionDetails.withdrawBlock = new BigNumber(userAllBackendDecode.withdrawBlock._hex)
            positionDetails.debtDai = new BigNumber(userAllBackendDecode.debtDai._hex)
            positionDetails.debtMatic = new BigNumber(userAllBackendDecode.debtMatic._hex)
          }
          userPositionDatas.push(positionDetails)
        })
        setUserPositionDatas(userPositionDatas)
      }
    } catch (e) {
      console.log('get user position failed!', e)
    }
  }, [allPoolParams, account, provider, chainId])
}
