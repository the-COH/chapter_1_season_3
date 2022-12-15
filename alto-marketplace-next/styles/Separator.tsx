import styled from "styled-components"

type SeparatorProps = {
	width?: string,
	thickness?: number,
	color?: string
}

export const Separator = styled.div<SeparatorProps>`
	width: ${({ width = "100%" }) => width};
	height: ${({ thickness = 2 }) => thickness + "px"};
	background-color: ${({ color, theme }) => color || theme.textColor.tertiary};
`