import { useMemo } from "react"
import { AddressZero } from "@ethersproject/constants"
import { isSameAddress } from "../utils"

import { useAuth } from "../hooks"

import { Text, TextProps } from "../styles"

type AddressTextProps = TextProps & {
	address: string
}

export function AddressText({ address, ...props }: AddressTextProps) {
	const { address: connectedAddress = "" } = useAuth()

	const isAddressConnected = useMemo(() => isSameAddress(address, connectedAddress), [ address, connectedAddress ])

	const trimmedAddress = useMemo(() => {
		if (isSameAddress(address, AddressZero)) return "null address"
		if (isAddressConnected) return `you (${address.slice(0, 4)})`
		if (address.length < 12) return address
		return address.slice(0, 4) + "..." + address.slice(address.length - 4)
	}, [ address, isAddressConnected ])

	return (
		<Text {...props}>{trimmedAddress}</Text>
	)
}