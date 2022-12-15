import { useState } from "react"
import styled, { css } from "styled-components"

import { CenteredFlex, Text, TextProps } from "../styles"

const Container = styled(CenteredFlex)<{ size?: number }>`
	position: relative;
	width: ${({ size = 32 }) => size}px;
	height: ${({ size = 32 }) => size}px;
	border-radius: 50%;
	cursor: pointer;

	& g {
		fill: ${({ theme }) => theme.accentColor.cream};
	}
`

type TipProps = {
	visible: boolean,
	position?: "left" | "center" | "right"
}

const Tip = styled(Text)<TipProps>`
	position: absolute;
	bottom: calc(100% + 8px);
	${({ position }) => position === "center"
		? ``
		: position === "left"
			? css`right: 0px;`
			: css`left: 0px;`
	}
	width: 240px;
	padding: 12px;
	background-color: ${({ theme }) => theme.backgroundColor.secondary};
	color: ${({ theme }) => theme.textColor.primary};
	display: ${({ visible }) => visible ? "block": "none"};
	z-index: 2;

	&::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		margin-left: -16px;
		border-width: 16px;
		border-style: solid;
		border-color: ${({ theme }) => theme.backgroundColor.secondary} transparent transparent transparent;
	}
`

type TooltipProps = TextProps & {
	tip: string,
	position?: TipProps[ "position" ],
	size?: number
}

export function Tooltip({ tip, position = "center", size = 32, ...props }: TooltipProps) {
	const [ isClicked, setIsClicked ] = useState(false)
	const [ isHovered, setIsHovered ] = useState(false)

	return (
		<Container
			onClick={() => setIsClicked(c => !c)}
			onPointerEnter={() => setIsHovered(true)}
			onPointerLeave={() => setIsHovered(false)}>
			<svg width={0.6 * size} height={0.6 * size} viewBox="0 0 480.000000 480.000000">
				<g transform="translate(0.000000,480.000000) scale(0.100000,-0.100000)" stroke="none">
					<path d="M2210 4340 c-825 -90 -1499 -672 -1698 -1466 -43 -171 -56 -286 -56
					-479 0 -316 62 -580 201 -860 519 -1049 1845 -1404 2820 -755 362 241 631 592
					767 1001 138 413 138 825 0 1238 -228 688 -831 1196 -1550 1306 -124 19 -372
					27 -484 15z m515 -320 c659 -140 1154 -636 1297 -1300 19 -91 22 -135 22 -320
					0 -185 -3 -229 -22 -319 -145 -670 -635 -1159 -1302 -1302 -89 -20 -136 -23
					-315 -23 -180 -1 -225 2 -317 22 -671 141 -1166 633 -1310 1302 -19 91 -22
					135 -22 320 0 242 14 333 81 530 200 590 729 1026 1348 1109 119 16 425 5 540
					-19z"/>
					<path d="M2279 3587 c-109 -31 -201 -116 -234 -218 -13 -37 -16 -72 -13 -128
					20 -338 473 -430 628 -127 29 58 34 77 34 139 1 108 -24 169 -98 243 -43 43
					-76 66 -111 78 -69 23 -151 28 -206 13z"/>
					<path d="M2230 2681 l-425 -16 -3 -72 -3 -73 91 0 c111 0 171 -14 205 -47 l25
					-26 0 -513 0 -513 -23 -26 c-27 -32 -79 -44 -189 -45 l-78 0 0 -75 0 -75 585
					0 585 0 0 75 0 75 -64 0 c-99 0 -168 16 -193 46 l-23 25 0 640 0 639 -32 -2
					c-18 0 -224 -8 -458 -17z"/>
				</g>
			</svg>
			<Tip
				visible={isClicked || isHovered}
				position={position}
				textAlign="center"
				fontSize={12}
				{...props}>
				{tip}
			</Tip>
		</Container>
	)
}