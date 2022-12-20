import axios from "axios"
import { PINATA_GATEWAY_URL } from "./env-vars"

import { ERC721Metadata } from "../types"

export function fetchMetadata(uri: string, identifier: string): string | Promise<ERC721Metadata> {
	// our gateway
	if (uri.includes(PINATA_GATEWAY_URL)) {
		return axios.get(uri)
			.then(({ data }) => {
				return {
					...data,
					image: data.image.includes(PINATA_GATEWAY_URL)
						? data.image
						: `${PINATA_GATEWAY_URL}/ipfs/${data.image.split("://")[1]}`
				}
			})
	}

	// ipfs uri
	if (uri.indexOf("ipfs://") === 0) {
		const ipfsUri = uri.includes(".json") && !uri.includes(`/${identifier}.json`)
			? uri.split("://")[1].replace(`${identifier}.json`, `/${identifier}.json`)
			: uri.split("://")[1]

		const fetchUrl = `https://ipfs.io/ipfs/${ipfsUri}`

		if ((/\.png|\.jpg|\.jpeg|\.gif/).test(fetchUrl)) return fetchUrl

		return axios.get(fetchUrl)
			.then(({ data }) => ({
				...data,
				image: `https://ipfs.io/ipfs/${(data.imagepath || data.image).split("://")[1]}`
			}))
	}

	// pinata
	if (uri.includes("pinata.cloud")) {
		if ((/\.png|\.jpg|\.jpeg|\.gif/).test(uri)) return uri

		return axios.get(
			uri.includes(".json")
				? uri
				: `https://ipfs.io/ipfs/${uri.split("/ipfs/")[1]}`
			)
			.then(({ data }) => ({
				...data,
				image: data.image.includes("pinata.cloud")
					? data.image
					: fetchMetadata(data.image, identifier)
			}))
	}

	// ipfs nftstorage
	if (uri.includes("nftstorage.link") || uri.includes(".json")) {
		return axios.get(uri).then(({ data }) => data)
	}

	// base64 json
	if (uri.includes("application/json;base64")) {
		const json = JSON.parse(window.atob(uri.split("base64,")[1]))
		if (json && json.image) return {
			...json,
			image: fetchMetadata(json.image, identifier)
		}
	}

	return uri
}

export async function uploadToPinata(image: File, metadata: object) {
	try {
		const body = new FormData()
		body.append("file", image)
		const { data: { IpfsHash } } = await axios.post("/api/pinata/upload-file", body)
		const imageUri = `${PINATA_GATEWAY_URL}/ipfs/${IpfsHash}`

		const jsonBody = JSON.stringify({
			metadata: {
				...metadata,
				image: imageUri
			}
		})
		const { data: { IpfsHash: uri } } = await axios.post("/api/pinata/upload-metadata", jsonBody, {
			headers: { 'Content-Type': 'application/json' }
		})
		return `${PINATA_GATEWAY_URL}/ipfs/${uri}`
	} catch(err) {
		console.error(err)
		return undefined
	}
}