import { ERC721Token, QuerySortOptions } from "../../types"

import { fetcher } from "../clients"
import { tokensByOwnerQuery } from "../TokenQueries"
import { useGenericQuery } from "./useGenericQuery"

type Props = {
	ownerAddress: string,
	sortByTokens?: QuerySortOptions,
	sortByAsks?: QuerySortOptions
}

export function useTokensByOwner({ ownerAddress, sortByTokens, sortByAsks }: Props) {
	const { data, ...rest } = useGenericQuery(
		!!ownerAddress ? [ tokensByOwnerQuery, { id: ownerAddress, first: 10_000, ...(sortByTokens || { orderBy: "identifier", orderDirection: "asc" }) } ]: null,
		fetcher
	)

	const tokens = (data?.erc721Tokens || []) as ERC721Token[]

	return {
		tokens,
		...rest
	}
}