import { useMemo } from "react"
import { Contract, ContractTransaction } from "ethers"
import { AddressZero, MaxUint256 } from "@ethersproject/constants"
import useSWR from "swr"

import { ERC20_TRANSFER_HELPER } from "../../utils/env-vars"
import { ERC20_ABI } from "../../abis"

import { useAuth } from "../useAuth"
import { isSameAddress } from "../../utils"

type Props = {
  contractAddress?: string,
  amount: string
}

export function useERC20TransferHelperApproval({ contractAddress, amount }: Props) {
  const { address: account, signer } = useAuth()

  const contract = useMemo(() => {
    if (!signer || !contractAddress || isSameAddress(contractAddress, AddressZero)) {
      return
    }

    return new Contract(contractAddress, ERC20_ABI, signer)
  }, [contractAddress, signer])

  const { data: allowance, ...rest } = useSWR(
    contract && contractAddress && account && ERC20_TRANSFER_HELPER
      ? [ contract, account, ERC20_TRANSFER_HELPER ]
      : null,
    (contract, userAddress, spender) => contract.allowance(userAddress, spender)
  )

  function approve(): Promise<ContractTransaction> {
    if (!contract || !ERC20_TRANSFER_HELPER || !amount) {
      throw new Error("No connected contract instance || spender address || invalid amount")
    }

    return contract?.approve(ERC20_TRANSFER_HELPER, amount)
  }

  return {
		loading: typeof allowance === "undefined",
		allowance: isSameAddress(contractAddress, AddressZero) ? MaxUint256: allowance,
		approve,
		...rest
	}
}