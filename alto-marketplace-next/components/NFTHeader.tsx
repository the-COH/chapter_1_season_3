import { ERC721Token } from "../types"

import { Avatar, CenteredFlex, Flex, Orb, Text } from "../styles"

type NFTHeaderProps = {
	token: ERC721Token,
	name?: string,
	previewURL?: string
}

export function NFTHeader({ token, name: tokenName, previewURL }: NFTHeaderProps) {
	return (
		<CenteredFlex
			width="100%"
			gap={12}>
			{previewURL
				? (
					<Avatar
						src={previewURL || ""}
						size={60}
					/>
				)
				: <Orb size={60}/>
			}
			<Flex gap={8}>
				<Text fontSize={20}>{token.contract?.name || "Unnamed Collection"}</Text>
				<Text fontSize={20}>{tokenName || (token.identifier ? `#${token.identifier}`: "Unnamed NFT")}</Text>
			</Flex>
		</CenteredFlex>
	)
}