import { ethers } from "ethers"
import { formatEther, getAddress } from "ethers/lib/utils"
import { NETWORK_RPC_URL } from "./env-vars"
import { basicConversionTable } from "../constants"

export * from "./formatting"
export * from "./metadata"

export const defaultProvider = new ethers.providers.JsonRpcProvider(NETWORK_RPC_URL)

export function isSameAddress(address1: string = "", address2: string = "") {
	try {
		const a1 = getAddress(address1)
		const a2 = getAddress(address2)
		if (a1 && a2) return a1.toLowerCase() === a2.toLowerCase()
		return false
	} catch(_) {
		return false
	}
}

export function convertCurrencyToCanto(amount: string, currency: string) {
	return parseFloat(formatEther(amount)) * (basicConversionTable[ currency.toLowerCase() ] || 0)
}
