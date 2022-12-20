import { liveTokenOffersQuery } from "../TokenQueries"

import { Offer } from "../../types"
import { bidAskFetcher } from "../clients"
import { useGenericQuery } from "./useGenericQuery"

type LiveTokenOffersProps = {
	contract?: string,
	tokenId: string
}

export function useLiveTokenOffers({ contract, tokenId }: LiveTokenOffersProps) {
	const { data: offersData, ...rest } = useGenericQuery(
		contract
			? [ liveTokenOffersQuery, { contract, identifier: tokenId } ]
			: null,
		bidAskFetcher
	)

	return {
		activeOffers: (offersData?.offers || []) as Offer[],
		...rest
	}
}