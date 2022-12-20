import { WhitelistCollection, whitelistedCollectionsObject } from "../constants";

type WhitelistCollectionDetails = WhitelistCollection & {
	isWhitelisted: boolean
}

export function useWhitelistedCollection(contract?: string): WhitelistCollectionDetails {
	if (!contract) return {} as WhitelistCollectionDetails

	const wContract = whitelistedCollectionsObject[ contract.toLowerCase() ]

	if (!wContract) return {} as WhitelistCollectionDetails

	return {
		...wContract,
		isWhitelisted: true
	}
}