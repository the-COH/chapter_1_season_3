import gql from "graphql-tag"

export const tokenFragment = gql`
	fragment Token on ERC721Token {
		id
		identifier
		uri
		owner {
			id
		}
		contract {
			id
			name
			symbol
		}
	}
`

export const collectionFragment = gql`
	fragment Collection on ERC721Contract {
		id
		name
		symbol
	}
`

export const askFragment = gql`
	fragment Ask_ask on Ask {
		id
		ask_live
		ask_askPrice
		ask_askCurrency
		ask_seller
		ask_sellerFundsRecipient
		buyer
		finder
		ask_findersFeeBps
		tokenContract
		tokenId
	}
`
export const askEventFragment = gql`
	fragment AskEvent_event on AskEvent {
		id
		time
		eventType
		ask { ...Ask_ask }
	}
	${askFragment}
`

export const offerFragment = gql`
	fragment Offer_offer on Offer {
		id
		offer_id
		offer_live
		offer_amount
		offer_currency
		offer_maker
		taker
		finder
		offer_findersFeeBps
		tokenContract
		tokenId
	}
`
export const offerEventFragment = gql`
	fragment OfferEvent_event on OfferEvent {
		id
		time
		eventType
		offer { ...Offer_offer }
	}
	${offerFragment}
`

export const transferFragment = gql`
	fragment Transfer on ERC721Transfer {
		id
		timestamp
		from {
			id
		}
		to {
			id
		}
		transaction {
			id
		}
	}
`