import { ReactNode } from "react"
import styled from "styled-components"

import { ReactChildren } from "../types"

import { Flex, FlexProps, Text } from "../styles"

const Container = styled(Flex)`
	width: ${({ width = "100%" }) => width};
	border: ${({ theme }) => theme.border.thin};
`

export const InnerDetail = styled(Flex)`
	width: 100%;
	padding: 24px;
	gap: ${({ gap = 24 }) => gap}px;
	&:not(:first-of-type) {
		border-top: ${({ theme }) => theme.border.thin};
	}
`

export const DetailHeader = styled(Text)`
	font-size: ${({ fontSize = 18 }) => fontSize}px;
	font-weight: ${({ fontWeight = "bold" }) => fontWeight};
`

export type DetailBoxProps = FlexProps & ReactChildren & {
	heading?: string,
	body?: ReactNode | ReactNode[],
	innerGap?: FlexProps[ "gap" ]
}

export function DetailBox({ heading, body, children, innerGap, column = true, ...props }: DetailBoxProps) {
	return (
		<Container
			column={column}
			{...props}>
			{heading && (
				<InnerDetail>
					<DetailHeader
						fontSize={18}
						fontWeight="bold">
						{heading}
					</DetailHeader>
				</InnerDetail>
			)}
			{body && (
				<InnerDetail
					column
					gap={innerGap}>
					{body}
				</InnerDetail>
			)}
			{children}
		</Container>
	)
}