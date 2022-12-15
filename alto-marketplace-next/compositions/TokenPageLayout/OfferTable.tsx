import styled from "styled-components"
import { isSameAddress } from "../../utils"

import { Offer, TokenModalType } from "../../types"

import { Button, Flex, Text } from "../../styles"
import { DetailBox, DetailBoxProps, InnerDetail } from "../../components/DetailBox"
import { AddressLink } from "../../components/AddressLink"
import { AmountWithCurrency } from "../../components/CurrencySymbol"

const InnerDetailContainer = styled(InnerDetail)`
	padding: 0px;
	padding-bottom: 24px;
`

const OfferHeader = styled(Flex)`
	width: 100%;
	height: 36px;
	padding: 6px 36px;
	gap: 12px;
	font-size: 12px;
	@media(min-width: 576px) {
		font-size: 16px;
	}
	border-bottom: ${({ theme }) => theme.border.thin};

	& > * {
		width: 33%;
	}
`
const OfferRow = styled(OfferHeader)`
	border-bottom: none;
	height: 50px;
	&:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}
`

type OfferTableProps = DetailBoxProps & {
	offers: Offer[],
	connectedAddress: string,
	isOwnerConnected: boolean,
	onOfferSelect: (action: TokenModalType, offer: Offer) => void
}

export function OfferTable({ offers, connectedAddress, isOwnerConnected, onOfferSelect, ...props }: OfferTableProps) {
	return (
		<DetailBox
			heading="Active Offers"
			{...props}>
			<InnerDetailContainer>
				<Flex
					width="100%"
					column
					align="center">
					{!offers.length
						? <Text style={{ marginTop: "12px" }}>No active offers</Text>
						: (<>
							<OfferHeader align="center">
								<Flex>address</Flex>
								<Flex>amount</Flex>
								<Flex>{" "}</Flex>
							</OfferHeader>
							{offers.map(offer => {
								const isOffererConnected = isSameAddress(connectedAddress, offer.offer_maker)
								const canInteract = isOwnerConnected || isOffererConnected

								return (
									<OfferRow
										key={offer.offer_id}
										align="center">
										<Flex>
											<AddressLink address={offer.offer_maker}/>
										</Flex>
										<Flex align="center">
											<AmountWithCurrency
												amount={offer.offer_amount}
												currency={offer.offer_currency}
											/>
										</Flex>
										<Flex gap={8}>
											{canInteract
												? (<>
													<Button onClick={() => onOfferSelect(
														isOwnerConnected
															? TokenModalType.FILL_OFFER
															: TokenModalType.UPDATE_OFFER,
														offer
													)}>
														{isOwnerConnected ? "Accept": "Update"}
													</Button>
													{isOffererConnected && (
														<Button onClick={() => onOfferSelect(TokenModalType.CANCEL_OFFER, offer)}>
															x
														</Button>
													)}
												</>)
												: <Text>{" "}</Text>
											}
										</Flex>
									</OfferRow>
								)
							})}
						</>)
					}
				</Flex>
			</InnerDetailContainer>
		</DetailBox>
	)
}