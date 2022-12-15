import styled, { css } from "styled-components"

import { Avatar, Flex, Text } from "../../styles"

const Container = styled(Flex).attrs(() => ({
	column: true,
	justify: "center",
	align: "center",
	gap: 24
}))<{ disabled?: boolean }>`
	width: 160px;
	height: 160px;
	padding: 24px;
	overflow: hidden;
	font-size: 14px;
	border: ${({ theme }) => theme.border.thin};
	${({ disabled = false }) => disabled
		? css`
			cursor: not-allowed;
			opacity: 0.6;
		`
		: css`cursor: pointer;`
	}
`

type FormSelectionBoxProps = {
	color?: string,
	label: string,
	sublabel?: string,
	disabled?: boolean
}

export function FormSelectionBox({ color = "gray", label, sublabel, disabled }: FormSelectionBoxProps) {
	return (
		<Container
			width="auto"
			column
			align="center"
			gap={24}
			disabled={disabled}>
			<Avatar
				src=""
				size={48}
				color={color}
			/>
			<Flex
				column
				align="center"
				style={{ overflow: "hidden", maxWidth: "100%" }}>
				<Text
					textOverflow="ellipsis"
					whiteSpace="nowrap"
					style={{ overflow: "hidden", maxWidth: "100%" }}>
					{label}
				</Text>
				{!!sublabel && <Text fontWeight="lighter">{sublabel}</Text>}
			</Flex>
		</Container>
	)
}