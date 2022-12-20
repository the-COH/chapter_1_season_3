import { Dispatch, SetStateAction, useMemo } from "react"

import { Ask, ERC721Token, Offer, TokenModalType } from "../../types"

import { Button } from "../../styles"
import { Modal } from "../../components/Modal"
import { AskWizard } from "./AskWizard"
import { AskFillWizard } from "./AskFillWizard"
import { AskCancelWizard } from "./AskCancelWizard"
import { OfferWizard } from "./OfferWizard"
import { OfferFillWizard } from "./OfferFillWizard"
import { OfferCancelWizard } from "./OfferCancelWizard"
import { TokenTransferWizard } from "./TokenTransferWizard"

type TokenPageModalProps = {
	modalOpen: boolean,
	setModalOpen: Dispatch<SetStateAction<boolean>>,
	modalType: TokenModalType,
	token?: ERC721Token,
	contract: string,
	id: string,
	image: string,
	creatorFee?: number,
	activeAsk?: Ask,
	selectedOffer?: Offer
}

export function TokenPageModal({
	modalOpen,
	setModalOpen,
	modalType,
	token,
	contract,
	id,
	image,
	creatorFee = 0,
	activeAsk,
	selectedOffer
}: TokenPageModalProps) {
	const { modalTitle, modalContent } = useMemo(() => {
		switch(modalType) {
			case TokenModalType.UPDATE_ASK:
			case TokenModalType.ASK:
				return {
					modalTitle: modalType === TokenModalType.UPDATE_ASK ? "Update Listing": "List NFT",
					modalContent: (
						<AskWizard
							token={token as ERC721Token}
							tokenAddress={contract as string}
							creatorFee={creatorFee}
							activeAsk={modalType === TokenModalType.UPDATE_ASK ? activeAsk: undefined}
							onClose={() => setModalOpen(false)}
							previewURL={image}
							cancelButton={(
								<Button
									onClick={() => setModalOpen(false)}
									style={{ flexGrow: 1 }}>
									Cancel
								</Button>
							)}
						/>
					)
				}
			case TokenModalType.CANCEL_ASK:
				return {
					modalTitle: "Cancel Listing",
					modalContent: (
						<AskCancelWizard
							token={token as ERC721Token}
							tokenAddress={contract as string}
							tokenId={id}
							previewURL={image}
							askPrice={activeAsk?.ask_askPrice as string}
							onClose={() => setModalOpen(false)}
						/>
					)
				}
			case TokenModalType.FILL_OFFER:
				return {
					modalTitle: "Accept Offer",
					modalContent: (
						<OfferFillWizard
							token={token as ERC721Token}
							tokenAddress={contract as string}
							offer={selectedOffer as Offer}
							creatorFee={creatorFee}
							previewURL={image}
							onClose={() => setModalOpen(false)}
							cancelButton={(
								<Button
									onClick={() => setModalOpen(false)}
									style={{ flexGrow: 1 }}>
									Cancel
								</Button>
							)}
						/>
					)
				}
			case TokenModalType.UPDATE_OFFER:
			case TokenModalType.OFFER:
				return {
					modalTitle: modalType === TokenModalType.UPDATE_OFFER ? "Update Offer": "Create Offer",
					modalContent: (
						<OfferWizard
							token={token as ERC721Token}
							tokenAddress={contract as string}
							activeAsk={activeAsk}
							activeOffer={selectedOffer}
							onClose={() => setModalOpen(false)}
							previewURL={image}
							cancelButton={(
								<Button
									onClick={() => setModalOpen(false)}
									style={{ flexGrow: 1 }}>
									Cancel
								</Button>
							)}
						/>
					)
				}
			case TokenModalType.CANCEL_OFFER:
				return {
					modalTitle: "Cancel Offer",
					modalContent: (
						<OfferCancelWizard
							token={token as ERC721Token}
							tokenAddress={contract as string}
							tokenId={id}
							offer={selectedOffer as Offer}
							previewURL={image}
							onClose={() => setModalOpen(false)}
						/>
					)
				}
			case TokenModalType.FILL_ASK:
				return {
					modalTitle: "Buy Now",
					modalContent: (
						<AskFillWizard
							token={token as ERC721Token}
							tokenAddress={contract as string}
							activeAsk={activeAsk}
							previewURL={image}
							onClose={() => setModalOpen(false)}
							cancelButton={(
								<Button
									onClick={() => setModalOpen(false)}
									style={{ flexGrow: 1 }}>
									Cancel
								</Button>
							)}
						/>
					)
				}
			case TokenModalType.TRANSFER:
				return {
					modalTitle: "Transfer NFT",
					modalContent: (
						<TokenTransferWizard
							token={token as ERC721Token}
							tokenAddress={contract as string}
							tokenId={id}
							previewURL={image}
							activeAsk={activeAsk}
							onClose={() => setModalOpen(false)}
						/>
					)
				}
			default:
				return {}
		}
	}, [ modalType, token, id, contract, image, creatorFee, activeAsk, selectedOffer, setModalOpen ])

	if (!modalOpen) return null

	return (
		<Modal
			title={modalTitle}
			onClose={() => setModalOpen(false)}
			content={modalContent}
		/>
	)
}