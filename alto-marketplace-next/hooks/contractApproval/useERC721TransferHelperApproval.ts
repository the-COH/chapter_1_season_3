import { useMemo } from "react"
import { Contract, ContractTransaction } from "ethers"
import useSWR from "swr"

import { ERC721_TRANSFER_HELPER } from "../../utils/env-vars"
import { ERC721_ABI } from "../../abis"

import { useAuth } from "../useAuth"

export function useERC721TransferHelperApproval(contractAddress?: string) {
  const { address: account, signer } = useAuth()

  const contract = useMemo(() => {
    if (!signer || !contractAddress) {
      return
    }

    return new Contract(contractAddress, ERC721_ABI, signer)
  }, [ contractAddress, signer ])

  const { data: approved, ...rest } = useSWR(
    contract && contractAddress && account && ERC721_TRANSFER_HELPER
      ? [ "isApprovedForAll", contract, account, ERC721_TRANSFER_HELPER ]
      : null,
    (_, contract, userAddress, spender) => contract.isApprovedForAll(userAddress, spender)
  )

  function approve(): Promise<ContractTransaction> {
    if (!contract || !ERC721_TRANSFER_HELPER) {
      throw new Error("No connected contract instance || spender address")
    }

    return contract?.setApprovalForAll(ERC721_TRANSFER_HELPER, true)
  }

  return {
		loading: typeof approved === "undefined",
		approved,
		approve,
		...rest
	}
}