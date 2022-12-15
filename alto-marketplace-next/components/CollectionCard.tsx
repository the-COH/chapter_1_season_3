import styled, { useTheme } from "styled-components"

import { ERC721Collection } from "../types"

import { useTokenMetadata, useWhitelistedCollection } from "../hooks"
import { useLiveCollectionAsks } from "../queries/hooks"

import { Avatar, Flex, Text } from "../styles"
import { PassLink } from "./PassLink"
import { AmountWithCurrency, CurrencySymbol } from "./CurrencySymbol"

const Container = styled(Flex)`
	width: calc(100vw - 48px);
	aspect-ratio: 1;
	position: relative;
	border: ${({ theme }) => theme.border.thin};
	scroll-snap-align: center;
	filter: drop-shadow(0px 4px 15px rgba(0, 0, 0, 0.25));

	background: linear-gradient(transparent 0%, transparent 50%, rgba(0,0,0,0.5) 100%);

	@media(min-width: 576px) {
		width: 360px;
		height: 360px;
	}
	transition: transform 0.25s ease;
	&:hover {
		transform: translate(0px, 3px);
	}

	z-index: 1;
`
const Thumbnail = styled(Avatar)`
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: -1;
`

const TextContainer = styled(Flex)`
	width: 100%;
	height: 100%;
	padding: 16px;
	background: linear-gradient(transparent 0%, transparent 60%, black 100%);
`

type CollectionCardProps = {
	collection: ERC721Collection
}

export function CollectionCard({ collection }: CollectionCardProps) {
	const theme = useTheme()

	const { id, name, symbol, tokens } = collection

	const {
		metadataTransform = undefined,
		thumbnail = undefined,
		name: whitelistedName = undefined
	} = useWhitelistedCollection(id)

	const { uri = undefined, identifier = undefined } = tokens[0]
	const { image } = useTokenMetadata(
		!thumbnail
			? {
				contract: id,
				uri,
				identifier,
				metadataTransform
			}
			: undefined
	)

	const { floorPrice } = useLiveCollectionAsks({ contract: id })

	return (
		<PassLink href={`/collections/${id}`}>
			<Container
				as="a"
				column
				justify="flex-end"
				gap={12}>
				<Thumbnail
					src={thumbnail || image}
					radius="0px"
					color="rgba(0,0,0,0.3)"
				/>
				<TextContainer
					column
					justify="flex-end"
					gap={12}>
					<Flex
						align="center"
						gap={8}>
						<Text
							fontSize={16}
							fontWeight="bolder">
							{whitelistedName || name}
						</Text>
						<Text
							fontSize={12}
							color={(theme as any).textColor.secondary}>
							({symbol})
						</Text>
					</Flex>
					<Flex
						align="center"
						gap={12}>
						<Text
							fontSize={14}
							fontWeight="lighter"
							color={(theme as any).textColor.secondary}>
							Floor Price:
						</Text>
						{!floorPrice || floorPrice.convertedAmount === 0
							? (
								<Flex align="center">
									<Text>--</Text>
									<CurrencySymbol/>
								</Flex>
							)
							: (
								<AmountWithCurrency
									amount={floorPrice.amount}
									currency={floorPrice.currency}
								/>
							)
						}
					</Flex>
				</TextContainer>
			</Container>
		</PassLink>
	)
}