import { useCallback, useMemo, useState } from "react"
import { AddressZero } from "@ethersproject/constants"
import { OFFERS_V1 } from "../../utils/env-vars"

import { ERC721Token, Offer } from "../../types"

import { useAuth, useContractTransaction } from "../../hooks"
import { useERC721TransferHelperApproval, useZoraV3ModuleApproval } from "../../hooks/contractApproval"

import { useContractContext } from "../../providers"

import { Button, Flex, Text } from "../../styles"
import { ApprovalPrompt } from "../../components/forms"
import { ErrorDetail } from "../../components/ErrorDetail"
import { ContractInteractionStatus } from "../../components/ContractInteractionStatus"
import { TransactionSubmitButton } from "../../components/TransactionSubmitButton"
import { NFTHeader } from "../../components/NFTHeader"
import { AmountWithCurrency, PercentageOfAmountWithCurrency } from "../../components/CurrencySymbol"

export type OfferFillWizardProps = {
	token: ERC721Token,
	tokenAddress: string,
	offer: Offer,
	previewURL?: string,
	onClose?: () => void,
	cancelButton?: JSX.Element,
	creatorFee?: number
}

enum FillStep {
	CHECK_APPROVALS,
	APPROVE_OFFER_MODULE,
	APPROVE_TRANSFER_HELPER,
	REVIEW_DETAILS,
	CONFIRMATION
}

export function OfferFillWizard({
	token,
	tokenAddress,
	offer,
	previewURL,
	onClose,
	cancelButton,
	creatorFee = 0
}: OfferFillWizardProps) {
	const { address } = useAuth()
	const { OffersManager } = useContractContext()
	const { tx, txStatus, handleTx, txInProgress } = useContractTransaction()
	const {
		approved: offersV1Approved,
		approve: approveOffersV1,
		mutate: mutateOffersV1
	} = useZoraV3ModuleApproval(OFFERS_V1)
	const { approved, approve, mutate } = useERC721TransferHelperApproval(tokenAddress)

	const [ wizardStep, setWizardStep ] = useState<FillStep>(FillStep.CHECK_APPROVALS)
	const [ error, setError ] = useState<string>()

	const handleConfirmType = useCallback(async () => {
		setWizardStep(
			approved
				? offersV1Approved
					? FillStep.REVIEW_DETAILS
					: FillStep.APPROVE_OFFER_MODULE
				: FillStep.APPROVE_TRANSFER_HELPER
		)
	}, [ approved, offersV1Approved ])

	const handleOfferFill = useCallback(async () => {
		try {
			if (!OffersManager || !address) {
				throw new Error(`OfferContract is not ready, please try again.`)
			}
			
			const args: any[] = [
				tokenAddress,         // _tokenContract
				token.identifier,     // _tokenId
				offer.offer_id,       // _offerId
				offer.offer_currency, // _currency
				offer.offer_amount,   // _amount
				offer.finder || AddressZero // _finder
			]
			console.log("fillOffer:", args)
			const promise = OffersManager.fillOffer(...args)
			await handleTx(promise)
			setWizardStep(FillStep.CONFIRMATION)
		} catch (err: any) {
			console.error(err)
			setError(err.message || "There's been an error, please try again.")
		}
	}, [ OffersManager, address, offer, handleTx, token, tokenAddress ])

	const content = useMemo(() => {
		switch(wizardStep) {
			case FillStep.CHECK_APPROVALS:
				return (
					<Flex
						column
						gap={12}>
						<Text fontSize={18}>
							Click continue to proceed with selling this NFT.
							We will check if any approvals are needed before commencing.
						</Text>
						<Button onClick={handleConfirmType}>
							Continue
						</Button>
					</Flex>
				)
			case FillStep.APPROVE_TRANSFER_HELPER:
				return (
					<ApprovalPrompt
						title="Allow Alto to send your NFT to the buyer"
						approvalCopy="You must approve Alto to use your tokens"
						buttonCopy="Approve NFT"
						approved={approved}
						approve={approve}
						mutate={mutate}
						onApproval={() => setWizardStep(FillStep.APPROVE_OFFER_MODULE)}
						onBack={() => setWizardStep(FillStep.CHECK_APPROVALS)}
					/>
				)
			case FillStep.APPROVE_OFFER_MODULE:
				return (
					<ApprovalPrompt
						title="Allow the Alto Offer Module to transfer your tokens"
						approvalCopy="You must approve Alto to use your token"
						buttonCopy="Approve Module"
						approved={offersV1Approved}
						approve={approveOffersV1}
						mutate={mutateOffersV1}
						onApproval={() => setWizardStep(FillStep.REVIEW_DETAILS)}
						onBack={() => setWizardStep(FillStep.CHECK_APPROVALS)}
					/>
				)
			case FillStep.REVIEW_DETAILS:
			case FillStep.CONFIRMATION:
				return !tx
					? (
						<Flex gap={12}>
							{cancelButton}
							<TransactionSubmitButton
								txInProgress={txInProgress}
								txStatus={txStatus}
								onClick={handleOfferFill}>
								Sell NFT
							</TransactionSubmitButton>
						</Flex>
					)
					: (
						<ContractInteractionStatus
							title="Your sale will be confirmed shortly"
							previewURL={previewURL}
							txHash={tx.hash}
							amount={offer.offer_amount}
							currency={offer.offer_currency}
							token={token}
							onConfirm={onClose}
						/>
					)
		}
	}, [
		wizardStep, token, tokenAddress, onClose, previewURL, cancelButton, offer,
		approved, approve, mutate,
		offersV1Approved, approveOffersV1, mutateOffersV1,
		tx, txInProgress, txStatus,
		handleConfirmType, handleOfferFill
	])

	return (
		<Flex
			column
			width="100%"
			gap={32}>
			{wizardStep !== FillStep.CONFIRMATION && (
				<NFTHeader
					token={token}
					previewURL={previewURL}
				/>
			)}
			{error && <ErrorDetail error={error}/>}
			<Flex
				justify="space-between"
				align="center">
				<Text>Sale Price:</Text>
				<AmountWithCurrency
					amount={offer.offer_amount}
					currency={offer.offer_currency}
				/>
			</Flex>
			<Flex
				justify="space-between"
				align="center">
				<Text>Creator Fee ({(creatorFee * 100).toFixed(1)}%):</Text>
				<PercentageOfAmountWithCurrency
					percentage={creatorFee}
					amount={offer.offer_amount}
					currency={offer.offer_currency}
				/>
			</Flex>
			{content}
		</Flex>
	)
}
