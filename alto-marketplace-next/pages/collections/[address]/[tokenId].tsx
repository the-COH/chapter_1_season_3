import { useEffect, useState } from "react"
import { GetServerSideProps } from "next"

import { ERC721Token, Offer, TokenModalType } from "../../../types"

import { useActiveAsk, useContractTokenFallback, useTokenMetadata, useTokenRoyalty, useWhitelistedCollection } from "../../../hooks"

import { fetcher, tokenByContractQuery } from "../../../queries"

import { Text } from "../../../styles"
import { TokenPageModal } from "../../../compositions/TokenPageModal"
import { Seo } from "../../../components/Seo"
import { ErrorOrEmptyPrompt } from "../../../components/ErrorOrEmptyPrompt"
import { TokenPageLayout } from "../../../compositions/TokenPageLayout"

interface TokenPageProps {
	nft: ERC721Token | null | undefined,
	contract: string,
	id: string
}

export default function TokenPage({
	nft,
	contract,
	id
}: TokenPageProps) {
	const [ token, setToken ] = useState<ERC721Token | undefined>() // next hydration error

	const { token: fallbackToken, loading } = useContractTokenFallback({
		contract,
		id,
		shouldFetch: !nft
	})
	useEffect(() => setToken(nft || fallbackToken), [ nft, fallbackToken ])

	const { metadataTransform = undefined, name } = useWhitelistedCollection(contract)

	const tokenRoyalty = useTokenRoyalty({
		contract,
		tokenId: id
	})

	const { image, attributes = [], ...metadata } = useTokenMetadata({
		contract,
		uri: token?.uri,
		identifier: id,
		metadataTransform
	})

	const activeAsk = useActiveAsk({ contract, tokenId: id, owner: token?.owner.id })
	const [ selectedOffer, setSelectedOffer ] = useState<Offer | undefined>(undefined)

	const [ modalType, setModalType ] = useState<TokenModalType>(TokenModalType.OFFER)
	const [ modalOpen, setModalOpen ] = useState(false)

	useEffect(() => {
		if (!modalOpen) setSelectedOffer(undefined)
	}, [ modalOpen ])

	if (!nft && !fallbackToken && !token) return (
		<ErrorOrEmptyPrompt>
			<Text>{(loading || (fallbackToken && !token))
				? "Loading..."
				: "An error occurred when fetching token"
			}</Text>
		</ErrorOrEmptyPrompt>
	)

	return (<>
		<Seo
			title={`${nft?.contract?.name || name || token?.contract?.name || contract} | ${token?.identifier || id}`}
			description={metadata?.description || "View, Buy & Sell this NFT on Alto"}
			ogImage={image}
		/>
		<TokenPageModal
			modalOpen={modalOpen}
			setModalOpen={setModalOpen}
			modalType={modalType}
			token={token}
			contract={contract}
			id={id}
			image={image}
			creatorFee={tokenRoyalty}
			activeAsk={activeAsk}
			selectedOffer={selectedOffer}
		/>
		<TokenPageLayout
			{...metadata}
			token={token}
			tokenId={id}
			contract={contract}
			image={image}
			attributes={attributes}
			tokenRoyalty={tokenRoyalty}
			activeAsk={activeAsk}
			setSelectedOffer={setSelectedOffer}
			setModalType={setModalType}
			setModalOpen={setModalOpen}
		/>
	</>)
}

export type NFTProps = {
  address: string
  tokenId: string
}

export interface NFTParamsProps extends GetServerSideProps<NFTProps> {
  params: NFTProps
}

export const getServerSideProps = async ({ params }: NFTParamsProps) => {
  const address = params.address || undefined
  const tokenId = params.tokenId || undefined

  if (!address || !tokenId) return false

  try {
		const data = await fetcher(tokenByContractQuery, { contract: address, identifier: tokenId })

		return {
			props: {
				contract: address,
				id: tokenId,
				nft: (data?.erc721Tokens || [])[0] || null
			}
		}
  } catch (err) {
    return {
      props: {
				nft: null,
        contract: address,
        id: tokenId
      },
    }
  }
}
