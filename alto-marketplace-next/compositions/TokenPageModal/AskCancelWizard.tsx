import { useCallback, useState } from "react"
import { ContractTransaction } from "ethers"
import { formatCryptoVal } from "../../utils"

import { ERC721Token } from "../../types"

import { useAuth, useContractTransaction } from "../../hooks"

import { useContractContext } from "../../providers"

import { Flex, Text } from "../../styles"
import { NFTHeader } from "../../components/NFTHeader"
import { ErrorDetail } from "../../components/ErrorDetail"
import { TransactionSubmitButton } from "../../components/TransactionSubmitButton"
import { ContractInteractionStatus } from "../../components/ContractInteractionStatus"

interface AskCancelWizardProps {
	tokenAddress: string,
	tokenId: string,
	token: ERC721Token,
	askPrice: string,
	previewURL?: string,
	onClose: () => void
}

enum FillStep {
	REVIEW_DETAILS,
	CONFIRMATION
}

export function AskCancelWizard({ token, tokenAddress, tokenId, askPrice, previewURL, onClose }: AskCancelWizardProps) {
	const { address } = useAuth()
	const [ error, setError ] = useState<string>()
	const { AsksManager } = useContractContext()
	const { tx, txStatus, handleTx, txInProgress } = useContractTransaction()

	const [ wizardStep, setWizardStep ] = useState<FillStep>(FillStep.REVIEW_DETAILS)

	const handleCancel = useCallback(async () => {
		try {
			if (!address || !AsksManager) {
				throw new Error("AskContract is not ready, please try again.")
			}

			console.log("cancelAsk:", [ tokenAddress, tokenId ])
			const promise: Promise<ContractTransaction> = AsksManager.cancelAsk(
				tokenAddress,
				tokenId
			)
			await handleTx(promise)
			setWizardStep(FillStep.CONFIRMATION)
		} catch (err: any) {
			console.error(err)
			setError(err?.message || "There's been an error, please try again.")
		}
	}, [ AsksManager, address, handleTx, tokenAddress, tokenId ])

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
					<Text>Current Ask: {formatCryptoVal(askPrice)}</Text>
					{error && <ErrorDetail error={error}/>}
					<TransactionSubmitButton
						txInProgress={txInProgress}
						txStatus={txStatus}
						onClick={handleCancel}>
						Cancel Listing
					</TransactionSubmitButton>
				</>)
			}
		</Flex>
	)
}