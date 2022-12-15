import styled, { css } from "styled-components";

export type TextProps = {
	color?: string,
	textAlign?: "left" | "center" | "right",
	fontSize?: number,
	fontWeight?: number | "bold" | "bolder" | "normal" | "light" | "lighter",
	whiteSpace?: "normal" | "nowrap" | "pre" | "pre-wrap" | "pre-line" | "break-spaces",
	textOverflow?: "ellipsis" | "clip",
	textTransform?: "uppercase" | "capitalize" | "lowercase",
	textDecoration?: "none" | "underline" | "overline" | "line-through"
	letterSpacing?: number,
	lineHeight?: number,
	fontStyle?: "normal" | "italic"
}

export const Text = styled.div<TextProps>`
	${({ color = undefined }) => color && css`color: ${color};`}
	${({ textAlign = undefined }) => textAlign && css`text-align: ${textAlign};`}
	${({ fontSize = undefined }) => fontSize && css`font-size: ${fontSize}px;`}
	${({ fontWeight = undefined }) => fontWeight && css`font-weight: ${fontWeight};`}
	${({ whiteSpace = undefined }) => whiteSpace && css`white-space: ${whiteSpace};`}
	${({ textOverflow = undefined }) => textOverflow && css`text-overflow: ${textOverflow};`}
	${({ textTransform = undefined }) => textTransform && css`text-transform: ${textTransform};`}
	${({ textDecoration = undefined }) => textDecoration && css`text-decoration: ${textDecoration};`}
	${({ letterSpacing = undefined }) => letterSpacing && css`letter-spacing: ${letterSpacing}px;`}
	${({ lineHeight = undefined }) => lineHeight && css`line-height: ${lineHeight}px;`}
	${({ fontStyle = undefined }) => fontStyle && css`font-style: ${fontStyle};`}
`