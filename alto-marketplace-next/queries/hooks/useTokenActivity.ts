import { useMemo } from "react"
import { AddressZero } from "@ethersproject/constants"
import { isSameAddress } from "../../utils"

import { AskEvent, ERC721Transfer, OfferEvent } from "../../types"

import { bidAskFetcher, fetcher } from "../clients"
import { tokenHistoryQuery, tokenTransfersQuery } from "../TokenQueries"
import { useGenericQuery } from "./useGenericQuery"
import { whitelistedCollectionsObject } from "../../constants"

enum TokenActivityEventType {
	ASK_CREATED = "Listed",
	ASK_PRICE_UPDATED = "Price Update",
	ASK_CANCELED = "Delisted",
	ASK_FILLED = "Sale",
	OFFER_FILLED = "Sale",
	TRANSFER = "Transfer",
	MINT = "Mint"
}

type TokenActivity = {
	id: string,
	eventType: TokenActivityEventType,
	time: number,
	seller: string,
	buyer?: string,
	amount?: string,
	currency?: string
}

type Props = {
	contract: string,
	tokenId?: string
}

export function useTokenActivity({ contract, tokenId = undefined }: Props) {
	const {
		data: askEventsAndFilledOffers,
		loading: askEventsAndFilledOffersLoading,
		error: askEventsAndFilledOffersError
	} = useGenericQuery(
		tokenId !== undefined
			? [ tokenHistoryQuery, { contract, tokenId } ]
			: null,
		bidAskFetcher
	)

	const {
		data: tokenTransferData,
		loading: tokenTransferDataLoading,
		error: tokenTransferDataError
	} = useGenericQuery(
		tokenId !== undefined
			? [ tokenTransfersQuery, { contract, tokenId } ]
			: null,
		fetcher
	)

	const sortedActivity = useMemo(() => {
		const { askEvents = [], offerEvents = [] } = askEventsAndFilledOffers || {}
		const { erc721Transfers = [] } = tokenTransferData || {}

		const asksAndOffers = [
			...(askEvents as AskEvent[]).map((askEvent) => ({
				id: askEvent.id,
				eventType: TokenActivityEventType[ askEvent.eventType ],
				time: parseInt(askEvent.time),
				seller: askEvent.ask.ask_seller,
				buyer: askEvent.eventType === "ASK_FILLED"
					? askEvent.ask.buyer
					: "--",
				amount: askEvent.ask.ask_askPrice,
				currency: askEvent.ask.ask_askCurrency
			} as TokenActivity)),
			...(offerEvents as OfferEvent[]).map((offerEvent) => ({
				id: offerEvent.id,
				eventType: TokenActivityEventType.OFFER_FILLED,
				time: parseInt(offerEvent.time),
				seller: offerEvent.offer.taker,
				buyer: offerEvent.offer.offer_maker,
				amount: offerEvent.offer.offer_amount,
				currency: offerEvent.offer.offer_currency
			} as TokenActivity))
		]
		const filteredTransfers = (erc721Transfers as ERC721Transfer[])
			.map((transfer) => ({
				id: transfer.transaction.id,
				eventType: isSameAddress(
						transfer.from.id,
						whitelistedCollectionsObject[ contract.toLowerCase() ]?.mintAddress || AddressZero
					)
					? TokenActivityEventType.MINT
					: TokenActivityEventType.TRANSFER,
				time: parseInt(transfer.timestamp),
				seller: transfer.from.id,
				buyer: transfer.to.id
			} as TokenActivity))
			.filter(({ time }) => !asksAndOffers.find(({ time: askOrOfferTime }) => time === askOrOfferTime))

		const temp = [
			...asksAndOffers,
			...filteredTransfers
		].sort(({ time: timeA }, { time: timeB }) => timeB - timeA)

		return temp
	}, [ askEventsAndFilledOffers, tokenTransferData, contract ])

	return {
		activity: sortedActivity,
		loading: askEventsAndFilledOffersLoading || tokenTransferDataLoading,
		error: askEventsAndFilledOffersError || tokenTransferDataError
	}
}