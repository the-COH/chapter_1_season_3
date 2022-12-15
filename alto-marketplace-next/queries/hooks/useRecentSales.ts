import { Contract } from "ethers"
import { useEffect, useState } from "react"
import { ERC721_ABI } from "../../abis"
import { whitelistedCollectionContracts } from "../../constants"
import { ERC721Token } from "../../types"
import { defaultProvider } from "../../utils"
import { DEV } from "../../utils/env-vars"

import { bidAskFetcher } from "../clients"
import { recentSalesQuery } from "../TokenQueries"
import { useGenericQuery } from "./useGenericQuery"

type Sale = {
	id: string,
	timestamp: string,
	price: string,
	currency: string,
	from: {
		id: string
	},
	to: {
		id: string
	},
	token: ERC721Token
}

export function useRecentSales() {
	const [ recentSales, setRecentSales ] = useState<Sale[]>([])
	const [ uriLoading, setUriLoading ] = useState(false)

	const { data, loading, ...rest } = useGenericQuery(
		[ recentSalesQuery, { contracts: whitelistedCollectionContracts } ],
		bidAskFetcher
	)

	useEffect(() => {
		if (!data || !(data.askEvents && data.offerEvents)) return setRecentSales([])

		const temp: Sale[] = [
			...(data.askEvents as any[]),
			...(data.offerEvents as any[])
		]
			.sort((prev, curr) => parseInt(curr.time) - parseInt(prev.time))
			.slice(0, 10)
			.map(event => {
				if (event.ask) return {
					id: event.id,
					timestamp: event.time,
					price: event.ask.ask_askPrice,
					currency: event.ask.ask_askCurrency,
					from: {
						id: event.ask.ask_seller
					},
					to: {
						id: event.ask.buyer
					},
					token: {
						id: `${event.ask.tokenContract}/${parseInt(event.ask.tokenId).toString(16)}`,
						contract: {
							id: event.ask.tokenContract,
							name: ""
						},
						identifier: event.ask.tokenId,
						uri: "",
						owner: {
							id: event.ask.buyer
						}
					}
				}
				else return {
					id: event.id,
					timestamp: event.time,
					price: event.offer.offer_amount,
					currency: event.offer.offer_currency,
					from: {
						id: event.offer.taker
					},
					to: {
						id: event.offer.maker
					},
					token: {
						id: `${event.offer.tokenContract}/${parseInt(event.offer.tokenId).toString(16)}`,
						contract: {
							id: event.offer.tokenContract,
							name: ""
						},
						identifier: event.offer.tokenId,
						uri: "",
						owner: {
							id: event.offer.taker
						}
					}
				}
			})
		
		const fetchURIs = async () => {
			setUriLoading(true)
			try {
				await Promise.all(temp.map(({ token }) => {
					if (!token.contract) return Promise.resolve("")

					const contract = new Contract(token.contract.id, ERC721_ABI, defaultProvider)
					return contract
						.tokenURI(token.identifier)
						.then((uri: string) => token.uri = uri)
				}))
			} catch(err) {
				DEV && console.error(err)
			} finally {
				setRecentSales(temp)
				setUriLoading(false)
			}
		}
		fetchURIs()
	}, [ data ])

	return {
		recentSales,
		loading: loading || uriLoading,
		...rest
	}
}