import { useEffect, useState } from "react"
import { Contract } from "ethers"
import { defaultProvider, fetchMetadata } from "../utils"
import { ERC721Metadata } from "../types"
import { ERC721_ABI } from "../abis"
import { DEV } from "../utils/env-vars"

type Props = {
	contract?: string,
	uri?: string,
	identifier?: string,
	metadataTransform?: (uri: string, identifier: string) => string
}

export function useTokenMetadata({ contract = "", uri = "", identifier = "", metadataTransform }: Props = {}) {
	const [ metadata, setMetadata ] = useState<ERC721Metadata>({ image: "" })

	useEffect(() => {
		const getMetadata = async () => {
			try {
				let transformedUri = metadataTransform
					? metadataTransform(uri, identifier)
					: uri

				if (!transformedUri) {
					setMetadata({ image: "" })
					return
				}

				if (transformedUri.includes("data:application/json;base64") && contract) {
					const tokenContract = new Contract(contract, ERC721_ABI, defaultProvider)
					if (tokenContract) {
						transformedUri = await tokenContract.tokenURI(identifier)
					}
				}

				const obj = await fetchMetadata(transformedUri, identifier)
				// DEV && console.log(uri, obj)
				if (typeof obj === "string") setMetadata({ image: obj })
				else setMetadata(obj)
			} catch(err) {
				DEV && console.log(uri, identifier)
				console.error(err)
			}
		}
		getMetadata()
	}, [ contract, uri, identifier, metadataTransform ])

	return metadata
}