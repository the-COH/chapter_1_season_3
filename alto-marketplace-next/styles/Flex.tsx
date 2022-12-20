import styled, { css } from "styled-components"

type Alignment = "stretch" | "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly"

export type FlexProps = {
	direction?: "row" | "row-reverse" | "column" | "column-reverse",
	column?: boolean,
	justify?: Alignment,
	align?: Alignment,
	flexWrap?: boolean,
	width?: string,
	gap?: number,
	grow?: number,
	shrink?: number
}

export const Flex = styled.div<FlexProps>`
	display: flex;
	flex-direction: ${({ direction = undefined, column }) => direction || (column ? "column": "row")};
	justify-content: ${({ justify = "stretch" }) => justify};
	align-items: ${({ align = "stretch" }) => align};
	flex-wrap: ${({ flexWrap = false }) => flexWrap ? "wrap": "nowrap"};
	${({ width = undefined }) => width && css`width: ${width};`}
	${({ gap = undefined }) => gap && css`gap: ${gap}px;`}
	${({ grow = undefined }) => grow !== undefined && css`flex-grow: ${grow};`}
	${({ shrink = undefined }) => shrink !== undefined && css`flex-shrink: ${shrink};`}
`

export const CenteredFlex = styled(Flex).attrs(() => ({
	justify: "center",
	align: "center"
}))``