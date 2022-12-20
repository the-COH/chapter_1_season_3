import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ERC721Token } from "./ERC721";

export type FilterOption = {
	label: string,
	value: boolean | [ number, number ],
	filter: (token: ERC721Token, value: any) => boolean
}

export class Filter {
	label: string;
	type: "boolean" | "range";
	exclusiveOptions: boolean;
	options: FilterOption[];

	constructor({
		label,
		type,
		exclusiveOptions = true,
		options
	}: {
		label: string,
		type: "boolean" | "range",
		exclusiveOptions?: boolean,
		options: FilterOption[]
	}) {
		this.label = label
		this.type = type
		this.exclusiveOptions = exclusiveOptions
		this.options = options
	}

	resetOption(optionLabel: string) {
		const option = this.options.find(({ label }) => label === optionLabel)
		if (!option) return
		if (this.type === "boolean") option.value = false
		else option.value = [ 0, 0 ]
	}

	resetAllOptions() {
		this.options.forEach(option => {
			if (this.type === "boolean") option.value = false
			else option.value = [ 0, 0 ]
		})
	}

	filter(token: any) {
		if (this.exclusiveOptions) {
			for (const { value, filter } of this.options) {
				if (!filter(token, value)) return false
			}
			return true
		}
		
		const toTest = this.options.filter(({ value }) => value)
		if (!toTest.length) return true

		for (const { value, filter } of toTest) {
			if (filter(token, value)) return true
		}
		return false
	}

	exportActiveFilters() {
		const active: string[] = []
		this.options.forEach(({ label, value }) => {
			if (typeof value === "boolean") {
				if (!value) return
			}
			else if (Array.isArray(value)) {
				if (!value[0] && !value[1]) return
			}
			active.push(`${this.label}: ${this.type === "range"
				? (value as [ number, number ]).map(num => num.toLocaleString()).join(" - ")
				: label
			}`)
		})
		return active
	}
}

export const defaultFilters = [
	new Filter({
		type: "boolean",
		label: "Status",
		options: [
			{
				label: "Buy Now",
				value: false,
				filter: (token: ERC721Token, value: boolean) => !value ? true: Boolean(token.ask?.ask_live)
			},
			{
				label: "Active Auction",
				value: false,
				// filter: (token: ERC721Token, value: boolean) => !value ? true: token.auction && token.auction.auction_live
				filter: (_, value) => !value
			}
		]
	}),
	new Filter({
		type: "range",
		label: "Price",
		options: [{
			label: "Range",
			value: [ 0, 0 ],
			filter: (token: ERC721Token, value: [ number, number ]) => {
				if (!value[0] && !value[1]) return true
				if (!token?.ask?.ask_live) return false
				const price = parseEther(token.ask.ask_askPrice)
				return price.gte(BigNumber.from(value[0])) && price.lte(BigNumber.from(value[1]))
			}
		}]
	})
]

export function getDefaultFiltersWithTraits(traits: { [ key: string ]: string[] } = {}) {
	return [
		new Filter({
			type: "boolean",
			label: "Status",
			options: [
				{
					label: "Buy Now",
					value: false,
					filter: (token: ERC721Token, value: boolean) => !value ? true: Boolean(token.ask?.ask_live)
				},
				{
					label: "Active Auction",
					value: false,
					// filter: (token: ERC721Token, value: boolean) => !value ? true: token.auction && token.auction.auction_live
					filter: (_, value) => !value
				}
			]
		}),
		new Filter({
			type: "range",
			label: "Price",
			options: [{
				label: "Range",
				value: [ 0, 0 ],
				filter: (token: ERC721Token, value: [ number, number ]) => {
					if (!value[0] && !value[1]) return true
					if (!token?.ask?.ask_live) return false
					const price = parseEther(token.ask.ask_askPrice)
					return price.gte(BigNumber.from(value[0])) && price.lte(BigNumber.from(value[1]))
				}
			}]
		}),
		...Object.entries(traits).map(([ key, arr ]) => (
			new Filter({
				type: "boolean",
				label: key,
				exclusiveOptions: false,
				options: arr.map((trait) => ({
					label: trait,
					value: false,
					filter: (token: ERC721Token, value: boolean) => {
						if (!value) return true

						if (!token.traits || !token.traits.length) return false
						const t = token.traits.find(({ trait_type }: { trait_type: string }) => trait_type === key)
						console.log(t)
						if (!t) return false
						return t.value === trait
					}
				}))
			})
		))
	]
}