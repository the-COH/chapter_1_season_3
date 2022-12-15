import styled from "styled-components"

import { CenteredFlex } from "../styles"

const Container = styled(CenteredFlex)<{ active: boolean }>`
	position: relative;
	width: 72px;
	height: 40px;
	border-radius: 999px;
	transition: background-color 0.5s ease;
	background-color: ${({ active, theme }) => active
		? theme.accentColor.jazzBlue
		: "#373737"
	};
	& > div {
		left: ${({ active }) => active ? 72 - 32 - 4: 4}px;
	}
	cursor: pointer;
`
const Knob = styled.div`
	position: absolute;
	transition: left 0.5s ease;
	width: 32px;
	height: 32px;
	border-radius: 999px;
	background-color: ${({ theme }) => theme.backgroundColor.primary};
`

type ToggleProps = {
	active: boolean,
	onToggle: () => void
}

export function Toggle({ active, onToggle }: ToggleProps) {
	return (
		<Container
			active={active}
			onClick={onToggle}>
			<Knob/>
		</Container>
	)
}