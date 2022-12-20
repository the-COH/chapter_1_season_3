import styled from "styled-components"

import { ERC721Token } from "../types"

import { Flex } from "../styles"
import { NFTCard } from "./NFTCard"

const Container = styled(Flex)`
	max-width: 100%;
`

type NFTGalleryProps = {
	tokens: ERC721Token[],
	traitFilters?: { [ key: string ]: string[] }
}

export function NFTGallery({ tokens = [], traitFilters = undefined, ...props }: NFTGalleryProps) {
	return (
		<Container
			flexWrap
			justify="center"
			gap={24}>
			{tokens.map((token) => (
				<NFTCard
					key={token.identifier}
					nft={token}
					collection={token.contract}
					// hoistTraits={(traits) => ((token as any).traits = traits)}
					traitFilters={traitFilters}
				/>
			))}
		</Container>
	)
}