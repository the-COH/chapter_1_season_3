import { useMemo } from "react"
import styled, { css } from "styled-components"
import { isSameAddress } from "../../utils"

import { Ask, ERC721Token, ERC721Trait, Offer, TokenModalType } from "../../types"

import { useAuth, useWhitelistedCollection, useWindowWidth } from "../../hooks"
import { useLiveTokenOffers } from "../../queries/hooks"

import { Button, Flex, FullWidthGridContainer, Grid, Text } from "../../styles"
import { BuySection } from "./BuySection"
import { NFTTraits } from "./NFTTraits"
import { OfferTable } from "./OfferTable"
import { TokenActivityTable } from "./TokenActivityTable"
import { DetailBox } from "../../components/DetailBox"
import { PassLink } from "../../components/PassLink"
import { NFTOwner } from "../../components/NFTOwner"
import { AddressLink } from "../../components/AddressLink"
import { TokenSupply } from "../../components/TokenSupply"
import { Tooltip } from "../../components/Tooltip"

const Container = styled(Flex)`
	width: 100%;
	padding: 24px;
	gap: 48px;
	@media(min-width: 768px) {
		padding: 48px;
	}
`

const Content = styled(Grid)`
	width: 100%;
	max-width: 600px;

	@media(min-width: 1024px) {
		max-width: 1200px;
	}
`

const NFTImage = styled.img`
	width: 100%;
	border: ${({ theme }) => theme.border.thin};
	background-color: rgba(255, 255, 255, 0.1);
	${({ src = "" }) => !src && css`aspect-ratio: 1;`}
	@media(min-width: 1024px) {
		grid-column: 1;
		grid-row: 1 / 4;
	}
`
const RightSideDetailContainer = styled(Flex)`
	grid-row: 1 / 4;
`

const TransferButton = styled(Button)`
	gap: 8px;
	& svg {
		fill: ${({ theme }) => theme.accentColor.cream};
	}
`

const DetailsRow = styled(Flex).attrs(() => ({
	align: "center",
	gap: 8
}))`
	height: 32px;
`

type TokenPageLayoutProps = {
	token?: ERC721Token,
	tokenId: string,
	name?: string,
	contract: string,
	image?: string,
	attributes?: ERC721Trait[],
	tokenRoyalty: number,
	activeAsk?: Ask,
	setSelectedOffer: (offer: Offer) => void,
	setModalType: (action: TokenModalType) => void,
	setModalOpen: (open: boolean) => void
}

export function TokenPageLayout({
	token,
	tokenId,
	name: tokenName,
	contract,
	image,
	attributes = [],
	tokenRoyalty,
	activeAsk,
	setSelectedOffer,
	setModalType,
	setModalOpen
}: TokenPageLayoutProps) {
	const { widerThanLarge } = useWindowWidth()
	const { address: connectedAddress = "" } = useAuth()

	const isOwnerConnected = useMemo(() => (
		!!connectedAddress && isSameAddress(connectedAddress, token?.owner.id)
	), [ connectedAddress, token ])

	const { name, supply, royalty = 0 } = useWhitelistedCollection(contract)

	const isAskerConnected = useMemo(() => (
		!!activeAsk && isSameAddress(activeAsk.ask_seller, connectedAddress)
	), [ activeAsk, connectedAddress ])
	
	const { activeOffers } = useLiveTokenOffers({ contract, tokenId })

	const buySection = useMemo(() => (
		<BuySection
			isOwnerConnected={isOwnerConnected}
			activeAsk={activeAsk}
			isAskerConnected={isAskerConnected}
			setModalType={setModalType}
			setModalOpen={setModalOpen}
		/>
	), [ isOwnerConnected, activeAsk, isAskerConnected ])

	const offersSection = useMemo(() => (
		<OfferTable
			offers={activeOffers}
			connectedAddress={connectedAddress}
			isOwnerConnected={isOwnerConnected}
			onOfferSelect={(action: TokenModalType, offer: Offer) => {
				setSelectedOffer(offer)
				setModalType(action)
				setModalOpen(true)
			}}
		/>
	), [ activeOffers, connectedAddress, isOwnerConnected ])

	return (
		<Container column align="center">
			<Content
				columns={widerThanLarge ? "3fr 2fr": "min(100%, 600px)"}
				gap={24}>
				<RightSideDetailContainer
					column
					gap={24}>
					<DetailBox
						justify="space-between"
						innerGap={12}
						body={(<>
							<PassLink href={`/collections/${contract}`}>
								<Text
									as="a"
									fontSize={24}
									textDecoration="underline">
									{name || token?.contract?.name || contract}
								</Text>
							</PassLink>
							<Text fontSize={36}>{tokenName || (token?.identifier ? `#${token.identifier}`: "Unnamed NFT")}</Text>
							<Flex
								justify="space-between"
								align="flex-end">
								<NFTOwner address={token?.owner.id || ""}/>
								{isOwnerConnected && (
									<TransferButton onClick={() => {
										setModalType(TokenModalType.TRANSFER)
										setModalOpen(true)
									}}>
										<svg viewBox="0 0 32 32" width="20" height="20">
											<path d="M 3.59375 5.34375 L 4.03125 7.21875 L 5.96875 16 L 4.03125 24.78125 L 3.59375 26.65625 L 5.375 25.9375 L 27.375 16.9375 L 29.65625 16 L 27.375 15.0625 L 5.375 6.0625 Z M 6.375 8.65625 L 21.90625 15 L 7.78125 15 Z M 7.78125 17 L 21.90625 17 L 6.375 23.34375 Z"/>
										</svg>
										<Text>Transfer</Text>
									</TransferButton>
								)}
							</Flex>
						</>)}
					/>
					{widerThanLarge && buySection}
					{widerThanLarge && offersSection}
				</RightSideDetailContainer>
				<NFTImage src={image}/>
				{!widerThanLarge && buySection}
				{!widerThanLarge && offersSection}
				<NFTTraits traits={attributes}/>
				<DetailBox
					heading="Collection Details"
					innerGap={8}
					body={(<>
						<DetailsRow>
							<Text>Contract:</Text>
							<AddressLink address={contract}/>
						</DetailsRow>
						<DetailsRow>
							<Text>Supply: <TokenSupply supply={supply}/></Text>
						</DetailsRow>
						<DetailsRow>
							<Text>Creator fee (collection): {(100 * royalty).toFixed(1)}%</Text>
							<Tooltip tip="This value represents the general total royalty fee taken on each sale. This may differ from and be overridden by the token-specific fee listed below."/>
						</DetailsRow>
						<DetailsRow>
							<Text>Creator fee (token): {(100 * tokenRoyalty).toFixed(1)}%</Text>
							<Tooltip tip="This value represents the token-specific royalty fee taken on each sale of this token. This overrides the general collection royalty fee listed above."/>
						</DetailsRow>
					</>)}>
				</DetailBox>
				<FullWidthGridContainer>
					<TokenActivityTable
						contract={contract}
						tokenId={token?.identifier}
					/>
				</FullWidthGridContainer>
			</Content>
		</Container>
	)
}