import { whitelistedCollectionContracts } from "../../constants"
import { ERC721Transfer } from "../../types"

import { fetcher } from "../clients"
import { recentTokenMintsQuery } from "../TokenQueries"
import { useGenericQuery } from "./useGenericQuery"

export function useRecentMints() {
	const { data, ...rest } = useGenericQuery(
		[ recentTokenMintsQuery, { contracts: whitelistedCollectionContracts } ],
		fetcher
	)

	return {
		recentMints: (data?.erc721Transfers || []) as ERC721Transfer[],
		...rest
	}
}