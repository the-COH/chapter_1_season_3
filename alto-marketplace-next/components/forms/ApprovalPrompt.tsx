import { useEffect } from "react"
import { ContractTransaction } from "ethers"
import { KeyedMutator } from "swr"

import { useContractTransaction } from "../../hooks"
import { useApprovalHandler } from "../../hooks/contractApproval"

import { Flex, Button, Text, CenteredFlex } from "../../styles"
import { ErrorDetail } from "../ErrorDetail"
import { TransactionSubmitButton } from "../TransactionSubmitButton"

interface ApprovalPromptProps {
  title: string,
  approvalCopy?: string,
  buttonCopy?: string,
	approved: boolean,
	approve: () => Promise<ContractTransaction>,
	mutate: KeyedMutator<any>,
  onApproval: () => void,
  onBack: () => void
}

export function ApprovalPrompt({
  title,
  approvalCopy = "To list your NFTs on Alto, you first need to approve permission for Alto to use your NFTs",
  buttonCopy = "Approve your NFTs",
	approved,
	approve,
	mutate,
  onApproval,
  onBack
}: ApprovalPromptProps) {
  const { txStatus, handleTx, txInProgress } = useContractTransaction()
	const { error, handler } = useApprovalHandler({ approve, handleTx, mutate })

  useEffect(() => {
    if (approved) {
      onApproval()
    }
  }, [ approved, onApproval ])

  return (
		<Flex
			column
			gap={12}>
			<Flex
				column
				gap={8}>
				<Text fontSize={24}>{title}</Text>
				<Text>{approvalCopy}</Text>
			</Flex>
			{error && <ErrorDetail error={error}/>}
			<CenteredFlex gap={8}>
				<Button
					disabled={txInProgress}
					onClick={onBack}
					style={{ flexGrow: 1 }}>
					Go back
				</Button>
				<TransactionSubmitButton
					txInProgress={txInProgress}
					txStatus={txStatus}
					onClick={handler}>
					{buttonCopy}
				</TransactionSubmitButton>
			</CenteredFlex>
		</Flex>
  )
}
