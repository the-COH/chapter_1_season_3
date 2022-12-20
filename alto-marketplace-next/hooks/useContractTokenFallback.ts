import { useEffect, useMemo, useState } from "react"
import { Contract } from "ethers"
import { defaultProvider } from "../utils"
import { ERC721_ABI } from "../abis"
import { ERC721Token } from "../types"

type Props = {
	contract: string,
	id: string,
	shouldFetch?: boolean
}

export function useContractTokenFallback({ contract, id, shouldFetch = true }: Props) {
	const [ token, setToken ] = useState<ERC721Token | undefined>()
	const [ loading, setLoading ] = useState(false)

	const tokenContract = useMemo(() => (
		new Contract(contract, ERC721_ABI, defaultProvider)
	), [ contract ])

	useEffect(() => {
		if (!shouldFetch || !tokenContract) return setToken(undefined)

		setLoading(true)
		const fetchTokenURI = async () => {
			try {
				const [ uri, owner ] = await Promise.all([
					tokenContract.tokenURI(id),
					tokenContract.ownerOf(id)
				])

				setToken({
					id: `${contract}/${(parseInt(id) || 0).toString(16)}`,
					identifier: id,
					uri,
					owner: { id: owner || "" },
					contract: {
						id: contract,
						name: "???"
					}
				})
			} catch(_) {
				setToken(undefined)
			} finally {
				setLoading(false)
			}
		}
		fetchTokenURI()
	}, [ tokenContract, id, shouldFetch ])

	return { token, loading }
}