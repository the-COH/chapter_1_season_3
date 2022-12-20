import { Flex, FlexProps, Text, TextProps } from "../styles"
import { AddressLink } from "./AddressLink"

type NFTOwnerProps = FlexProps & TextProps & {
	address?: string,
	invertArrow?: boolean
}

export function NFTOwner({ address = undefined, invertArrow, ...props }: NFTOwnerProps) {
	if (!address) return null;

	return (
		<Flex
			column
			gap={8}
			{...props}>
			<Text fontWeight="lighter" {...props}>Owned by</Text>
			<AddressLink
				address={address}
				invertArrow={invertArrow}
				{...props}
			/>
		</Flex>
	)
}
