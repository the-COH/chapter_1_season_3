import { useCallback, useEffect, useMemo, useState } from "react"
import { BigNumber } from "ethers"
import { parseEther } from "ethers/lib/utils"
import { AddressZero } from "@ethersproject/constants"
import { useBalance } from "wagmi"
import { isSameAddress } from "../../utils"
import { ASKS_V1_1 } from "../../utils/env-vars"
import { defaultCurrency } from "../../constants"

import { Ask, ERC721Token } from "../../types"

import { useAuth, useContractTransaction } from "../../hooks"
import { useERC20TransferHelperApproval, useZoraV3ModuleApproval } from "../../hooks/contractApproval"

import { useContractContext } from "../../providers"

import { Button, Flex, Text } from "../../styles"
import { ApprovalPrompt } from "../../components/forms"
import { ErrorDetail } from "../../components/ErrorDetail"
import { ContractInteractionStatus } from "../../components/ContractInteractionStatus"
import { TransactionSubmitButton } from "../../components/TransactionSubmitButton"
import { NFTHeader } from "../../components/NFTHeader"
import { AmountWithCurrency } from "../../components/CurrencySymbol"

export type AskFillWizardProps = {
	token: ERC721Token,
	tokenAddress: string,
	activeAsk?: Ask,
	previewURL?: string,
	onClose?: () => void,
	cancelButton?: JSX.Element,
}

enum FillStep {
	CHECK_APPROVALS,
	APPROVE_ASK_MODULE,
	APPROVE_ALLOWANCE,
	REVIEW_DETAILS,
	CONFIRMATION
}

const minAllowance = parseEther("1")

export function AskFillWizard({
	token,
	tokenAddress,
	activeAsk,
	previewURL,
	onClose,
	cancelButton,
}: AskFillWizardProps) {
	const { address } = useAuth()
	const { tx, txStatus, handleTx, txInProgress } = useContractTransaction()

	// avoid ask data disappearing once buy transaction processes
	const [ ask, setAsk ] = useState<Ask>()

	useEffect(() => {
		if (tx) return

		setAsk(activeAsk)
	}, [ activeAsk, tx ])

	const {
		ask_askCurrency: askCurrency = defaultCurrency.id,
		ask_askPrice: askPrice = "0"
	} = ask || {}

	const { data: walletBalance } = useBalance({
		addressOrName: address,
		token: isSameAddress(askCurrency, AddressZero) ? undefined: askCurrency
	})

	const { AsksManager } = useContractContext()
	const {
		approved: asksV1Approved,
		approve: approveAsksV1,
		mutate: mutateAsksV1
	} = useZoraV3ModuleApproval(ASKS_V1_1)
	const { allowance, approve, mutate } = useERC20TransferHelperApproval({
		contractAddress: askCurrency,
		amount: BigNumber.from(askPrice).lt(minAllowance)
			? minAllowance.toString()
			: askPrice
	})

	const sufficientFunds = useMemo(() => (
		!activeAsk || walletBalance?.value.gte(askPrice)
	), [ askPrice, walletBalance ])

	const [ wizardStep, setWizardStep ] = useState<FillStep>(FillStep.CHECK_APPROVALS)
	const [ error, setError ] = useState<string>()

	const handleConfirmType = useCallback(async () => {
		setWizardStep(
			asksV1Approved
				? allowance && allowance.gte(askPrice)
					? FillStep.REVIEW_DETAILS
					: FillStep.APPROVE_ALLOWANCE
				: FillStep.APPROVE_ASK_MODULE
		)
	}, [ asksV1Approved, allowance, askPrice ])

	const handleAskFill = useCallback(async () => {
		try {
			if (!AsksManager || !address) {
				throw new Error(`V3AskContract is not ready, please try again.`)
			}
			
			const args: any[] = [
				tokenAddress,     // _tokenContract
				token.identifier, // _tokenId
				askCurrency,      // _fillCurrency
				askPrice,         // _fillAmount
				address           // _finder
			]
			if (isSameAddress(askCurrency, AddressZero)) {
				args.push({ value: askPrice })
			}
			console.log("fillAsk:", args)
			const promise = AsksManager.fillAsk(...args)
			await handleTx(promise)
			setWizardStep(FillStep.CONFIRMATION)
		} catch (err: any) {
			console.error(err)
			setError(err.message || "There's been an error, please try again.")
		}
	}, [ AsksManager, address, askCurrency, askPrice, handleTx, token, tokenAddress ])

	const content = useMemo(() => {
		switch(wizardStep) {
			case FillStep.CHECK_APPROVALS:
				return (
					<Flex
						column
						gap={12}>
						<Text fontSize={18}>
							Click continue to proceed with purchasing this NFT.
							We will check if any approvals are needed before commencing.
						</Text>
						<Button onClick={handleConfirmType}>
							Continue
						</Button>
					</Flex>
				)
			case FillStep.APPROVE_ASK_MODULE:
				return (
					<ApprovalPrompt
						title="Allow Alto Ask Module to spend tokens on your behalf"
						approvalCopy="To enabled the Buy Now feature, you must approve the Alto Ask Module"
						buttonCopy="Approve Module"
						approved={asksV1Approved}
						approve={approveAsksV1}
						mutate={mutateAsksV1}
						onApproval={() => setWizardStep(FillStep.APPROVE_ALLOWANCE)}
						onBack={() => setWizardStep(FillStep.CHECK_APPROVALS)}
					/>
				)
			case FillStep.APPROVE_ALLOWANCE:
				return (
					<ApprovalPrompt
						title="Provide an allowance of tokens to be used in this transaction"
						approvalCopy="You must approve Alto to use your tokens"
						buttonCopy="Approve Allowance"
						approved={allowance && allowance.gte(askPrice)}
						approve={approve}
						mutate={mutate}
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
								disabled={!sufficientFunds}
								txInProgress={txInProgress}
								txStatus={txStatus}
								onClick={handleAskFill}>
								{!sufficientFunds ? "Insufficient Balance": "Buy now"}
							</TransactionSubmitButton>
						</Flex>
					)
					: (
						<ContractInteractionStatus
							title="Your purchase will be confirmed shortly"
							previewURL={previewURL}
							txHash={tx.hash}
							amount={askPrice}
							currency={askCurrency}
							token={token}
							onConfirm={onClose}
						/>
					)
		}
	}, [
		wizardStep, token, tokenAddress, onClose, previewURL, cancelButton, askPrice, askCurrency,
		sufficientFunds, allowance, approve, mutate,
		asksV1Approved, approveAsksV1, mutateAsksV1,
		tx, txInProgress, txStatus,
		handleConfirmType, handleAskFill
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
				<Text>{`"Buy Now"`} Price:</Text>
				<AmountWithCurrency
					amount={askPrice}
					currency={askCurrency}
				/>
			</Flex>
			{content}
		</Flex>
	)
}
