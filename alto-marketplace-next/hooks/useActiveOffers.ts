import { useMemo } from "react";

import useSWR from "swr";

import { useContractContext } from "../providers";
import { Offer } from "../types";

export function useActiveOffers({ contract, tokenId }: { contract: string, tokenId: string }): Offer | undefined {
	const { OffersManager } = useContractContext()

	const { data: offerIds } = useSWR(
		OffersManager
		 	? [ contract, tokenId ]
			: null,
		(address, id) => OffersManager.offersForNFT(address, id)
	)

	// only returns the first active offer (TODO: once graph updates use query instead for array of offers)
	const { data: activeOffer } = useSWR(
		offerIds && offerIds.length
			? [ contract, tokenId, offerIds[0] ]
			: null,
		(contract, tokenId, id) => OffersManager.offers(contract, tokenId, id)
	)

	return useMemo(() => (activeOffer && activeOffer.amount.gt("0")
		? {
			offer_amount: activeOffer.amount.toString(),
			offer_currency: activeOffer.currency,
			offer_maker: activeOffer.maker,
			offer_id: offerIds[0],
			tokenContract: contract,
			tokenId
		}
		: undefined
	), [ offerIds, activeOffer, contract, tokenId ])
}