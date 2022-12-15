import styled from "styled-components"
import { formatCryptoVal } from "../utils"

import { ERC721Collection } from "../types"

import { useTokenMetadata, useWhitelistedCollection, useWindowWidth } from "../hooks"
import { useLiveCollectionAsks } from "../queries/hooks"

import { Avatar, CenteredFlex, Flex, Grid, Text } from "../styles"
import { PassLink } from "./PassLink"
import { AmountWithCurrency, CurrencySymbol } from "./CurrencySymbol"

const Container = styled(Flex)`
	width: 100%;
	background-color: ${({ theme }) => theme.backgroundColor.primary};
	border: ${({ theme }) => theme.border.thin};
	color: ${({ theme }) => theme.textColor.primary};
	box-shadow: ${({ theme }) => theme.boxShadow.dark};
	overflow: hidden;
	font-size: 14px;
	transition: transform 0.25s ease;
	&:hover {
		transform: translate(3px, 3px);
	}
	@media(min-width: 576px) {
		font-size: 16px;
	}
`

const AvatarContainer = styled(CenteredFlex)`
	border-right: ${({ theme }) => theme.border.thin};
`
const DataContainer = styled(Grid)`
	width: 100%;
	padding: 0 12px;
`

const DataField = styled(Flex).attrs(() => ({
	column: true,
	justify: "center",
	align: "flex-start"
}))`
	height: 100%;
	max-height: 60px;
	text-align: left;
	min-width: 80px;
	gap: 4px;

	@media(min-width: 576px) {
		max-height: 100px;
		&:first-of-type {
			grid-column: 1 / 2;
		}
	}
`

const CollectionName = styled(Text).attrs(() => ({
	textOverflow: "ellipsis"
}))`
	overflow: hidden;
`

type CollectionRowProps = ERC721Collection & {
	volume?: number
}

export function CollectionRow({ id, name, symbol, tokens, volume }: CollectionRowProps) {
	const { widerThanSmall } = useWindowWidth()

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
				align="center">
				<AvatarContainer>
					<Avatar
						src={thumbnail || image}
						size={widerThanSmall ? 100: 60}
						radius="0px"
						color="rgba(0,0,0,0.3)"
					/>
				</AvatarContainer>
				<DataContainer
					columns={"1fr 1fr 1fr"}
					rows={"1fr"}
					gap={widerThanSmall ? 24: 12}>
					<DataField>
						<CollectionName>{whitelistedName || name}</CollectionName>
						{widerThanSmall && <Text as="span" fontSize={11}>({symbol})</Text>}
					</DataField>
					<DataField>
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
					</DataField>
					<DataField>
						{!volume
							? (
								<Flex align="center">
									<Text>--</Text>
									<CurrencySymbol/>
								</Flex>
							)
							: (
								<Flex align="center">
									<Text>
										{!volume
											? "--"
											: formatCryptoVal(volume, 0)
										}
									</Text>
									&nbsp;
									<CurrencySymbol fontSize={10}/>
								</Flex>
							)
						}
					</DataField>
				</DataContainer>
			</Container>
		</PassLink>
	)
}