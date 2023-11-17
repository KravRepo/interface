import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import type { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { Contract } from 'ethers'
import BigNumber from 'bignumber.js'
import { base64 } from 'ethers/lib/utils'
import numeral from 'numeral'

export function isAddress(value: any): string | false {
  try {
    // Alphabetical letters must be made lowercase for getAddress to work.
    // See documentation here: https://docs.ethers.io/v5/api/utils/address/
    return getAddress(value.toLowerCase())
  } catch {
    return false
  }
}
function getSigner(provider: JsonRpcProvider, account: string): JsonRpcSigner {
  return provider.getSigner(account).connectUnchecked()
}

export function getProviderOrSigner(provider: JsonRpcProvider, account?: string): JsonRpcProvider | JsonRpcSigner {
  return account ? getSigner(provider, account) : provider
}

export function getContract(address: string, ABI: any, provider: JsonRpcProvider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(provider, account) as any)
}

export const getIsMetaMaskWallet = () => getInjection()!.name === 'MetaMask'

export const getIsCoinbaseWallet = () => Boolean(window.ethereum?.isCoinbaseWallet)

const InjectedWalletTable: { [key in keyof NonNullable<Window['ethereum']>]?: { name: string } } = {
  isBraveWallet: { name: 'Brave' },
  isRabby: { name: 'Rabby' },
  isTrust: { name: 'Trust Wallet' },
  isLedgerConnect: { name: 'Ledger' },
}

export function getInjection(isDarkMode?: boolean): { name: string } | undefined {
  for (const [key, wallet] of Object.entries(InjectedWalletTable)) {
    if (window.ethereum?.[key as keyof Window['ethereum']]) return wallet
  }
  // if (window.phantom?.ethereum?.isPhantom) return { name: 'Phantom' }

  // Check for MetaMask last, as other injectors will also set this flag, i.e. Brave browser and Phantom wallet
  if (window.ethereum?.isMetaMask) return { name: 'MetaMask' }

  // Prompt metamask installation when there is no injection present or the only injection detected is coinbase (CB has separate entry point in UI)
  if (!window.ethereum || window.ethereum.isCoinbaseWallet) return { name: 'Install MetaMask' }

  // Use a generic icon when injection is present but no known non-coinbase wallet is detected
  return { name: 'Browser Wallet' }
}

export async function getGasLimit(contract: Contract, method: string, params = [], value?: string) {
  const res = await contract.estimateGas[method](...params, { value: value })
  let gasLimit = new BigNumber(res.toString())
  if (gasLimit.lt(22000)) {
    gasLimit = new BigNumber(22000)
  }

  return gasLimit.times(11000).div(10000) // add a 10% buffer
}

export const decodeReferral = (referral: string) => {
  const decode = base64.decode(referral)
  const textDecode = new TextDecoder()
  return textDecode.decode(decode)
}

export const getBigNumberStr = (bigNumber: BigNumber, fixed: number, factor = 1) => {
  if (isNaN(bigNumber.toNumber())) return '--'
  if (!BigNumber.isBigNumber(bigNumber)) {
    return new BigNumber(bigNumber || 0)?.times(factor)?.toFixed(fixed) || '0'
  }
  if (bigNumber.isZero()) {
    return '0'
  }
  return bigNumber?.times(factor)?.toFixed(fixed) || '0'
}

export const shareToTelegram = (url: string, content: string) => {
  window.open(`https://t.me/share?url=${url}&text=${content}`)
}

export const shareToTwitter = (url: string, content: string) => {
  const encodeUrl = encodeURIComponent(url)
  const encodeContent = encodeURIComponent(content)
  window.open(`https://twitter.com/intent/tweet?text=${encodeContent}&url=${encodeUrl}`)
}

export const formatNumber = (val: string | number, decimals: number, isDollar = true) => {
  if (val === '0' || val === 0) return isDollar ? '$0' : '0'
  const forMatterStr = isDollar ? '$0,0.00' : '0,0.00'
  return numeral(Number(val).toFixed(decimals)).format(forMatterStr)
}
