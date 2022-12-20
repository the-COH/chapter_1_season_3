import { useCallback, useMemo, useState } from "react"
import { ContractTransaction } from "ethers"
import { parseEther } from "ethers/lib/utils"
import { AddressZero } from "@ethersproject/constants"
import { useBalance } from "wagmi"
import { OFFERS_V1 } from "../../utils/env-vars"
import { isSameAddress } from "../../utils"
import { defaultCurrency } from "../../constants"

import { Ask, ERC721Token, Offer } from "../../types"

import { useAuth, useContractTransaction } from "../../hooks"
import { useERC20TransferHelperApproval, useZoraV3ModuleApproval } from "../../hooks/contractApproval"
import { useContractContext } from "../../providers"

import { Button, Flex, Text } from "../../styles"
import { OfferForm } from "./OfferForm"
import { ApprovalPrompt } from "../../components/forms"
import { ContractInteractionStatus } from "../../components/ContractInteractionStatus"
import { NFTHeader } from "../../components/NFTHeader"
import { TransactionSubmitButton } from "../../components/TransactionSubmitButton"
import { ErrorDetail } from "../../components/ErrorDetail"
import { AmountWithCurrency } from "../../components/CurrencySymbol"

enum MakeOfferStep {
	OFFER_DETAILS,
	APPROVE_ALLOWANCE,
	APPROVE_OFFER_MODULE,
	SUBMIT_OFFER,
	CONFIRMATION
}

export type OfferWizardProps = {
	token: ERC721Token,
	tokenAddress: string,
	onClose?: () => void,
	previewURL?: string,
	cancelButton?: JSX.Element,
	offerCurrency?: string,
	activeAsk?: Ask,
	activeOffer?: Offer
}

export function OfferWizard({
	token,
	tokenAddress,
	onClose,
	previewURL,
	cancelButton,
	offerCurrency = defaultCurrency.id,
	activeAsk = undefined,
	activeOffer = undefined
}: OfferWizardProps) {
	const { address } = useAuth()
	const { OffersManager } = useContractContext()

	const [ offerDetails, setOfferDetails ] = useState<{ amount: string, currency: string }>({
		amount: "0",
		currency: activeOffer?.offer_currency || offerCurrency
	})

	const { data: walletBalance } = useBalance({
		addressOrName: address,
		token: !isSameAddress(offerDetails.currency, AddressZero)
			? offerDetails.currency
			: undefined
	})

	const sufficientFunds = useMemo(() => (
		walletBalance?.value.gte(offerDetails.amount)
	), [ offerDetails.amount, walletBalance ])

	const {
		approved: offersV1Approved,
		approve: approveOffersV1,
		mutate: mutateOffersV1
	} = useZoraV3ModuleApproval(OFFERS_V1)
	const {
		allowance,
		approve: approveTransferHelper,
		mutate: mutateTransferHelper
	} = useERC20TransferHelperApproval({
		contractAddress: activeOffer?.offer_currency || offerDetails.currency,
		amount: offerDetails.amount
	})

	const { txStatus, handleTx, txInProgress } = useContractTransaction()

	const [ wizardStep, setWizardStep ] = useState<MakeOfferStep>(MakeOfferStep.OFFER_DETAILS)
	const [ txHash, setTxHash ] = useState<string>()
	const [ error, setError ] = useState<string>()

	const handleConfirmAmount = useCallback(() => {
		setWizardStep(
			offersV1Approved
				? allowance && allowance.gte(offerDetails.amount)
					? MakeOfferStep.SUBMIT_OFFER
					: MakeOfferStep.APPROVE_ALLOWANCE
				: MakeOfferStep.APPROVE_OFFER_MODULE
		)
	}, [ offersV1Approved, allowance, offerDetails.amount ])

	const handleOnConfirmation = useCallback(async () => {
		try {
      if (!address || !OffersManager) {
        throw new Error("OfferContract is not ready, please try again.")
      }
			
			const executeOffer = (): Promise<ContractTransaction> => {
				if (activeOffer) {
					const args: any[] = [
						tokenAddress,               // _tokenContract
						token.identifier,           // _tokenId
						activeOffer.offer_id,       // _offerId
						activeOffer.offer_currency, // _currency
						offerDetails.amount         // _amount
					]
					console.log("setOfferAmount:", args)
					return OffersManager.setOfferAmount(...args)
				}

				const args: any[] = [
					tokenAddress,            // _tokenContract
					token.identifier,        // _tokenId
					offerDetails.currency,   // _currency
					offerDetails.amount,     // _amount
					0, // findersFeeBps * 100,    // _findersFeeBps
				]
				if (isSameAddress(offerDetails.currency, AddressZero)) {
					args.push({ value: offerDetails.amount })
				}
				console.log("createOffer:", args)
				return OffersManager.createOffer(...args)
			}
			const promise = executeOffer()
      const tx = await handleTx(promise)
			setTxHash(tx.hash)
			setWizardStep(MakeOfferStep.CONFIRMATION)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "There's been an error, please try again.")
    }
	}, [ address, OffersManager, activeOffer, tokenAddress, token.identifier, offerDetails, handleTx ])

	const content = useMemo(() => {
		switch(wizardStep) {
			case MakeOfferStep.OFFER_DETAILS:
				return (
					<OfferForm
						offerDetails={offerDetails}
						setOfferDetails={setOfferDetails}
						activeAsk={activeAsk}
						updateFromPreviousAmount={activeOffer ? parseEther(activeOffer.offer_amount).toString(): undefined}
						onSubmit={handleConfirmAmount}
						cancelButton={
							<Button onClick={onClose}>Cancel</Button>
						}
					/>
				)
			case MakeOfferStep.APPROVE_OFFER_MODULE:
				return (
					<ApprovalPrompt
						title="Allow the Alto Offer Module to transfer your tokens"
						approvalCopy="Offered tokens are held in the Offer Module contract until your offer is accepted or canceled"
						buttonCopy="Approve Module"
						approved={offersV1Approved}
						approve={approveOffersV1}
						mutate={mutateOffersV1}
						onApproval={() => setWizardStep(MakeOfferStep.APPROVE_ALLOWANCE)}
						onBack={() => setWizardStep(MakeOfferStep.OFFER_DETAILS)}
					/>
				)
			case MakeOfferStep.APPROVE_ALLOWANCE:
				return (
					<ApprovalPrompt
						title="Allow Alto to spend tokens on your behalf"
						approvalCopy="You must approve Alto to use your tokens"
						buttonCopy="Approve Allowance"
						approved={allowance && allowance.gte(offerDetails.amount)}
						approve={approveTransferHelper}
						mutate={mutateTransferHelper}
						onApproval={() => setWizardStep(MakeOfferStep.SUBMIT_OFFER)}
						onBack={() => setWizardStep(MakeOfferStep.OFFER_DETAILS)}
					/>
				)
			case MakeOfferStep.SUBMIT_OFFER:
				return (
					<Flex
						column
						gap={12}>
						{activeOffer && (
              <Flex justify="space-between">
                <Text>Current Offer Price:</Text>
								<AmountWithCurrency
									amount={activeOffer.offer_amount}
									currency={activeOffer.offer_currency}
								/>
              </Flex>
            )}
						<Flex justify="space-between">
							<Text>{activeOffer ? "New ": ""}Offer Price:</Text>
							<AmountWithCurrency
								amount={offerDetails.amount}
								currency={activeOffer?.offer_currency || offerDetails.currency}
							/>
						</Flex>
						<Text fontSize={18}>
							Click the button below to {activeOffer ? "update this offer": "make an offer on this NFT for a fixed price with Alto"}.
						</Text>
						<TransactionSubmitButton
							disabled={!sufficientFunds}
							txStatus={txStatus}
							txInProgress={txInProgress}
							onClick={handleOnConfirmation}>
							{!sufficientFunds
								? "Insufficient Funds"
								: activeOffer
									? "Update Offer"
									: "Submit Offer"
							}
						</TransactionSubmitButton>
					</Flex>
				)
			case MakeOfferStep.CONFIRMATION:
				return txHash && (
					<ContractInteractionStatus
						title="Your Offer will be registered shortly"
						description="Once your transaction has been processed, your Offer will be active, at which point it can be accepted by the seller. You may cancel your offer at any time. In the meanwhile, you can close this window."
						tokenId={token.identifier}
						tokenAddress={tokenAddress}
						previewURL={previewURL}
						txHash={txHash}
						buttonCopy="Got it"
						onConfirm={onClose}
						amount={offerDetails.amount}
						currency={activeOffer?.offer_currency || offerDetails.currency}
						token={token}
					/>
				)
			default:
				return null
		}
	}, [
		token, tokenAddress, onClose, previewURL, cancelButton, activeAsk, activeOffer, sufficientFunds,
		offersV1Approved, approveOffersV1, mutateOffersV1,
		allowance, approveTransferHelper, mutateTransferHelper,
		wizardStep, txHash, offerDetails.amount, txInProgress, txStatus,
		handleConfirmAmount, handleOnConfirmation
	])

	return (
		<Flex
			column
			width="100%"
			gap={24}>
			{wizardStep !== MakeOfferStep.CONFIRMATION && (
				<NFTHeader
					token={token}
					previewURL={previewURL}
				/>
			)}
			{error && <ErrorDetail error={error}/>}
			{content}
		</Flex>
	)
}
