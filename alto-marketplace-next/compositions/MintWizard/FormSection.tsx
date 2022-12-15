import styled from "styled-components"

import { ReactChildren } from "../../types"

import { Flex, FlexProps, Text } from "../../styles"

export const Section = styled(Flex).attrs(({ width = "100%" }: any) => ({
	column: true,
	gap: 12,
	width
}))``

export const SectionSubheading = styled(Text).attrs(() => ({
	fontWeight: "lighter",
	fontSize: 12
}))`
	color: ${({ theme }) => theme.textColor.secondary};
`

type FormSectionProps = FlexProps & ReactChildren & {
	heading: string,
	subheading?: string
}

export function FormSection({ heading, subheading, children, ...props }: FormSectionProps) {
	return (
		<Section {...props}>
			<Text fontWeight="bolder">{heading}</Text>
			{subheading && <SectionSubheading>{subheading}</SectionSubheading>}
			{children}
		</Section>
	)
}