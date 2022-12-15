import { useCallback, useMemo, useState } from "react"
import { ASKS_V1_1 } from "../../utils/env-vars"

import { Ask, ERC721Token } from "../../types"

import { useERC721TransferHelperApproval, useZoraV3ModuleApproval } from "../../hooks/contractApproval"

import { Button, Flex, Text } from "../../styles"
import { AskForm } from "./AskForm"
import { ApprovalPrompt } from "../../components/forms"
import { ContractInteractionStatus } from "../../components/ContractInteractionStatus"
import { NFTHeader } from "../../components/NFTHeader"

enum ListNFTStep {
	CHECK_APPROVALS,
	APPROVE_TRANSFER_HELPER,
	APPROVE_ASK_MODULE,
	LISTING_DETAILS,
	CONFIRMATION
}

export type AskWizardProps = {
	token: ERC721Token,
	tokenAddress: string,
	creatorFee?: number,
	onClose?: () => void,
	previewURL?: string,
	cancelButton?: JSX.Element,
	activeAsk?: Ask
}

export function AskWizard({
	token,
	tokenAddress,
	creatorFee = 0,
	onClose,
	previewURL,
	cancelButton,
	activeAsk = undefined
}: AskWizardProps) {
	const {
		approved: asksV1Approved,
		approve: approveAsksV1,
		mutate: mutateAsksV1
	} = useZoraV3ModuleApproval(ASKS_V1_1)
	const {
		approved: transferHelperApproved,
		approve: approveTransferHelper,
		mutate: mutateTransferHelper
	} = useERC721TransferHelperApproval(tokenAddress)

	const [ wizardStep, setWizardStep ] = useState<ListNFTStep>(ListNFTStep.CHECK_APPROVALS)
	const [ txHash, setTxHash ] = useState<string>()
	const [ askState, setAskState ] = useState<{ amount: string, currency: string }>()

	const handleConfirmType = useCallback(() => {
		setWizardStep(
			transferHelperApproved
				? asksV1Approved
					? ListNFTStep.LISTING_DETAILS
					: ListNFTStep.APPROVE_ASK_MODULE
				: ListNFTStep.APPROVE_TRANSFER_HELPER
		)
	}, [ asksV1Approved, transferHelperApproved ])

	const handleOnConfirmation = useCallback((hash: string, amount: string, currency: string) => {
		setTxHash(hash)
		setAskState({ amount, currency })
		setWizardStep(ListNFTStep.CONFIRMATION)
	}, [])

	const content = useMemo(() => {
		switch(wizardStep) {
			case ListNFTStep.CHECK_APPROVALS:
				return (
					<Flex
						column
						gap={12}>
						<Text fontSize={18}>
							Click continue to {activeAsk ? "update this listing": "list this NFT for a fixed price with Alto"}.
							We will check if any approvals are needed before commencing.
						</Text>
						<Button onClick={handleConfirmType}>
							Continue
						</Button>
					</Flex>
				)
			case ListNFTStep.APPROVE_TRANSFER_HELPER:
				return (
					<ApprovalPrompt
						title="Allow Alto to Use Your NFT"
						approvalCopy="You must approve Alto to use your NFT"
						buttonCopy="Approve NFT"
						approved={transferHelperApproved}
						approve={approveTransferHelper}
						mutate={mutateTransferHelper}
						onApproval={() => setWizardStep(ListNFTStep.APPROVE_ASK_MODULE)}
						onBack={() => setWizardStep(ListNFTStep.CHECK_APPROVALS)}
					/>
				)
			case ListNFTStep.APPROVE_ASK_MODULE:
				return (
					<ApprovalPrompt
						title="Allow Alto Ask Module to Use Your NFT"
						approvalCopy="To enabled the Buy Now feature, you must approve the Alto Ask Module"
						buttonCopy="Approve Module"
						approved={asksV1Approved}
						approve={approveAsksV1}
						mutate={mutateAsksV1}
						onApproval={() => setWizardStep(ListNFTStep.LISTING_DETAILS)}
						onBack={() => setWizardStep(ListNFTStep.CHECK_APPROVALS)}
					/>
				)
			case ListNFTStep.LISTING_DETAILS:
				return (
					<AskForm
						tokenId={token.identifier}
						tokenAddress={tokenAddress}
						creatorFee={creatorFee}
						onConfirmation={handleOnConfirmation}
						cancelButton={cancelButton}
						updateAsk={activeAsk}
					/>
				)
			case ListNFTStep.CONFIRMATION:
				return txHash && (
					<ContractInteractionStatus
						title="Your NFT will be listed shortly"
						description="Once your transaction has been processed, your NFT will be active in the marketplace. In the meanwhile, you can close this window."
						tokenId={token.identifier}
						tokenAddress={tokenAddress}
						previewURL={previewURL}
						txHash={txHash}
						buttonCopy="Got it"
						onConfirm={onClose}
						amount={askState?.amount}
						currency={askState?.currency}
						token={token}
					/>
				)
			default:
				return null
		}
	}, [
		token, tokenAddress, creatorFee, onClose, previewURL, cancelButton, activeAsk,
		asksV1Approved, approveAsksV1, mutateAsksV1,
		transferHelperApproved, approveTransferHelper, mutateTransferHelper,
		wizardStep, txHash, askState,
		handleConfirmType, handleOnConfirmation
	])

	return (
		<Flex
			column
			width="100%"
			gap={24}>
			{wizardStep !== ListNFTStep.CONFIRMATION && (
				<NFTHeader
					token={token}
					previewURL={previewURL}
				/>
			)}
			{content}
		</Flex>
	)
}
