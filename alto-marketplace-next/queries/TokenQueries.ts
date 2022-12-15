import { gql } from "graphql-tag"
import { tokenFragment, offerFragment, transferFragment, offerEventFragment, askEventFragment } from "./fragments"

import { blacklist } from "../constants"

const blacklistString = `[${blacklist.map(address => `"${address}"`).join(",")}]`

export const tokenByContractQuery = gql`
	query TokenByContract(
		$contract: String!
		$identifier: String!
	) {
		erc721Tokens(
			where: {
				contract_: {
					id: $contract
				},
				identifier: $identifier
			}
		) { ...Token }
	}
	${tokenFragment}
`

export const tokensByOwnerQuery = gql`
	query TokensByOwner(
		$first: Int! = 100
		$skip: Int! = 0
		$orderBy: String! = "id"
		$orderDirection: String! = "asc"

		$id: String!
	) {
		erc721Tokens(
			first: $first,
			skip: $skip,
			orderBy: $orderBy,
			orderDirection: $orderDirection
			where: {
				owner: $id,
				contract_not_in: ${blacklistString}
			}
		) { ...Token }
	}
	${tokenFragment}
`

export const recentTokenTransfersQuery = gql`
	query RecentTransfers(
		$first: Int! = 10
		$skip: Int! = 0
		$orderBy: String! = "timestamp"
		$orderDirection: String! = "desc"

		$contracts: [String!]
	) {
		erc721Transfers(
			first: $first,
			skip: $skip,
			orderBy: $orderBy,
			orderDirection: $orderDirection,
			where: {
				from_: {
					id_not: "0x0000000000000000000000000000000000000000"
				},
				contract_in: $contracts,
				contract_not_in: ${blacklistString}
			}
		) {
			...Transfer
			token { ...Token }
		}
	}
	${transferFragment}
	${tokenFragment}
`

export const recentTokenMintsQuery = gql`
	query RecentMints(
		$first: Int! = 10
		$skip: Int! = 0
		$orderBy: String! = "timestamp"
		$orderDirection: String! = "desc"

		$contracts: [String!]
	) {
		erc721Transfers(
			first: $first,
			skip: $skip,
			orderBy: $orderBy,
			orderDirection: $orderDirection,
			where: {
				from_: {
					id: "0x0000000000000000000000000000000000000000"
				},
				contract_in: $contracts,
				contract_not_in: ${blacklistString}
			}
		) {
			...Transfer
			token { ...Token }
		}
	}
	${transferFragment}
	${tokenFragment}
`

export const liveTokenOffersQuery = gql`
	query TokenOffers(
		$first: Int! = 100
		$skip: Int! = 0
		$orderBy: String! = "id"
		$orderDirection: String! = "asc"

		$contract: String!
		$identifier: String!
	) {
		offers(
			first: $first,
			skip: $skip,
			orderBy: $orderBy,
			orderDirection: $orderDirection
			where: {
				tokenContract: $contract,
				tokenId: $identifier,
				offer_live: true
			}
		) { ...Offer_offer }
	}
	${offerFragment}
`

export const recentSalesQuery = gql`
	query RecentSales(
		$first: Int! = 10
		$skip: Int! = 0
		$orderBy: String! = "time"
		$orderDirection: String! = "desc"

		$contracts: [String!]
	) {
		askEvents(
			first: $first,
			skip: $skip,
			orderBy: $orderBy,
			orderDirection: $orderDirection
			where: {
				eventType: "ASK_FILLED",
				ask_: {
					tokenContract_in: $contracts,
					tokenContract_not_in: ${blacklistString}
				}
			}
		) { ...AskEvent_event }
		offerEvents(
			first: $first,
			skip: $skip,
			orderBy: $orderBy,
			orderDirection: $orderDirection
			where: {
				eventType: "OFFER_FILLED",
				offer_: {
					tokenContract_in: $contracts,
					tokenContract_not_in: ${blacklistString}
				}
			}
		) { ...OfferEvent_event }
	}
	${askEventFragment}
	${offerEventFragment}
`

export const tokenHistoryQuery = gql`
	query TokenHistory(
		$first: Int! = 10
		$skip: Int! = 0
		$orderBy: String! = "time"
		$orderDirection: String! = "desc"

		$contract: String!
		$tokenId: String!
	) {
		askEvents(
			first: $first,
			skip: $skip,
			orderBy: $orderBy,
			orderDirection: $orderDirection
			where: {
				ask_: {
					tokenContract: $contract,
					tokenId: $tokenId
				}
			}
		) { ...AskEvent_event }
		offerEvents(
			first: $first,
			skip: $skip,
			orderBy: $orderBy,
			orderDirection: $orderDirection
			where: {
				eventType: "OFFER_FILLED",
				offer_: {
					tokenContract: $contract,
					tokenId: $tokenId
				}
			}
		) { ...OfferEvent_event }
	}
	${askEventFragment}
	${offerEventFragment}
`

export const tokenTransfersQuery = gql`
	query TokenTransfers(
		$first: Int! = 10
		$skip: Int! = 0
		$orderBy: String! = "timestamp"
		$orderDirection: String! = "desc"

		$contract: String!
		$tokenId: String!
	) {
		erc721Transfers(
			first: $first,
			skip: $skip,
			orderBy: $orderBy,
			orderDirection: $orderDirection
			where: {
				contract: $contract,
				token_: {
					identifier: $tokenId
				}
			}
		) { ...Transfer }
	}
	${transferFragment}
`