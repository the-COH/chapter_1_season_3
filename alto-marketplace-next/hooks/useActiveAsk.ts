import useSWR from "swr"
import { isSameAddress } from "../utils"

import { Ask } from "../types"

import { useContractContext } from "../providers"

type Props = {
	contract?: string,
	tokenId: string,
	owner?: string
}

export function useActiveAsk({ contract = undefined, tokenId, owner = undefined }: Props): Ask | undefined {
	const { AsksManager } = useContractContext()

	const { data: ask } = useSWR(
		AsksManager && contract
		 	? [ contract, tokenId ]
			: null,
		(address, id) => AsksManager.askForNFT(address, id)
	)

	return (!owner || !ask || !isSameAddress(ask.seller, owner) || !ask.askPrice.gt("0"))
		? undefined
		: {
			ask_live: true,
			ask_askPrice: ask.askPrice.toString(),
			ask_askCurrency: ask.askCurrency,
			ask_seller: ask.seller,
			ask_sellerFundsRecipient: ask.sellerFundsRecipient,
			tokenContract: contract as string,
			tokenId
		}
}