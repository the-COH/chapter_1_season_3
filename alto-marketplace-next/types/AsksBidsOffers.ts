export type Ask = {
	id?: string,
	ask_live?: boolean,
	ask_askPrice: string,
	ask_askCurrency: string,
	ask_seller: string,
	ask_sellerFundsRecipient?: string,
	buyer?: string,
	tokenContract: string,
	tokenId: string
}

export type AskEvent = {
	id: string,
	time: string,
	eventType: "ASK_CREATED" | "ASK_PRICE_UPDATED" | "ASK_CANCELED" | "ASK_FILLED",
	ask: Ask
}

export type Offer = {
	id?: string,
	offer_live?: boolean,
	offer_amount: string,
	offer_currency: string,
	finder?: string,
	offer_id: string,
	offer_maker: string,
	taker?: string,
	tokenContract: string,
	tokenId: string
}

export type OfferEvent = {
	id: string,
	time: string,
	eventType: "OFFER_CREATED" | "OFFER_PRICE_UPDATED" | "OFFER_CANCELED" | "OFFER_FILLED",
	offer: Offer
}