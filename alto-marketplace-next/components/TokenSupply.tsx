import { Text, TextProps } from "../styles"

type TokenSupplyProps = TextProps & {
	supply?: number
}

export function TokenSupply({ supply, ...props }: TokenSupplyProps) {
	return (
		<Text
			as="span"
			{...props}>
			{supply === undefined
				? "???"
				: supply <= 0
					? "--"
					: supply.toLocaleString()
			}
		</Text>
	)
}