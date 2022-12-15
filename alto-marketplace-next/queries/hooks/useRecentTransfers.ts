import { whitelistedCollectionContracts } from "../../constants"
import { ERC721Transfer } from "../../types"

import { fetcher } from "../clients"
import { recentTokenTransfersQuery } from "../TokenQueries"
import { useGenericQuery } from "./useGenericQuery"

export function useRecentTransfers() {
	const { data, ...rest } = useGenericQuery(
		[ recentTokenTransfersQuery, { contracts: whitelistedCollectionContracts } ],
		fetcher
	)

	return {
		recentTransfers: (data?.erc721Transfers || []) as ERC721Transfer[],
		...rest
	}
}