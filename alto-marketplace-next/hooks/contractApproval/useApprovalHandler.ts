import { useState } from "react"
import { ContractTransaction } from "ethers"
import { KeyedMutator } from "swr"

interface HandlerProps {
	approve: () => Promise<ContractTransaction>,
	handleTx: (promise: Promise<ContractTransaction>) => void,
	mutate: KeyedMutator<any>
}

export function useApprovalHandler({ approve, handleTx, mutate }: HandlerProps) {
	const [ error, setError ] = useState("")

	return {
		error,
		handler: async () => {
			try {
				setError("")
				const promise = approve()
				await handleTx(promise)
				await mutate()
			} catch(e: any) {
				setError && setError(e.message)
				await mutate()
			}
		}
	}
}