import { whitelistedCollectionContracts, whitelistedCollections } from "../../constants";
import { isSameAddress } from "../../utils";

import { ERC721Collection } from "../../types";

import { fetcher } from "../clients";
import { filteredCollectionsQuery } from "../CollectionQueries";
import { useGenericQuery } from "./useGenericQuery";

export function useWhitelistedCollections() {
	const { data, ...rest } = useGenericQuery(
		[ filteredCollectionsQuery, { contracts: whitelistedCollectionContracts } ],
		fetcher
	)

	const fetchedCollections = (data?.erc721Contracts || []) as ERC721Collection[]

	return {
		collections: whitelistedCollections.reduce((arr, { contract, supply, traits, website, metadataTransform }) => {
			const collection = fetchedCollections.find(({ id }) => isSameAddress(id, contract))
			if (collection) {
				Object.assign(collection, {
					supply,
					traits,
					website,
					metadataTransform
				})
				arr.push(collection)
			}
			return arr
		}, [] as ERC721Collection[]),
		...rest
	}
}