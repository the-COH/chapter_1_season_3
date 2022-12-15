import { useEffect, useState } from "react"
import { BigNumber } from "ethers"

import { useContractContext } from "../providers"

type Props = {
	contract?: string,
	tokenId?: string
}

export function useTokenRoyalty({ contract = undefined, tokenId = "1" }: Props) {
	const { RoyaltyManager } = useContractContext()

	const [ royalty, setRoyalty ] = useState(0)

	useEffect(() => {
		if (!contract) return setRoyalty(0)

		const getRoyalty = async () => {
			try {
				const { amounts = [] } = await RoyaltyManager.getRoyaltyView(contract, tokenId, 10_000)
				const totalRoyaltyBn = amounts.reduce((amt: BigNumber, bn: BigNumber) => amt.add(bn), BigNumber.from("0"))
				const totalRoyalty = parseInt(totalRoyaltyBn.toString()) / 10_000
				setRoyalty(totalRoyalty)
			} catch(err) {
				console.error("Error while fetching royalty rate:", err)
			}
		}
		getRoyalty()
	}, [ RoyaltyManager, contract, tokenId ])

	return royalty
}