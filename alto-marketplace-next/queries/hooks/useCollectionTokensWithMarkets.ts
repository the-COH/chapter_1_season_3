import { useMemo, useReducer } from "react"

import { Ask, ERC721Token, QuerySortOptions } from "../../types"

import { useGenericQuery } from "./useGenericQuery"
import { useLiveCollectionAsks } from "./useLiveCollectionAsks"
import { collectionByIdWithTokensQuery, liveCollectionAsksQuery } from "../CollectionQueries"
import { bidAskFetcher, fetcher } from "../clients"

type Props = {
	contract: string,
	sortByTokens?: QuerySortOptions,
	sortByAsks?: QuerySortOptions
}

export function useCollectionTokensWithMarkets({
	contract,
	sortByTokens = undefined,
	sortByAsks = undefined
}: Props) {
	const [ limit, loadMore ] = useReducer(l => l + 1_000, 10_000)

	const { data, loading, ...rest } = useGenericQuery(
		[ collectionByIdWithTokensQuery, { contract, first: limit, ...(sortByTokens || { orderBy: "identifier", orderDirection: "asc" }) } ],
		fetcher
	)

	const collection = data?.erc721Contract || undefined
	const tokens = (collection?.tokens || []) as ERC721Token[]

	const { asks, floorPrice } = useLiveCollectionAsks({ contract })
	const market = useGenericQuery(
		[ liveCollectionAsksQuery, { contract, ...(sortByAsks || { orderBy: "id", orderDirection: "asc" }) } ],
		bidAskFetcher
	)

	const tokensWithMarkets = useMemo(() => {
		const temp = [ ...tokens ]

		asks?.forEach((ask: Ask) => {
			const token = temp.find(({ identifier }) => identifier === ask.tokenId)
			if (token) token.ask = ask
		})

		return temp
	}, [ tokens, asks ])

	const owners = useMemo(() => {
		const ownerObj = tokens.reduce((obj, { owner }) => {
			if (!obj[ owner.id ]) obj[ owner.id ] = 1
			else obj[ owner.id ] += 1
			return obj
		}, {} as { [ ownerAddress: string ]: number })
		return Object.keys(ownerObj).length
	}, [ tokens ])

	return {
		collection,
		tokensWithMarkets,
		floorPrice,
		owners,
		loading,
		...rest,
		market,
		loadMore: loading || tokens.length >= limit ? loadMore: undefined
	}
}