import { GraphQLClient } from "graphql-request"
import { GRAPHQL_ENDPOINT } from "../utils/env-vars"

export const cantoNFTClient = new GraphQLClient(`${GRAPHQL_ENDPOINT}/subgraphs/name/canto/nfts_refresh`)
export const fetcher = (query: any, args: any) => cantoNFTClient.request(
	query,
	args,
	// { contenttype: "application/json" }
)

export const cantoBidAskClient = new GraphQLClient(`${GRAPHQL_ENDPOINT}/subgraphs/name/canto/alto`)
export const bidAskFetcher = (query: any, args: any) => cantoBidAskClient.request(
	query,
	args,
	// { contenttype: "application/json" }
)
