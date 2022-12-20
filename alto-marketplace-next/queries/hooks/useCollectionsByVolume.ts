import { useMemo } from "react"
import { convertCurrencyToCanto } from "../../utils"

import { ERC721Collection } from "../../types"

import { useGenericQuery } from "./useGenericQuery"
import { bidAskFetcher, fetcher } from "../clients"
import { collectionsByVolumeQuery, filteredCollectionsQuery } from "../CollectionQueries"

type AskEventVolume = {
	ask_askPrice: string,
	ask_askCurrency: string,
	tokenContract: string,
	tokenId: string
}

type OfferEventVolume = {
	offer_amount: string,
	offer_currency: string,
	tokenContract: string,
	tokenId: string
}

type Props = {
	since?: number,
	limit?: number
}

export function useCollectionsByVolume({
	since = 0,
	limit = 10
}: Props = {}) {
	const {
		data: askAndOfferEvents,
		loading: askAndOfferLoading,
		error: askAndOfferError
	} = useGenericQuery(
		[ collectionsByVolumeQuery, { since } ],
		bidAskFetcher
	)

	const { volumes, addresses } = useMemo(() => {
		const obj: { [ address: string ]: number } = {}
		const { askEvents = [], offerEvents = [] } = askAndOfferEvents || {}

		askEvents.forEach(({ ask }: { time: string, ask: AskEventVolume }) => {
			const { ask_askPrice, ask_askCurrency, tokenContract } = ask
			if (!obj.hasOwnProperty(tokenContract)) obj[ tokenContract ] = 0
			obj[ tokenContract ] += convertCurrencyToCanto(ask_askPrice, ask_askCurrency)
		})
		offerEvents.forEach(({ offer }: { time: string, offer: OfferEventVolume }) => {
			const { offer_amount, offer_currency, tokenContract } = offer
			if (!obj.hasOwnProperty(tokenContract)) obj[ tokenContract ] = 0
			obj[ tokenContract ] += convertCurrencyToCanto(offer_amount, offer_currency)
		})

		const temp = Object.entries(obj)
			.sort(([, volume1 ], [, volume2 ]) => volume2 - volume1)
			.slice(0, limit)
		
		return {
			volumes: temp.reduce((tempObj, [ id, volume ]) => {
				tempObj[ id ] = volume
				return tempObj
			}, {} as { [ id: string ]: number }),
			addresses: temp.map(([ id ]) => id)
		}
	}, [ askAndOfferEvents, limit ])

	const {
		data: collectionsData,
		loading: collectionsLoading,
		error: collectionsError
	} = useGenericQuery(
		[ filteredCollectionsQuery, { contracts: addresses } ],
		fetcher
	)

	const sortedCollections = useMemo(() => {
		const collections = (collectionsData?.erc721Contracts || []) as ERC721Collection[]

		if (collections.length !== addresses.length) return collections

		const temp: ERC721Collection[] = []
		addresses.forEach(collectionId => {
			const collection = collections.find(({ id }) => id === collectionId)
			if (collection) temp.push(collection)
		})
		return temp
	}, [ collectionsData, addresses ])

	return {
		collections: sortedCollections,
		volumes,
		loading: askAndOfferLoading || collectionsLoading,
		error: askAndOfferError || collectionsError
	}
}