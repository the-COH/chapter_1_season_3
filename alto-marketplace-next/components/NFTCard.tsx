import { ReactNode, useEffect, useMemo } from "react"
import styled from "styled-components"

import { ERC721Token, ERC721Trait } from "../types"

import { useActiveAsk, useTokenMetadata, useWhitelistedCollection } from "../hooks"

import { CenteredFlex, Flex, FlexProps, Text } from "../styles"
import { NFTOwner } from "./NFTOwner"
import { PassLink } from "./PassLink"
import { AmountWithCurrency } from "./CurrencySymbol"
import { useLiveTokenOffers } from "../queries/hooks"

const Container = styled(Flex)`
	width: calc(100vw - 48px);
	overflow: hidden;
	background-color: ${({ theme }) => theme.backgroundColor.primary};
	border: ${({ theme }) => theme.border.thin};
	scroll-snap-align: center;
	filter: drop-shadow(0px 4px 15px rgba(0, 0, 0, 0.25));

	@media(min-width: 576px) {
		max-width: 256px;
	}
	transition: transform 0.25s ease;
	&:hover {
		transform: translate(0px, 3px);
	}
`

const NFTImageContainer = styled(CenteredFlex)`
	width: 100%;
	min-height: 200px;
	aspect-ratio: 1;
	overflow: hidden;
	background-color: rgba(0,0,0,0.3);
	&:hover {
		opacity: 0.8;
	}
`
const NFTImage = styled.img`
	width: 100%;
`

const Content = styled(Flex)`
	border-top: ${({ theme }) => theme.border.thin};
	padding: 12px;
	gap: 16px;
`
const ContentHeader = styled(Flex)`
	font-size: 16px;
	max-width: 100%;
	overflow: hidden;
`
const TokenName = styled(Text).attrs(() => ({
	textOverflow: "ellipsis",
	whiteSpace: "nowrap"
}))`
	max-width: 100%;
	overflow: hidden;
`
const CollectionLink = styled(Text)`
	display: inline-block;
	max-width: 100%;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	text-decoration: underline;
`

const Footer = styled(Flex)`
	padding: 12px;
	border-top: ${({ theme }) => theme.border.thin};
`

type NFTCardProps = FlexProps & {
	nft: ERC721Token,
	collection: ERC721Token[ "contract" ],
	footerContent?: ReactNode | ReactNode[] | JSX.Element,
	traitFilters?: { [ key: string ]: string[] }
	// hoistTraits?: (traits: ERC721Trait[]) => void
}

export function NFTCard({
	nft,
	collection,
	footerContent,
	traitFilters = undefined,
	// hoistTraits,
	...props
}: NFTCardProps) {
	const { uri, identifier, owner } = nft;

	const { metadataTransform = undefined, name } = useWhitelistedCollection(collection?.id)

	const { image, name: metadataName = undefined, attributes = undefined } = useTokenMetadata({
		contract: collection?.id,
		uri,
		identifier,
		metadataTransform
	})

	const activeAsk = useActiveAsk({
		contract: collection?.id,
		tokenId: identifier,
		owner: owner.id
	})

	useEffect(() => {
		if (activeAsk && activeAsk.tokenId !== nft.identifier) return undefined
		
		nft.ask = activeAsk
	}, [ nft, activeAsk ])

	const { activeOffers } = useLiveTokenOffers({
		contract: collection?.id,
		tokenId: identifier
	})
	
	// useEffect(() => {
	// 	if (!hoistTraits) return;

	// 	hoistTraits(attributes || [])
	// }, [ attributes, hoistTraits ])
	
	const shouldHide = useMemo(() => {
		if (!image || !traitFilters) return false
		
		if (!attributes) return true

		for (const [ type, values ] of Object.entries(traitFilters)) {
			const attr = attributes.find(({ trait_type }) => trait_type === type)
			if (!attr || !values.includes(attr.value)) return true
		}
		return false
	}, [ image, attributes, traitFilters ])

	if (shouldHide) return null

	const collectionLink = collection?.id ? `/collections/${collection.id}`: ""
	const tokenLink = collection?.id ? `${collectionLink}/${identifier}`: ""

	return (
		<Container
			column
			{...props}>
			<PassLink href={tokenLink}>
				<NFTImageContainer as="a">
					<NFTImage src={image}/>
				</NFTImageContainer>
			</PassLink>
			<Content column>
				<ContentHeader
					column
					gap={4}>
					<PassLink href={collectionLink}>
						<CollectionLink as="a">
							{name || collection?.name}
						</CollectionLink>
					</PassLink>
					<TokenName as="span">
						{metadataName || isNaN(parseInt(identifier))
							? (metadataName || identifier)
							: `#${parseInt(identifier)}`
						}
					</TokenName>
				</ContentHeader>
				<Flex
					justify="space-between"
					align="flex-end">
					<NFTOwner
						address={owner.id}
						textAlign="left"
						fontSize={14}
					/>
					<Text>{activeOffers.length.toLocaleString()} {activeOffers.length === 1 ? "Offer": "Offers"}</Text>
				</Flex>
			</Content>
			<Footer justify="center">
				{footerContent || (!!activeAsk
					? (
						<Flex>
							<Text>Price:&nbsp;</Text>
							<AmountWithCurrency
								amount={activeAsk.ask_askPrice}
								currency={activeAsk.ask_askCurrency}
							/>
						</Flex>
					)
					: (
						<PassLink href={tokenLink}>
							<Text
								as="a"
								textDecoration="underline">
								VIEW
							</Text>
						</PassLink>
					)
				)}
			</Footer>
		</Container>
	)
}
