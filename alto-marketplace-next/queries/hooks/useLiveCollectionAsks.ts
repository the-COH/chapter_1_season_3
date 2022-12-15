import { useMemo } from "react"

import { defaultCurrency } from "../../constants"
import { Ask } from "../../types"

import { bidAskFetcher } from "../clients"
import { useGenericQuery } from "./useGenericQuery"
import { liveCollectionAsksQuery } from "../CollectionQueries"
import { convertCurrencyToCanto } from "../../utils"

export function useLiveCollectionAsks({ contract }: { contract: string }) {
	const { data, ...rest } = useGenericQuery(
		[ liveCollectionAsksQuery, { contract } ],
		bidAskFetcher
	)

	const floorPrice = useMemo(() => {
		if (!data?.asks || !data.asks.length) return undefined

		return (data.asks as Ask[]).reduce((min, { ask_askPrice, ask_askCurrency }) => {
			const convertedAmount = convertCurrencyToCanto(ask_askPrice, ask_askCurrency) || Infinity
			return (min.convertedAmount === 0 || convertedAmount < min.convertedAmount)
				? {
					amount: ask_askPrice,
					currency: ask_askCurrency,
					convertedAmount
				}
				: min
		}, { amount: "0", currency: defaultCurrency.id, convertedAmount: 0 })
	}, [ data ])

	return {
		asks: (data?.asks || []) as Ask[],
		floorPrice,
		...rest
	}
}