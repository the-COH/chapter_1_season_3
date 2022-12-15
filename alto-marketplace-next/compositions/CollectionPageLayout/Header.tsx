import styled, { useTheme } from "styled-components"
import { DISCORD_URL } from "../../utils/env-vars"

import { useTokenRoyalty, useWhitelistedCollection, useWindowWidth } from "../../hooks"

import { Avatar, Flex, Text } from "../../styles"
import { CollectionStats } from "./CollectionStats"
import { AddressLink } from "../../components/AddressLink"
import { BannerHeader } from "../../components/BannerHeader"
import { TokenSupply } from "../../components/TokenSupply"
import { SocialLink, SocialSite } from "../../components/SocialLink"

const Container = styled(Flex)`
	padding: 48px 12px;
	& svg, path {
		fill: ${({ theme }) => theme.accentColor.cream};
	}

	@media(min-width: 768px) {
		padding: 48px;
	}
`
const CreatorContent = styled(Flex)`
	font-size: 12px;
	font-weight: lighter;
	opacity: 0.75;
`
const StatContainer = styled(Flex)`
	font-size: 12px;
	& > *:nth-child(odd) {
		opacity: 0.75;
	}
`

type HeaderProps = {
	collectionName?: string,
	contract: string,
	image?: string,
	floorPrice?: {
		amount: string,
		currency: string,
		convertedAmount: number
	},
	owners: number
}

export function Header({
	collectionName,
	contract,
	image = "",
	floorPrice,
	owners
}: HeaderProps) {
	const theme = useTheme()
	const { widerThanMedium } = useWindowWidth()

	const {
		name = collectionName,
		thumbnail = undefined,
		isWhitelisted,
		supply,
		royalty,
		website,
		twitter,
		discord
	} = useWhitelistedCollection(contract)

	const tokenRoyalty = useTokenRoyalty({ contract: isWhitelisted ? undefined: contract })

	return (
		<Container
			width="100%"
			column
			align={widerThanMedium ? "flex-start": "center"}
			gap={36}>
			<BannerHeader
				text={name?.toUpperCase() || "COLLECTION"}
				spacing={96}
			/>
			<Avatar
				size={200}
				src={thumbnail || image}
				color="rgba(0,0,0,0.3)"
				border={(theme as any).border.thin}
			/>
			<Flex
				width="100%"
				column={!widerThanMedium}
				justify="space-between"
				align={widerThanMedium ? "flex-start": "center"}
				gap={widerThanMedium ? 0: 24}>
				<Flex
					column
					align={widerThanMedium ? "flex-start": "center"}
					gap={12}>
					<Text
						fontSize={20}
						fontWeight="bold">
						{name}
					</Text>
					<CreatorContent>
						<Text>By:&nbsp;</Text>
						<AddressLink address={contract}/>
					</CreatorContent>
				</Flex>
				<StatContainer align="center" gap={12}>
					<Text>Supply: <TokenSupply supply={supply}/></Text>
					<Text fontSize={20}>|</Text>
					<Text>Creator Fee: {((isWhitelisted && royalty ? royalty: tokenRoyalty) * 100).toFixed(1)}%</Text>
					<Text fontSize={20}>|</Text>
					<AddressLink address={contract} explorer/>
				</StatContainer>
				<Flex
					align="center"
					gap={12}>
					{website && (
						<SocialLink
							type={SocialSite.WEBSITE}
							link={website}
						/>
					)}
					{twitter && (
						<SocialLink
							type={SocialSite.TWITTER}
							link={twitter}
						/>
					)}
					<SocialLink
						type={SocialSite.DISCORD}
						link={discord || DISCORD_URL || ""}
					/>
				</Flex>
			</Flex>
			<CollectionStats
				contract={contract}
				floorPrice={floorPrice}
				owners={owners}
			/>
		</Container>
	)
}