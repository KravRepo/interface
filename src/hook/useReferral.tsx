import { useCallback, useEffect, useState } from 'react'
import { API_BASE } from '../constant/chain'
import { useWeb3React } from '@web3-react/core'

export interface referralInitData {
  account: string
  code: ''
  inviter: string
  invites: any[]
}

export const useReferral = () => {
  const { account, provider } = useWeb3React()
  const [initData, setInitData] = useState<null | referralInitData>(null)
  const [errorStr, setErrorStr] = useState('')
  const [ready, setRready] = useState(false)

  const init = useCallback(async () => {
    try {
      const data = await fetch(API_BASE + '/user/invite/info?account=' + account)
      const res = await data.json()
      if (res.code === 200) {
        setInitData(res.data)
        setRready(true)
      } else {
        throw Error()
      }
    } catch (e) {
      setRready(true)
      console.log('init points page failed', e)
    }
  }, [account])

  const verifyReferral = useCallback(
    async (inviteCode: string) => {
      if (!provider) return
      const message = 'Welcome to Krav RAVE Points'
      try {
        setErrorStr('')
        const sign = await provider.getSigner().signMessage(message)

        const data = await fetch(API_BASE + '/user/invite', {
          method: 'POST',
          body: JSON.stringify({
            account,
            inviteCode,
            message: message,
            signature: sign,
          }),
        })

        const res = await data.json()
        if (res.code === 200) {
          setErrorStr('')
          init()
        } else {
          if (res.msg === 'Already invited.') {
            setErrorStr('Already invited')
            init()
          } else {
            if (res.code === 400) {
              setErrorStr('Invalid referral code')
              throw Error('Invalid referral code')
            }
            throw Error()
          }
        }
      } catch (e) {
        console.log('init points page failed', e)
      }
    },
    [account, init, provider]
  )

  useEffect(() => {
    init()
  }, [init])

  return { referralData: initData, verifyReferral, errorStr, ready }
}
