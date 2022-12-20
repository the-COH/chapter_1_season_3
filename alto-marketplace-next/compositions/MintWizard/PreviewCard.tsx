import styled from "styled-components"
import { parseEther } from "ethers/lib/utils"

import { ERC721CollectionOptional, ERC721Token } from "../../types"

import { Flex, Text } from "../../styles"
import { Section, SectionSubheading } from "./FormSection"
import { NFTCard } from "../../components/NFTCard"
import { AmountWithCurrency } from "../../components/CurrencySymbol"

const PreviewSection = styled(Section).attrs(() => ({
	width: "400px",
	shrink: 0
}))`
	align-self: flex-start;
	max-width: calc(100vw - 48px);

	@media(min-width: 1024px) {
		position: sticky;
		top: 100px;
		align-self: auto;
	}
`
const ScaleContainer = styled(Flex).attrs(() => ({
	justify: "flex-start",
	align: "flex-start"
}))`
	transform: none;
	
	@media(min-width: 1024px) {
		transform: scale(1.5625);
		transform-origin: top left;
	}
`

const displayAmount = parseEther("69420").toString()

type PreviewCardProps = {
	name: string,
	ownerAddress: string,
	previewURL: string
}

export function PreviewCard({ name, ownerAddress, previewURL }: PreviewCardProps) {
	return (
		<PreviewSection>
			<Text fontWeight="bolder">Preview</Text>
			<SectionSubheading>What your NFT will look like on Alto</SectionSubheading>
			<ScaleContainer>
				<NFTCard
					nft={{
						id: name,
						identifier: name,
						uri: previewURL,
						owner: {
							id: ownerAddress
						}
					} as ERC721Token}
					collection={{
						id: "",
						name: "Alto Common Collection",
						symbol: "ALTO"
					} as ERC721CollectionOptional}
					footerContent={<AmountWithCurrency amount={displayAmount}/>}
				/>
			</ScaleContainer>
		</PreviewSection>
	)
}