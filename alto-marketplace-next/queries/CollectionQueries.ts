import { gql } from "graphql-tag"
import { askFragment, collectionFragment, tokenFragment } from "./fragments"

export const filteredCollectionsQuery = gql`
	query AllCollections(
		$first: Int! = 100
		$skip: Int! = 0
		$orderBy: String! = "id"
		$orderDirection: String! = "asc"

		$nTokens: Int! = 1
		$contracts: [String!]
	) {
		erc721Contracts(
			first: $first,
			skip: $skip,
			orderBy: $orderBy,
			orderDirection: $orderDirection

			where: {
				id_in: $contracts
			}
		) {
			...Collection
			tokens(first: $nTokens) { ...Token }
		}
	}
	${collectionFragment}
	${tokenFragment}
`

export const collectionByIdWithTokensQuery = gql`
	query CollectionWithTokens(
		$first: Int! = 100
		$skip: Int! = 0
		$orderBy: String! = "id"
		$orderDirection: String! = "asc"

		$contract: String!
	) {
		erc721Contract(id: $contract) {
			...Collection
			tokens(
				first: $first,
				skip: $skip,
				orderBy: $orderBy,
				orderDirection: $orderDirection
			) { ...Token }
		}
	}
	${collectionFragment}
	${tokenFragment}
`

export const liveCollectionAsksQuery = gql`
	query LiveTokenAsksForCollection(
		$first: Int! = 100
		$skip: Int! = 0
		$orderBy: String! = "id"
		$orderDirection: String! = "asc"

		$contract: String!
	) {
		asks(
			first: $first,
			skip: $skip,
			orderBy: $orderBy,
			orderDirection: $orderDirection
			where: {
				tokenContract: $contract,
				ask_live: true
			}
		) { ...Ask_ask }
	}
	${askFragment}
`

export const collectionVolumeQuery = gql`
	query CollectionVolume(
		$orderBy: String! = "time"
		$orderDirection: String! = "desc"

		$since: Int! = 0
		$contract: String!
	) {
		askEvents(
			where: {
				time_gte: $since,
				eventType: "ASK_FILLED",
				ask_: {
					tokenContract: $contract
				}
			}
		) {
			time
			ask {
				ask_askPrice
				ask_askCurrency
			}
		}
		offerEvents(
			where: {
				time_gte: $since,
				eventType: "OFFER_FILLED",
				offer_: {
					tokenContract: $contract
				}
			}
		) {
			time
			offer {
				offer_amount
				offer_currency
			}
		}
	}
`

export const collectionsByVolumeQuery = gql`
	query CollectionsByVolume(
		$orderBy: String! = "time"
		$orderDirection: String! = "desc"

		$since: Int! = 0
	) {
		askEvents(
			where: {
				time_gte: $since,
				eventType: "ASK_FILLED"
			}
		) {
			time
			ask {
				ask_askPrice
				ask_askCurrency
				tokenContract
				tokenId
			}
		}
		offerEvents(
			where: {
				time_gte: $since,
				eventType: "OFFER_FILLED"
			}
		) {
			time
			offer {
				offer_amount
				offer_currency
				tokenContract
				tokenId
			}
		}
	}
`