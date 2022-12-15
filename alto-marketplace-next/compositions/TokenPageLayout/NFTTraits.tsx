import styled from "styled-components";

import { ERC721Trait } from "../../types";

import { CenteredFlex, Flex, Text } from "../../styles";
import { DetailBox, DetailBoxProps } from "../../components/DetailBox";

const TraitContainer = styled(CenteredFlex)`
	padding: 12px 24px;
	border: ${({ theme }) => theme.border.thin};
	gap: 12px;
	flex-grow: 1;
	@media(min-width: 576px) {
		flex-grow: 0;
	}
`

const TraitLabel = styled(Text).attrs(() => ({
	fontSize: 10,
	fontWeight: "bolder",
	textTransform: "uppercase"
}))`
	color: ${({ theme }) => theme.textColor.tertiary};
`

type NFTTraitsProps = DetailBoxProps & {
	traits: ERC721Trait[]
}

export function NFTTraits({ traits, ...props }: NFTTraitsProps) {
	return (
		<DetailBox
			heading="Traits"
			body={(
				<Flex
					flexWrap={true}
					gap={12}>
					{traits.map(({ trait_type, value }, i) => (
						<TraitContainer
							key={i}
							column>
							<TraitLabel>
								{trait_type}
							</TraitLabel>
							<Text fontSize={18}>{value}</Text>
						</TraitContainer>
					))}
				</Flex>
			)}
			{...props}
		/>
	)
}