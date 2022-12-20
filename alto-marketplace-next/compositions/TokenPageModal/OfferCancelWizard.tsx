import { useCallback, useState } from "react"
import { ContractTransaction } from "ethers"
import { formatCryptoVal } from "../../utils"

import { ERC721Token, Offer } from "../../types"

import { useAuth, useContractTransaction } from "../../hooks"

import { useContractContext } from "../../providers"

import { Flex, Text } from "../../styles"
import { NFTHeader } from "../../components/NFTHeader"
import { ErrorDetail } from "../../components/ErrorDetail"
import { TransactionSubmitButton } from "../../components/TransactionSubmitButton"
import { ContractInteractionStatus } from "../../components/ContractInteractionStatus"

interface OfferCancelWizardProps {
	tokenAddress: string,
	tokenId: string,
	token: ERC721Token,
	offer: Offer,
	previewURL?: string,
	onClose: () => void
}

enum FillStep {
	REVIEW_DETAILS,
	CONFIRMATION
}

export function OfferCancelWizard({ token, tokenAddress, tokenId, offer, previewURL, onClose }: OfferCancelWizardProps) {
	const { address } = useAuth()
	const [ error, setError ] = useState<string>()
	const { OffersManager } = useContractContext()
	const { tx, txStatus, handleTx, txInProgress } = useContractTransaction()

	const [ wizardStep, setWizardStep ] = useState<FillStep>(FillStep.REVIEW_DETAILS)

	const handleCancel = useCallback(async () => {
		try {
			if (!address || !OffersManager) {
				throw new Error("OffersContract is not ready, please try again.")
			}

			console.log("cancelOffer:", [ tokenAddress, tokenId, offer.offer_id ])
			const promise: Promise<ContractTransaction> = OffersManager.cancelOffer(
				tokenAddress,
				tokenId,
				offer.offer_id
			)
			await handleTx(promise)
			setWizardStep(FillStep.CONFIRMATION)
		} catch (err: any) {
			console.error(err)
			setError(err?.message || "There's been an error, please try again.")
		}
	}, [ OffersManager, address, handleTx, tokenAddress, tokenId, offer ])

	return (
		<Flex
			column
			gap={32}>
			<NFTHeader
				token={token}
				previewURL={previewURL}
			/>
			{wizardStep === FillStep.CONFIRMATION && tx
				? (
					<ContractInteractionStatus
						title="Your cancellation will be confirmed shortly"
						previewURL={previewURL}
						txHash={tx.hash}
						onConfirm={onClose}
					/>
				)
				: (<>
					<Text>Current Offer: {formatCryptoVal(offer.offer_amount)}</Text>
					{error && <ErrorDetail error={error}/>}
					<TransactionSubmitButton
						txInProgress={txInProgress}
						txStatus={txStatus}
						onClick={handleCancel}>
						Cancel Offer
					</TransactionSubmitButton>
				</>)
			}
		</Flex>
	)
}