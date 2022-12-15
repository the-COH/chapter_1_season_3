import { useMemo, useState } from "react"
import styled, { css, keyframes } from "styled-components"
import { CenteredFlex, Flex, FlexProps, Text, TextProps } from "../styles"

import { ReactChildren } from "../types"

const createScrollAnimation = (distance: number) => keyframes`
	0% { transform: translateX(0px) }
	100% { transform: translate(${-distance}px) }
`

const Container = styled(CenteredFlex)`
	position: relative;
	width: 100%;
	overflow: visible;
`

const Banner = styled(CenteredFlex)<{ bg?: string, scrollDistance?: number }>`
	position: absolute;
	top: -12px;
	width: 100vw;
	background-color: ${({ bg }) => bg || "transparent"};
	font-family: var(--jazz-font);
	color: rgba(237, 233, 215, 0.05);
	overflow: hidden;
	${({ scrollDistance }) => !!scrollDistance && css`
		& > div {
			animation: ${createScrollAnimation(scrollDistance)} ${scrollDistance / 50}s linear infinite;
			overflow: visible;
		}
	`}
	z-index: -1;
`

type BannerHeaderProps = FlexProps & ReactChildren & {
	bg?: string,
	text: string | string[],
	textOptions?: TextProps,
	spacing?: number
}

export function BannerHeader({ bg, text, textOptions = {}, spacing = 12, children }: BannerHeaderProps) {
	const textArray = Array.isArray(text) ? text: [ text ]

	const [ chunk, setChunk ] = useState<HTMLDivElement | null>(null)

	const chunkWidth: number | undefined = useMemo(() => {
		if (!chunk) return undefined

		const { width } = chunk.getBoundingClientRect()
		return width + spacing
	}, [ chunk, spacing ])

	return (
		<Container>
			<Banner
				bg={bg}
				scrollDistance={chunkWidth}>
				<CenteredFlex
					width="100%"
					gap={spacing}>
					{Array.from({ length: Math.ceil(12 / textArray.length) }, (_, i) => (
						<Flex
							key={i}
							ref={i === 0 ? setChunk: undefined}
							align="center"
							gap={spacing}>
							{textArray.map((t, j) => (
								<Text
									key={j}
									whiteSpace="nowrap"
									fontSize={128}
									fontWeight={700}
									textTransform="uppercase"
									letterSpacing={1}
									{...textOptions}>
									{t}
								</Text>
							))}
						</Flex>
					))}
				</CenteredFlex>
			</Banner>
			{children}
		</Container>
	)
}