import styled from "styled-components"

import { CenteredFlex, Text } from "../../styles"

const Container = styled(CenteredFlex).attrs(() => ({
	column: true,
	gap: 24,
	flexGrow: 1,
	flexShrink: 1
}))<{ disabled?: boolean }>`
	padding: 48px;
	border: ${({ theme }) => theme.border.thin};
	${({ disabled = false }) => disabled
		? `
			cursor: not-allowed;
			opacity: 0.5;
		`
		: `cursor: pointer;`
	}
`

const Copy = styled(Text)`
	flex-grow: 1;
`

type SelectionBoxProps = {
	image: JSX.Element,
	label: string,
	copy: string,
	onSelect?: () => void,
	disabled?: boolean
}

export function SelectionBox({ image, label, copy, onSelect, disabled }: SelectionBoxProps) {
	return (
		<Container
			disabled={disabled}
			onClick={!disabled ? onSelect: undefined}>
			{image}
			<Text as="h2">{label}</Text>
			<Copy textAlign="center">{copy}</Copy>
		</Container>
	)
}