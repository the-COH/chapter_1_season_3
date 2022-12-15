import { ChangeEvent, useCallback, useState } from "react"
import styled from "styled-components"
import { Contract, ContractTransaction } from "ethers"
import { isAddress } from "ethers/lib/utils"
import { ERC721_ABI } from "../../abis"

import { Ask, ERC721Token } from "../../types"

import { useAuth, useContractTransaction } from "../../hooks"

import { Flex, Text } from "../../styles"
import { NFTHeader } from "../../components/NFTHeader"
import { ErrorDetail } from "../../components/ErrorDetail"
import { TransactionSubmitButton } from "../../components/TransactionSubmitButton"
import { ContractInteractionStatus } from "../../components/ContractInteractionStatus"

const Input = styled.input`
	height: 22px;
	flex-grow: 1;
`

interface TokenTransferWizardProps {
	tokenAddress: string,
	tokenId: string,
	token: ERC721Token,
	previewURL?: string,
	activeAsk?: Ask,
	onClose: () => void
}

enum TransferStep {
	TRANSFER_DETAILS,
	CONFIRMATION
}

export function TokenTransferWizard({
	token,
	tokenAddress,
	tokenId,
	previewURL,
	activeAsk,
	onClose
}: TokenTransferWizardProps) {
	const { address, signer } = useAuth()
	const [ error, setError ] = useState<string>()
	const { tx, txStatus, handleTx, txInProgress } = useContractTransaction()

	const [ sendToAddress, setSendToAddress ] = useState("")

	const [ wizardStep, setWizardStep ] = useState<TransferStep>(TransferStep.TRANSFER_DETAILS)
	
	const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setError("")
		const { value } = event.currentTarget

		if (!isAddress(value)) setError("This address seems to be invalid! Please confirm this address is correct before continuing.")
		setSendToAddress(value)
	}, [])

	const handleSubmit = useCallback(async () => {
		setError("")
		if (!signer) return setError("No wallet connected!")

		try {
			const contract = new Contract(tokenAddress, ERC721_ABI, signer)
			if (!contract) return setError("Unable to interact with contract. Please report this issue.")
			const args: any[] = [
				address,       // from
				sendToAddress, // to
				tokenId        // tokenId
			]
			console.log("transferFrom:", args)
			const promise: Promise<ContractTransaction> = contract.transferFrom(...args)
			await handleTx(promise)
			setWizardStep(TransferStep.CONFIRMATION)
		} catch(err: any) {
			console.error(err)
			setError(err?.message || "There's been an error, please try again.")
		}
	}, [ signer, tokenAddress, tokenId, address, sendToAddress ])

	return (
		<Flex
			column
			gap={32}>
			{activeAsk
				? <Text>
					Please unlist this NFT by cancelling the current listing. 
					You will be unable to transfer this NFT until the cancellation transaction has been processed.
				</Text>
				: (<>
					<NFTHeader
						token={token}
						previewURL={previewURL}
					/>
					{wizardStep === TransferStep.CONFIRMATION && tx
						? (
							<ContractInteractionStatus
								title="Your transfer will be confirmed shortly"
								previewURL={previewURL}
								txHash={tx.hash}
								onConfirm={onClose}
							/>
						)
						: (<>
							{error && <ErrorDetail error={error}/>}
							<Flex
								justify="space-between"
								gap={12}>
								<Text>Send to Address:</Text>
								<Input
									name="sendToAddress"
									value={sendToAddress}
									onChange={handleInput}
								/>
							</Flex>
							<TransactionSubmitButton
								txInProgress={txInProgress}
								txStatus={txStatus}
								onClick={handleSubmit}>
								Transfer
							</TransactionSubmitButton>
						</>)
					}
				</>)
			}
		</Flex>
	)
}