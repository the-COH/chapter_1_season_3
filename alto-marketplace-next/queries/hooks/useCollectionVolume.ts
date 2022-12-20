import { useMemo } from "react"
import { convertCurrencyToCanto } from "../../utils"

import { bidAskFetcher } from "../clients"
import { collectionVolumeQuery } from "../CollectionQueries"
import { useGenericQuery } from "./useGenericQuery"

type AskEventVolume = {
	ask_askPrice: string,
	ask_askCurrency: string
}

type OfferEventVolume = {
	offer_amount: string,
	offer_currency: string
}

export function useCollectionVolume({ contract }: { contract: string }) {
	const { data: askAndOfferEvents, ...rest } = useGenericQuery(
		[ collectionVolumeQuery, { contract } ],
		bidAskFetcher
	)

	const volumes = useMemo(() => {
		const time24hrsAgo = Date.now() / 1000 - 24 * 60 * 60
		const { askEvents = [], offerEvents = [] } = askAndOfferEvents || {}

		let vol24hr = 0
		let volTotal = 0

		askEvents.forEach(({ time, ask }: { time: string, ask: AskEventVolume }) => {
			const { ask_askPrice, ask_askCurrency } = ask
			const vol = convertCurrencyToCanto(ask_askPrice, ask_askCurrency)
			volTotal += vol
			if ((parseInt(time) || 0) > time24hrsAgo) {
				vol24hr += vol
			}
		})
		offerEvents.forEach(({ time, offer }: { time: string, offer: OfferEventVolume }) => {
			const { offer_amount, offer_currency } = offer
			const vol = convertCurrencyToCanto(offer_amount, offer_currency)
			volTotal += vol
			if ((parseInt(time) || 0) > time24hrsAgo) {
				vol24hr += vol
			}
		})

		return {
			volTotal,
			vol24hr
		}
	}, [ askAndOfferEvents ])

	return {
		...volumes,
		...rest
	}
}