import { AddressZero } from "@ethersproject/constants"
import { Currency } from "../types";
import { WCANTO } from "../utils/env-vars";

export const supportedCurrencyMap: { [ key: string ]: Currency } = {
	[ AddressZero ]: {
		id: AddressZero,
		decimals: 18,
		symbol: "CANTO",
		icon: "/icons/currencies/canto.png"
	},
	[ WCANTO.toLowerCase() ]: {
		id: WCANTO.toLowerCase(),
		decimals: 18,
		symbol: "WCANTO",
		icon: "/icons/currencies/wcanto.jpg"
	},
	"0x4e71a2e537b7f9d9413d3991d37958c0b5e1e503": {
		id: "0x4e71a2e537b7f9d9413d3991d37958c0b5e1e503",
		decimals: 18,
		symbol: "NOTE",
		icon: "/icons/currencies/note.svg"
	},
	"0x7264610a66eca758a8ce95cf11ff5741e1fd0455": {
		id: "0x7264610a66eca758a8ce95cf11ff5741e1fd0455",
		decimals: 18,
		symbol: "CINU",
		icon: "/icons/currencies/cinu.png"
	}
}

export const supportedCurrencyAddresses: string[] = Object.keys(supportedCurrencyMap)

export const supportedCurrencySymbols: string[] = Object.values(supportedCurrencyMap).map(({ symbol }) => symbol)

export const supportedCurrencyContractMap = Object.values(supportedCurrencyMap)
	.reduce((obj, currency) => {
		obj[ currency.symbol ] = currency
		return obj
	}, {} as { [ key: string ]: Currency })

export const defaultCurrency = supportedCurrencyMap[ AddressZero ]

export const basicConversionTable = {
	[ AddressZero ]: 1,
	[ supportedCurrencyContractMap.WCANTO.id ]: 1,
	[ supportedCurrencyContractMap.NOTE.id ]: 1 / 0.18,
	[ supportedCurrencyContractMap.CINU.id ]: 0.0000000005613 / 0.18
}