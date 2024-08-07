import { useCallback, useEffect, useState } from 'react'
import { API_BASE } from '../constant/chain'
import { useWeb3React } from '@web3-react/core'
import { useDebounceFn } from 'ahooks'

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
  const [valid, setValid] = useState<null | boolean>(null)

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
      const message = "Welcome to K-PointsWelcome to Krav's K-Points Program! Trade or LP and start earning today!"

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

  const checkReferralValidRaw = useCallback(async (inviteCode: string) => {
    if (inviteCode === '') {
      setValid(null)
    }
    try {
      const data = await fetch(API_BASE + `/user/invite/check?code=${inviteCode}`)

      const res = await data.json()
      if (res.code === 200) {
        setValid(res.data.isOk)
        return
      } else {
        setValid(null)
        throw Error('Cannot check referral code validity')
      }
    } catch (e) {
      console.log(e)
    }
  }, [])

  const { run: checkReferalValid } = useDebounceFn(checkReferralValidRaw, { wait: 600 })

  useEffect(() => {
    init()
  }, [init])

  return { referralData: initData, verifyReferral, errorStr, ready, checkReferalValid, valid }
}
