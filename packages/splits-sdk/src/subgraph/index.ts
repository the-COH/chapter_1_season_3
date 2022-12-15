import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero, One } from '@ethersproject/constants'
import { GraphQLClient, gql } from 'graphql-request'

import { SPLITS_SUBGRAPH_CHAIN_IDS } from '../constants'
import type {
  LiquidSplit,
  Split,
  SplitRecipient,
  TokenBalances,
  WaterfallModule,
  WaterfallTranche,
} from '../types'
import { fromBigNumberToPercent } from '../utils'
import {
  GqlLiquidSplit,
  GqlSplit,
  GqlTokenBalance,
  GqlWaterfallModule,
  GqlWaterfallTranche,
} from './types'

const GQL_ENDPOINTS: { [chainId: number]: string } = {
  1: 'https://api.thegraph.com/subgraphs/name/0xsplits/splits-subgraph-ethereum',
  5: 'https://api.thegraph.com/subgraphs/name/0xsplits/splits-subgraph-goerli',
  137: 'https://api.thegraph.com/subgraphs/name/0xsplits/splits-subgraph-polygon',
  80001:
    'https://api.thegraph.com/subgraphs/name/0xsplits/splits-subgraph-mumbai',
  7700: 'https://api.canto.neobase.one/subgraphs/name/canto/splits',
  10: 'https://api.thegraph.com/subgraphs/name/0xsplits/splits-subgraph-optimism',
  420: 'https://api.thegraph.com/subgraphs/name/0xsplits/splits-subgraph-opt-goerli',
  42161:
    'https://api.thegraph.com/subgraphs/name/0xsplits/splits-subgraph-arbitrum',
  421613:
    'https://api.thegraph.com/subgraphs/name/0xsplits/splits-subgraph-arb-goerli',
}

const DISTRIBUTION_EVENT_FRAGMENT = gql`
  fragment DistributionEventFragment on DistributionEvent {
    transaction {
      id
      __typename
    }
    token {
      id
      __typename
    }
    amount
    receiveDistributionEvents(
      first: 1000
      orderBy: amount
      orderDirection: desc
    ) {
      account {
        id
        __typename
      }
      amount
      __typename
    }
    distributeDistributionEvent {
      account {
        id
        __typename
      }
      amount
      __typename
    }
  }
`

const RECEIVE_DISTRIBUTION_EVENT_FRAGMENT = gql`
  fragment ReceiveDistributionEventFragment on ReceiveDistributionEvent {
    token {
      id
      __typename
    }
    amount
    distributionEvent {
      account {
        id
        __typename
      }
      transaction {
        id
        __typename
      }
      __typename
    }
  }
`

const DISTRIBUTE_DISTRIBUTION_EVENT_FRAGMENT = gql`
  fragment DistributeDistributionEventFragment on DistributeDistributionEvent {
    token {
      id
      __typename
    }
    amount
    distributionEvent {
      account {
        id
        __typename
      }
      transaction {
        id
        __typename
      }
      __typename
    }
  }
`

const WITHDRAWAL_EVENT_FRAGMENT = gql`
  fragment WithdrawalEventFragment on WithdrawalEvent {
    transaction {
      id
      __typename
    }
    tokenWithdrawalEvents(first: 1000, orderBy: amount, orderDirection: desc) {
      token {
        id
        __typename
      }
      amount
      __typename
    }
  }
`

const CONTROL_TRANSFER_EVENT_FRAGMENT = gql`
  fragment ControlTransferEventFragment on ControlTransferEvent {
    type
    transaction {
      id
      __typename
    }
    fromUserEvent {
      account {
        id
        __typename
      }
      __typename
    }
    toUserEvent {
      account {
        id
        __typename
      }
      __typename
    }
  }
`

const FROM_USER_CONTROL_TRANSFER_EVENT_FRAGMENT = gql`
  fragment FromUserControlTransferEventFragment on FromUserControlTransferEvent {
    controlTransferEvent {
      account {
        id
        __typename
      }
      type
      transaction {
        id
        __typename
      }
      toUserEvent {
        account {
          id
          __typename
        }
        __typename
      }
      __typename
    }
  }
`

const TO_USER_CONTROL_TRANSFER_EVENT_FRAGMENT = gql`
  fragment ToUserControlTransferEventFragment on ToUserControlTransferEvent {
    controlTransferEvent {
      account {
        id
        __typename
      }
      type
      transaction {
        id
        __typename
      }
      fromUserEvent {
        account {
          id
          __typename
        }
        __typename
      }
      __typename
    }
  }
`

const SET_SPLIT_EVENT_FRAGMENT = gql`
  fragment SetSplitEventFragment on SetSplitEvent {
    transaction {
      id
      __typename
    }
    type
    recipientAddedEvents(first: 1000) {
      account {
        id
        __typename
      }
      __typename
    }
    recipientRemovedEvents(first: 1000) {
      account {
        id
        __typename
      }
      __typename
    }
  }
`

const RECIPIENT_ADDED_EVENT_FRAGMENT = gql`
  fragment RecipientAddedEventFragment on RecipientAddedEvent {
    setSplitEvent {
      transaction {
        id
        __typename
      }
      account {
        id
        __typename
      }
      __typename
    }
  }
`

const RECIPIENT_REMOVED_EVENT_FRAGMENT = gql`
  fragment RecipientRemovedEventFragment on RecipientRemovedEvent {
    setSplitEvent {
      transaction {
        id
        __typename
      }
      account {
        id
        __typename
      }
      __typename
    }
  }
`

const CREATE_VESTING_MODULE_EVENT_FRAGMENT = gql`
  fragment CreateVestingModuleEventFragment on CreateVestingModuleEvent {
    transaction {
      id
      __typename
    }
  }
`

const CREATE_VESTING_STREAM_EVENT_FRAGMENT = gql`
  fragment CreateVestingStreamEventFragment on CreateVestingStreamEvent {
    transaction {
      id
      __typename
    }
    token {
      id
      __typename
    }
    amount
  }
`

const RELEASE_VESTING_FUNDS_EVENT_FRAGMENT = gql`
  fragment ReleaseVestingFundsEventFragment on ReleaseVestingFundsEvent {
    account {
      id
      ... on VestingModule {
        beneficiary {
          id
          __typename
        }
        __typename
      }
      __typename
    }
    transaction {
      id
      __typename
    }
    token {
      id
      __typename
    }
    amount
  }
`

const RECEIVE_VESTED_FUNDS_EVENT_FRAGMENT = gql`
  fragment ReceiveVestedFundsEventFragment on ReceiveVestedFundsEvent {
    account {
      id
      __typename
    }
    releaseVestingFundsEvent {
      account {
        id
        __typename
      }
      transaction {
        id
        __typename
      }
      token {
        id
        __typename
      }
      amount
      __typename
    }
  }
`

const CREATE_WATERFALL_MODULE_EVENT_FRAGMENT = gql`
  fragment CreateWaterfallModuleEventFragment on CreateWaterfallModuleEvent {
    transaction {
      id
      __typename
    }
    recipientAddedEvents(first: 1000) {
      account {
        id
        __typename
      }
      __typename
    }
  }
`

const WATERFALL_RECIPIENT_ADDED_EVENT_FRAGMENT = gql`
  fragment WaterfallRecipientAddedEventFragment on WaterfallRecipientAddedEvent {
    createWaterfallEvent {
      transaction {
        id
        __typename
      }
      account {
        id
        __typename
      }
      __typename
    }
  }
`

const WATERFALL_FUNDS_EVENT_FRAGMENT = gql`
  fragment WaterfallFundsEventFragment on WaterfallFundsEvent {
    account {
      id
      ... on WaterfallModule {
        token {
          id
          __typename
        }
        __typename
      }
      __typename
    }
    transaction {
      id
      __typename
    }
    amount
    receiveFundsEvents(first: 1000, orderBy: amount, orderDirection: desc) {
      account {
        id
        __typename
      }
      amount
      __typename
    }
  }
`

const RECEIVE_WATERFALL_FUNDS_EVENT_FRAGMENT = gql`
  fragment ReceiveWaterfallFundsEventFragment on ReceiveWaterfallFundsEvent {
    amount
    waterfallFundsEvent {
      account {
        id
        ... on WaterfallModule {
          token {
            id
            __typename
          }
          __typename
        }
        __typename
      }
      transaction {
        id
        __typename
      }
      __typename
    }
  }
`

const RECOVER_NON_WATERFALL_FUNDS_EVENT_FRAGMENT = gql`
  fragment RecoverNonWaterfallFundsEventFragment on RecoverNonWaterfallFundsEvent {
    account {
      id
      __typename
    }
    transaction {
      id
      __typename
    }
    amount
    nonWaterfallToken {
      id
      __typename
    }
    receiveNonWaterfallFundsEvent {
      account {
        id
        __typename
      }
      __typename
    }
  }
`

const RECEIVE_NON_WATERFALL_EVENT_FRAGMENT = gql`
  fragment ReceiveNonWaterfallFundsEventFragment on ReceiveNonWaterfallFundsEvent {
    recoverNonWaterfallFundsEvent {
      amount
      account {
        id
        __typename
      }
      transaction {
        id
        __typename
      }
      nonWaterfallToken {
        id
        __typename
      }
      __typename
    }
  }
`

const CREATE_LIQUID_SPLIT_EVENT_FRAGMENT = gql`
  fragment CreateLiquidSplitEventFragment on CreateLiquidSplitEvent {
    transaction {
      id
      __typename
    }
  }
`

const LIQUID_SPLIT_NFT_TRANSFER_EVENT_FRAGMENT = gql`
  fragment LiquidSplitNFTTransferEventFragment on LiquidSplitNFTTransferEvent {
    transaction {
      id
      __typename
    }
    amount
    transferType
    nftAddedEvent {
      account {
        id
        __typename
      }
      __typename
    }
    nftRemovedEvent {
      account {
        id
        __typename
      }
      __typename
    }
  }
`

const LIQUID_SPLIT_NFT_ADDED_EVENT_FRAGMENT = gql`
  fragment LiquidSplitNFTAddedEventFragment on LiquidSplitNFTAddedEvent {
    nftTransferEvent {
      account {
        id
        __typename
      }
      transaction {
        id
        __typename
      }
      amount
      transferType
      nftRemovedEvent {
        account {
          id
          __typename
        }
        __typename
      }
      __typename
    }
  }
`

const LIQUID_SPLIT_NFT_REMOVED_EVENT_FRAGMENT = gql`
  fragment LiquidSplitNFTRemovedEventFragment on LiquidSplitNFTRemovedEvent {
    nftTransferEvent {
      account {
        id
        __typename
      }
      transaction {
        id
        __typename
      }
      amount
      transferType
      nftAddedEvent {
        account {
          id
          __typename
        }
        __typename
      }
      __typename
    }
  }
`

const ACCOUNT_EVENT_FRAGMENT = gql`
  fragment AccountEventFragment on AccountEvent {
    id
    timestamp
    logIndex
    account {
      id
      __typename
    }
    ... on DistributionEvent {
      ...DistributionEventFragment
      __typename
    }
    ... on ReceiveDistributionEvent {
      ...ReceiveDistributionEventFragment
      __typename
    }
    ... on DistributeDistributionEvent {
      ...DistributeDistributionEventFragment
      __typename
    }
    ... on WithdrawalEvent {
      ...WithdrawalEventFragment
      __typename
    }
    ... on ControlTransferEvent {
      ...ControlTransferEventFragment
      __typename
    }
    ... on FromUserControlTransferEvent {
      ...FromUserControlTransferEventFragment
      __typename
    }
    ... on ToUserControlTransferEvent {
      ...ToUserControlTransferEventFragment
      __typename
    }
    ... on SetSplitEvent {
      ...SetSplitEventFragment
      __typename
    }
    ... on RecipientAddedEvent {
      ...RecipientAddedEventFragment
      __typename
    }
    ... on RecipientRemovedEvent {
      ...RecipientRemovedEventFragment
      __typename
    }
    ... on CreateVestingModuleEvent {
      ...CreateVestingModuleEventFragment
      __typename
    }
    ... on CreateVestingStreamEvent {
      ...CreateVestingStreamEventFragment
      __typename
    }
    ... on ReleaseVestingFundsEvent {
      ...ReleaseVestingFundsEventFragment
      __typename
    }
    ... on ReceiveVestedFundsEvent {
      ...ReceiveVestedFundsEventFragment
      __typename
    }
    ... on CreateWaterfallModuleEvent {
      ...CreateWaterfallModuleEventFragment
      __typename
    }
    ... on WaterfallRecipientAddedEvent {
      ...WaterfallRecipientAddedEventFragment
      __typename
    }
    ... on WaterfallFundsEvent {
      ...WaterfallFundsEventFragment
      __typename
    }
    ... on ReceiveWaterfallFundsEvent {
      ...ReceiveWaterfallFundsEventFragment
      __typename
    }
    ... on RecoverNonWaterfallFundsEvent {
      ...RecoverNonWaterfallFundsEventFragment
      __typename
    }
    ... on ReceiveNonWaterfallFundsEvent {
      ...ReceiveNonWaterfallFundsEventFragment
      __typename
    }
    ... on CreateLiquidSplitEvent {
      ...CreateLiquidSplitEventFragment
      __typename
    }
    ... on LiquidSplitNFTTransferEvent {
      ...LiquidSplitNFTTransferEventFragment
      __typename
    }
    ... on LiquidSplitNFTAddedEvent {
      ...LiquidSplitNFTAddedEventFragment
      __typename
    }
    ... on LiquidSplitNFTRemovedEvent {
      ...LiquidSplitNFTRemovedEventFragment
      __typename
    }
  }

  ${DISTRIBUTION_EVENT_FRAGMENT}
  ${RECEIVE_DISTRIBUTION_EVENT_FRAGMENT}
  ${DISTRIBUTE_DISTRIBUTION_EVENT_FRAGMENT}
  ${WITHDRAWAL_EVENT_FRAGMENT}
  ${CONTROL_TRANSFER_EVENT_FRAGMENT}
  ${FROM_USER_CONTROL_TRANSFER_EVENT_FRAGMENT}
  ${TO_USER_CONTROL_TRANSFER_EVENT_FRAGMENT}
  ${SET_SPLIT_EVENT_FRAGMENT}
  ${RECIPIENT_ADDED_EVENT_FRAGMENT}
  ${RECIPIENT_REMOVED_EVENT_FRAGMENT}
  ${CREATE_VESTING_MODULE_EVENT_FRAGMENT}
  ${CREATE_VESTING_STREAM_EVENT_FRAGMENT}
  ${RELEASE_VESTING_FUNDS_EVENT_FRAGMENT}
  ${RECEIVE_VESTED_FUNDS_EVENT_FRAGMENT}
  ${CREATE_WATERFALL_MODULE_EVENT_FRAGMENT}
  ${WATERFALL_RECIPIENT_ADDED_EVENT_FRAGMENT}
  ${WATERFALL_FUNDS_EVENT_FRAGMENT}
  ${RECEIVE_WATERFALL_FUNDS_EVENT_FRAGMENT}
  ${RECOVER_NON_WATERFALL_FUNDS_EVENT_FRAGMENT}
  ${RECEIVE_NON_WATERFALL_EVENT_FRAGMENT}
  ${CREATE_LIQUID_SPLIT_EVENT_FRAGMENT}
  ${LIQUID_SPLIT_NFT_TRANSFER_EVENT_FRAGMENT}
  ${LIQUID_SPLIT_NFT_ADDED_EVENT_FRAGMENT}
  ${LIQUID_SPLIT_NFT_REMOVED_EVENT_FRAGMENT}
`

const TOKEN_BALANCE_FIELDS_FRAGMENT = gql`
  fragment TokenBalanceFieldsFragment on TokenBalance {
    amount
    token {
      id
    }
  }
`

const RECIPIENT_FIELDS_FRAGMENT = gql`
  fragment RecipientFieldsFragment on Recipient {
    id
    account {
      id
    }
    split {
      id
    }
    ownership
  }
`

const ACCOUNT_BALANCES_FRAGMENT = gql`
  fragment AccountBalancesFragment on Account {
    internalBalances(first: 1000, orderBy: amount, orderDirection: desc) {
      ...TokenBalanceFieldsFragment
    }
    withdrawals(first: 1000, orderBy: amount, orderDirection: desc) {
      ...TokenBalanceFieldsFragment
    }
  }

  ${TOKEN_BALANCE_FIELDS_FRAGMENT}
`

const ACCOUNT_FIELDS_FRAGMENT = gql`
  fragment AccountFieldsFragment on Account {
    id
    upstream(first: 1000) {
      ...RecipientFieldsFragment
    }
    ...AccountBalancesFragment
  }

  ${RECIPIENT_FIELDS_FRAGMENT}
  ${ACCOUNT_BALANCES_FRAGMENT}
`

const SPLIT_FIELDS_FRAGMENT = gql`
  fragment SplitFieldsFragment on Split {
    controller
    distributorFee
    newPotentialController
    createdBlock
    latestBlock
    recipients(first: 1000, orderBy: ownership, orderDirection: desc) {
      ...RecipientFieldsFragment
    }
  }

  ${RECIPIENT_FIELDS_FRAGMENT}
`

const FULL_SPLIT_FIELDS_FRAGMENT = gql`
  fragment FullSplitFieldsFragment on Split {
    ...AccountFieldsFragment
    ...SplitFieldsFragment
    accountEvents(first: 1000, orderBy: timestamp, orderDirection: desc) {
      ...AccountEventFragment
      __typename
    }
  }

  ${ACCOUNT_FIELDS_FRAGMENT}
  ${SPLIT_FIELDS_FRAGMENT}
  ${ACCOUNT_EVENT_FRAGMENT}
`

const WATERFALL_TRANCHE_FIELDS_FRAGMENT = gql`
  fragment WaterfallTrancheFieldsFragment on WaterfallTranche {
    startAmount
    size
    claimedAmount
    recipient {
      id
    }
  }
`

const WATERFALL_MODULE_FIELDS_FRAGMENT = gql`
  fragment WaterfallModuleFieldsFragment on WaterfallModule {
    token {
      id
    }
    nonWaterfallRecipient
    latestBlock
    tranches(first: 1000) {
      ...WaterfallTrancheFieldsFragment
    }
  }

  ${WATERFALL_TRANCHE_FIELDS_FRAGMENT}
`

const FULL_WATERFALL_MODULE_FIELDS_FRAGMENT = gql`
  fragment FullWaterfallModuleFieldsFragment on WaterfallModule {
    ...AccountFieldsFragment
    ...WaterfallModuleFieldsFragment
  }

  ${ACCOUNT_FIELDS_FRAGMENT}
  ${WATERFALL_MODULE_FIELDS_FRAGMENT}
`

const LIQUID_SPLIT_HOLDERS_FRAGMENT = gql`
  fragment LiquidSplitHoldersFragment on Holder {
    account {
      id
    }
    ownership
  }
`

const LIQUID_SPLIT_FIELDS_FRAGMENT = gql`
  fragment LiquidSplitFieldsFragment on LiquidSplit {
    latestBlock
    holders(first: 1000, where: { ownership_gt: "0" }) {
      ...LiquidSplitHoldersFragment
    }
    distributorFee
    split {
      ...FullSplitFieldsFragment
    }
    isFactoryGenerated
  }

  ${LIQUID_SPLIT_HOLDERS_FRAGMENT}
  ${FULL_SPLIT_FIELDS_FRAGMENT}
`

const FULL_LIQUID_SPLIT_FIELDS_FRAGMENT = gql`
  fragment FullLiquidSplitFieldsFragment on LiquidSplit {
    ...AccountFieldsFragment
    ...LiquidSplitFieldsFragment
  }

  ${ACCOUNT_FIELDS_FRAGMENT}
  ${LIQUID_SPLIT_FIELDS_FRAGMENT}
`

export const formatRecipient = (gqlRecipient: {
  account: { id: string }
  ownership: number
}): SplitRecipient => {
  return {
    address: getAddress(gqlRecipient.account.id),
    percentAllocation: fromBigNumberToPercent(gqlRecipient.ownership),
  }
}

// Should only be called by formatSplit on SplitsClient
export const protectedFormatSplit = (gqlSplit: GqlSplit): Split => {
  return {
    type: 'Split',
    id: getAddress(gqlSplit.id),
    controller:
      gqlSplit.controller !== AddressZero
        ? getAddress(gqlSplit.controller)
        : null,
    newPotentialController:
      gqlSplit.newPotentialController !== AddressZero
        ? getAddress(gqlSplit.newPotentialController)
        : null,
    distributorFeePercent: fromBigNumberToPercent(gqlSplit.distributorFee),
    createdBlock: gqlSplit.createdBlock,
    recipients: gqlSplit.recipients
      .map((gqlRecipient) => formatRecipient(gqlRecipient))
      .sort((a, b) => {
        return b.percentAllocation - a.percentAllocation
      }),
    accountEvents: gqlSplit.accountEvents,
  }
}

// Should only be called by formatWaterfallModule on WaterfallClient
export const protectedFormatWaterfallModule = (
  gqlWaterfallModule: GqlWaterfallModule,
  tokenSymbol: string,
  tokenDecimals: number,
): WaterfallModule => {
  return {
    type: 'WaterfallModule',
    id: getAddress(gqlWaterfallModule.id),
    token: {
      address: getAddress(gqlWaterfallModule.token.id),
      symbol: tokenSymbol,
      decimals: tokenDecimals,
    },
    nonWaterfallRecipient:
      gqlWaterfallModule.nonWaterfallRecipient !== AddressZero
        ? getAddress(gqlWaterfallModule.nonWaterfallRecipient)
        : null,
    tranches: gqlWaterfallModule.tranches.map((tranche) =>
      formatWaterfallModuleTranche(tranche, tokenDecimals),
    ),
  }
}

const formatWaterfallModuleTranche = (
  gqlWaterfallTranche: GqlWaterfallTranche,
  tokenDecimals: number,
): WaterfallTranche => {
  return {
    recipientAddress: getAddress(gqlWaterfallTranche.recipient.id),
    startAmount: gqlWaterfallTranche.startAmount / Math.pow(10, tokenDecimals),
    size: gqlWaterfallTranche.size
      ? gqlWaterfallTranche.size / Math.pow(10, tokenDecimals)
      : undefined,
  }
}

// Should only be called by formatLiquidSplit on LiquidSplitClient
export const protectedFormatLiquidSplit = (
  gqlLiquidSplit: GqlLiquidSplit,
): LiquidSplit => {
  return {
    type: 'LiquidSplit',
    id: getAddress(gqlLiquidSplit.id),
    distributorFeePercent: fromBigNumberToPercent(
      gqlLiquidSplit.distributorFee,
    ),
    payoutSplitId: getAddress(gqlLiquidSplit.split.id),
    isFactoryGenerated: gqlLiquidSplit.isFactoryGenerated,
    holders: gqlLiquidSplit.holders
      .map((gqlHolder) => formatRecipient(gqlHolder))
      .sort((a, b) => {
        return b.percentAllocation - a.percentAllocation
      }),
  }
}

export const formatAccountBalances = (
  gqlTokenBalances: GqlTokenBalance[],
): TokenBalances => {
  return gqlTokenBalances.reduce((acc, gqlTokenBalance) => {
    const tokenId = getAddress(gqlTokenBalance.token.id)
    const amount = BigNumber.from(gqlTokenBalance.amount)

    if (amount > One) acc[tokenId] = amount
    return acc
  }, {} as TokenBalances)
}

export const SPLIT_QUERY = gql`
  query split($splitId: ID!) {
    split(id: $splitId) {
      ...FullSplitFieldsFragment
    }
  }

  ${FULL_SPLIT_FIELDS_FRAGMENT}
`

export const WATERFALL_MODULE_QUERY = gql`
  query waterfallModule($waterfallModuleId: ID!) {
    waterfallModule(id: $waterfallModuleId) {
      ...FullWaterfallModuleFieldsFragment
    }
  }

  ${FULL_WATERFALL_MODULE_FIELDS_FRAGMENT}
`

export const LIQUID_SPLIT_QUERY = gql`
  query liquidSplit($liquidSplitId: ID!) {
    liquidSplit(id: $liquidSplitId) {
      ...FullLiquidSplitFieldsFragment
    }
  }

  ${FULL_LIQUID_SPLIT_FIELDS_FRAGMENT}
`

export const ACCOUNT_QUERY = gql`
  query account($accountId: ID!) {
    account(id: $accountId) {
      __typename
      ...AccountFieldsFragment
      ...SplitFieldsFragment
      ...WaterfallModuleFieldsFragment
      ...LiquidSplitFieldsFragment
    }
  }

  ${ACCOUNT_FIELDS_FRAGMENT}
  ${SPLIT_FIELDS_FRAGMENT}
  ${WATERFALL_MODULE_FIELDS_FRAGMENT}
  ${LIQUID_SPLIT_FIELDS_FRAGMENT}
`

export const TOP_SPLITS_QUERY = gql`
  query splits($lastId: String, $numSplits: Int = 1000) {
    splits(first: $numSplits, where: { id_gt: $lastId }) {
      ...FullSplitFieldsFragment
      __typename
    }
  }

  ${FULL_SPLIT_FIELDS_FRAGMENT}
`

export const TOP_RECIPIENTS_QUERY = gql`
  query recipients($lastId: String, $numSplits: Int = 1000) {
    recipients(first: $numSplits, where: { id_gt: $lastId }) {
      ...RecipientFieldsFragment
      __typename
    }
  }

  ${RECIPIENT_FIELDS_FRAGMENT}
`

export const RELATED_SPLITS_QUERY = gql`
  query relatedSplits($accountId: String!) {
    receivingFrom: recipients(where: { account: $accountId }) {
      split {
        ...FullSplitFieldsFragment
      }
    }
    controlling: splits(where: { controller: $accountId }) {
      ...FullSplitFieldsFragment
    }
    pendingControl: splits(where: { newPotentialController: $accountId }) {
      ...FullSplitFieldsFragment
    }
  }

  ${FULL_SPLIT_FIELDS_FRAGMENT}
`

export const ACCOUNT_BALANCES_QUERY = gql`
  query accountBalances($accountId: ID!) {
    accountBalances: account(id: $accountId) {
      ...AccountBalancesFragment
    }
  }

  ${ACCOUNT_BALANCES_FRAGMENT}
`

export const getGraphqlClient = (
  chainId: number,
): GraphQLClient | undefined => {
  if (!SPLITS_SUBGRAPH_CHAIN_IDS.includes(chainId)) return

  return new GraphQLClient(GQL_ENDPOINTS[chainId])
}
