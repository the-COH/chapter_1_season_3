import { useConnectModal } from "@rainbow-me/rainbowkit"

import { Ask, TokenModalType } from "../../types"

import { CTAButton, Flex, Text } from "../../styles"
import { DetailBox, DetailBoxProps, InnerDetail } from "../../components/DetailBox"
import { AmountWithCurrency } from "../../components/CurrencySymbol"

type BuySectionProps = DetailBoxProps & {
	isOwnerConnected: boolean,
	activeAsk?: Ask,
	isAskerConnected: boolean,
	setModalType: (action: TokenModalType) => void,
	setModalOpen: (open: boolean) => void
}

export function BuySection({ isOwnerConnected, activeAsk, isAskerConnected, setModalType, setModalOpen }: BuySectionProps) {
	const { openConnectModal } = useConnectModal()

	return (
		<DetailBox
			column
			heading="Buy or Sell">
			{/* <InnerDetail column>
				<Text>Active Auction section</Text>
			</InnerDetail> */}
			<InnerDetail column>
				{activeAsk && (
					<Flex>
						<Text>Current Ask:&nbsp;</Text>
						<AmountWithCurrency
							amount={activeAsk.ask_askPrice}
							currency={activeAsk.ask_askCurrency}
						/>
					</Flex>
				)}
				{isOwnerConnected
					? (
						<Flex gap={12}>
							<CTAButton onClick={() => {
								setModalType(isAskerConnected ? TokenModalType.UPDATE_ASK: TokenModalType.ASK)
								setModalOpen(true)
							}}>
								{!isAskerConnected ? "List Token": "Update Listing"}
							</CTAButton>
							{isAskerConnected && (
								<CTAButton onClick={() => {
									setModalType(TokenModalType.CANCEL_ASK)
									setModalOpen(true)
								}}>
									Cancel Listing
								</CTAButton>
							)}
						</Flex>
					)
					: (
						<Flex gap={12}>
							<CTAButton onClick={() => {
								if (openConnectModal) return openConnectModal()
								setModalType(TokenModalType.OFFER)
								setModalOpen(true)
							}}>
								Offer
							</CTAButton>
							{!!activeAsk && (
								<CTAButton onClick={() => {
									if (openConnectModal) return openConnectModal()
									setModalType(TokenModalType.FILL_ASK)
									setModalOpen(true)
								}}>
									Buy Now
								</CTAButton>
							)}
						</Flex>
					)
				}
			</InnerDetail>
		</DetailBox>
	)
}