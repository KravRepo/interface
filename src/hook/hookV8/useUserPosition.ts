import { useWeb3React } from '@web3-react/core'
import { useRootStore } from '../../store/root'
import { useCallback } from 'react'
import { Contract } from 'ethers'
import trading_vault from 'abi/trading_vault_v5.json'
import { PoolParams } from '../../store/FactorySlice'
import BigNumber from 'bignumber.js'
import test_erc20 from '../../abi/test_erc20.json'
import { eXDecimals } from '../../utils/math'

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
  const { provider, account } = useWeb3React()
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const setUserPositionDatas = useRootStore((store) => store.setUserPositionDatas)
  return useCallback(async () => {
    try {
      if (allPoolParams.length > 0 && account && provider) {
        const task = [] as any
        const balanceTask = [] as any
        allPoolParams.forEach((pool) => {
          const vault = new Contract(pool.vaultT, trading_vault.abi, provider)
          const tokenContract = new Contract(pool.tokenT, test_erc20.abi, provider)
          task.push(vault.users(account))
          balanceTask.push(tokenContract.balanceOf(account))
        })
        const userAllBackend = await Promise.all(task)
        const userAllBalance = await Promise.all(balanceTask)
        const userPositionDatas: UserData[] = []
        allPoolParams.forEach((pool, index) => {
          const positionDetails = {} as UserData
          positionDetails.walletBalance = eXDecimals(userAllBalance[index]._hex, pool.decimals)
          positionDetails.pool = pool
          if (new BigNumber(userAllBackend[index].daiDeposited._hex).isGreaterThan(0)) {
            positionDetails.hasPosition = true
            positionDetails.daiDeposited = new BigNumber(userAllBackend[index].daiDeposited._hex)
            positionDetails.maxDaiDeposited = new BigNumber(userAllBackend[index].maxDaiDeposited._hex)
            positionDetails.withdrawBlock = new BigNumber(userAllBackend[index].withdrawBlock._hex)
            positionDetails.debtDai = new BigNumber(userAllBackend[index].debtDai._hex)
            positionDetails.debtMatic = new BigNumber(userAllBackend[index].debtMatic._hex)
          }
          userPositionDatas.push(positionDetails)
        })
        setUserPositionDatas(userPositionDatas)
      }
    } catch (e) {
      console.log('get user position failed!', e)
    }
  }, [allPoolParams, account, provider])
}
