import { Provider } from '@ethersproject/abstract-provider'
import { BigNumber } from '@ethersproject/bignumber'
import { hexZeroPad } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { Contract, ContractTransaction, Event } from '@ethersproject/contracts'
import { nameprep } from '@ethersproject/strings'
import { parseUnits } from '@ethersproject/units'

import {
  CHAIN_INFO,
  LIQUID_SPLIT_NFT_COUNT,
  PERCENTAGE_SCALE,
  POLYGON_CHAIN_IDS,
  CANTO_CHAIN_IDS,
  REVERSE_RECORDS_ADDRESS,
} from '../constants'
import type {
  SplitRecipient,
  WaterfallTranche,
  WaterfallTrancheInput,
} from '../types'
import { ierc20Interface } from './ierc20'
import { reverseRecordsInterface } from './reverseRecords'

export const getRecipientSortedAddressesAndAllocations = (
  recipients: SplitRecipient[],
): [string[], BigNumber[]] => {
  const accounts: string[] = []
  const percentAllocations: BigNumber[] = []

  recipients
    .sort((a, b) => {
      if (a.address.toLowerCase() > b.address.toLowerCase()) return 1
      return -1
    })
    .map((value) => {
      accounts.push(value.address)
      percentAllocations.push(getBigNumberFromPercent(value.percentAllocation))
    })

  return [accounts, percentAllocations]
}

export const getNftCountsFromPercents = (
  percentAllocations: BigNumber[],
): number[] => {
  return percentAllocations.map((p) =>
    p
      .mul(BigNumber.from(LIQUID_SPLIT_NFT_COUNT))
      .div(PERCENTAGE_SCALE)
      .toNumber(),
  )
}

export const getBigNumberFromPercent = (value: number): BigNumber => {
  return BigNumber.from(Math.round(PERCENTAGE_SCALE.toNumber() * value) / 100)
}

export const fromBigNumberToPercent = (value: BigNumber | number): number => {
  const numberVal = value instanceof BigNumber ? value.toNumber() : value
  return (numberVal * 100) / PERCENTAGE_SCALE.toNumber()
}

export const getBigNumberTokenValue = (
  value: number,
  decimals: number,
): BigNumber => {
  return parseUnits(value.toString(), decimals)
}

export const getTransactionEvents = async (
  transaction: ContractTransaction,
  eventTopics: string[],
): Promise<Event[]> => {
  const receipt = await transaction.wait()
  if (receipt.status === 1) {
    const events = receipt.events?.filter((e) =>
      eventTopics.includes(e.topics[0]),
    )

    return events ?? []
  }

  return []
}

export const fetchERC20TransferredTokens = async (
  splitId: string,
): Promise<string[]> => {
  const tokens = new Set<string>([])

  const response = await fetch(
    `https://evm.explorer.canto.io/api?module=account&action=tokenlist&address=${splitId}`,
    {
      method: 'GET',
      headers: { accept: 'application/json' },
    },
  )
  const data = await response.json()

  data.result.map((token: any) => {
    const erc20Address = token.contractAddress
    tokens.add(erc20Address)
  })

  return Array.from(tokens)
}

type TokenBalance = {
  contractAddress: string
  balance: string
  symbol: string
}

export const fetchAllTokenBalances = async (
  accountId: string,
): Promise<TokenBalance[]> => {
  const response = await fetch(
    `https://evm.explorer.canto.io/api?module=account&action=tokenlist&address=${accountId}`,
    {
      method: 'GET',
      headers: { accept: 'application/json' },
    },
  )
  const data = await response.json()

  const balanceResponse = await fetch(
    `https://evm.explorer.canto.io/api?module=account&action=balance&address=${accountId}`,
    {
      method: 'GET',
      headers: { accept: 'application/json' },
    },
  )
  const balance = await balanceResponse.json()
  data.result.push({
    contractAddress: AddressZero,
    balance: balance.result,
    symbol: 'CANTO',
  })

  return data.result
}

export const fetchEnsNames = async (
  provider: Provider,
  addresses: string[],
): Promise<string[]> => {
  // Do nothing if not on mainnet
  const providerNetwork = await provider.getNetwork()
  if (providerNetwork.chainId !== 1)
    return Array(addresses.length).fill(undefined)

  const reverseRecords = new Contract(
    REVERSE_RECORDS_ADDRESS,
    reverseRecordsInterface,
    provider,
  )

  const allNames: string[] = await reverseRecords.getNames(addresses)
  return allNames
}

export const addEnsNames = async (
  provider: Provider,
  recipients: SplitRecipient[],
): Promise<void> => {
  const addresses = recipients.map((recipient) => recipient.address)
  const allNames = await fetchEnsNames(provider, addresses)

  allNames.map((ens, index) => {
    if (ens) {
      try {
        if (nameprep(ens)) {
          recipients[index].ensName = ens
        }
      } catch (e) {
        // nameprep generates an error for certain characters (like emojis).
        // Let's just ignore for now and not add the ens
        return
      }
    }
  })
}

export const addWaterfallEnsNames = async (
  provider: Provider,
  tranches: WaterfallTranche[],
): Promise<void> => {
  const addresses = tranches.map((tranche) => tranche.recipientAddress)
  const allNames = await fetchEnsNames(provider, addresses)

  allNames.map((ens, index) => {
    if (ens) {
      try {
        if (nameprep(ens)) {
          tranches[index].recipientEnsName = ens
        }
      } catch (e) {
        // nameprep generates an error for certain characters (like emojis).
        // Let's just ignore for now and not add the ens
        return
      }
    }
  })
}

export const getTrancheRecipientsAndSizes = async (
  chainId: number,
  token: string,
  tranches: WaterfallTrancheInput[],
  provider: Provider,
): Promise<[string[], BigNumber[]]> => {
  const recipients: string[] = []
  const sizes: BigNumber[] = []

  const tokenData = await getTokenData(chainId, token, provider)

  let trancheSum = BigNumber.from(0)
  tranches.forEach((tranche) => {
    recipients.push(tranche.recipient)
    if (tranche.size) {
      trancheSum = trancheSum.add(
        getBigNumberTokenValue(tranche.size, tokenData.decimals),
      )
      sizes.push(trancheSum)
    }
  })

  return [recipients, sizes]
}

export const getTokenData = async (
  chainId: number,
  token: string,
  provider: Provider,
): Promise<{
  symbol: string
  decimals: number
}> => {
  if (token === AddressZero) {
    if (POLYGON_CHAIN_IDS.includes(chainId))
      return {
        symbol: 'MATIC',
        decimals: 18,
      }
    if (CANTO_CHAIN_IDS.includes(chainId))
      return {
        symbol: 'CANTO',
        decimals: 18,
      }
    return {
      symbol: 'ETH',
      decimals: 18,
    }
  }

  const tokenContract = new Contract(token, ierc20Interface, provider)
  // TODO: error handling? For bad erc20...

  const [decimals, symbol] = await Promise.all([
    tokenContract.decimals(),
    tokenContract.symbol(),
  ])

  return {
    symbol,
    decimals,
  }
}

interface TokenData {
  price: number
  image: string | null
  name: string
  symbol: string
  decimal: number
}

export const fetchMetaData = async (
  provider: Provider,
  tokenAddresses: string[],
): Promise<TokenData[]> => {
  const prices = await Promise.all(
    tokenAddresses.map(async (address) => {
      // handle CANTO as wCANTO
      if (address === AddressZero) {
        address = '0x826551890dc65655a0aceca109ab11abdbd7a07b'
      }
      const tokenResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/canto/contract/${address.toLowerCase()}`,
        {
          method: 'GET',
          headers: { accept: 'application/json' },
        },
      )
      if (tokenResponse.status === 200) {
        const tokenData = await tokenResponse.json()
        return {
          price: tokenData['market_data']['current_price']['usd'],
          image:
            address === '0x826551890dc65655a0aceca109ab11abdbd7a07b'
              ? 'https://raw.githubusercontent.com/Canto-Network/canto-branding-assets/main/avatar-green-on-black.png'
              : tokenData['image']['small'],
          name: tokenData['name'],
          symbol: tokenData['symbol'],
          decimal: tokenData['detail_platforms']['canto']['decimal_place'],
        } as TokenData
      } else {
        const tokenContract = new Contract(address, ierc20Interface, provider)
        // TODO: error handling? For bad erc20...

        const [name, symbol, decimals] = await Promise.all([
          tokenContract.name(),
          tokenContract.symbol(),
          tokenContract.decimals(),
        ])
        return {
          price: 0,
          image: null,
          name: name,
          symbol: symbol,
          decimal: decimals,
        } as TokenData
      }
    }),
  )
  return prices
}
