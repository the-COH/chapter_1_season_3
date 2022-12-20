import { useEffect, useRef, useState } from "react"
import styled from "styled-components"

import { useWindowWidth } from "../hooks"

import { CenteredFlex, Flex, Text } from "../styles"
import { BannerHeader } from "./BannerHeader"

const Container = styled(Flex)`
	width: 100%;
`

const ArrowContainer = styled(Flex)`
	/* position: absolute;
	right: 0px;
	top: -4px; */
`

const SliderContainer = styled(Flex)`
	width: 100vw;
	min-height: 350px;
	margin-bottom: 36px;
	padding-top: 48px;
	padding-left: 24px;
	overflow-x: scroll;
	scrollbar-width: none;
	ms-overflow-style: none;
	scroll-snap-type: x mandatory;
	scroll-snap-points-y: repeat(100vw);
	@media(min-width: 576px) {
		padding-top: 0px;
		padding-left: 48px;
		scroll-snap-type: none;
		overflow-x: hidden;
	}
	&::-webkit-scrollbar {
		display: none;
	}
`
const SliderEl = styled(Flex)`
	padding: 8px 0px;
	margin-left: 0px;
  transition: margin-left 0.5s ease;
	& > * {
		margin-right: 24px;
	}
	@media(min-width: 576px) {
		padding: 36px 0px;
		& > *:nth-child(even) {
			margin-top: 36px;
		}
	}
`

const SlideIndicator = styled(CenteredFlex)<{ active: boolean }>`
	transition: width 0.25s ease, opacity 0.25s ease;
	width: ${({ active }) => active ? "30px": "8px"};
	height: 8px;
	margin: 0 4px;
	background-color: ${({ theme }) => theme.backgroundColor.tertiary};
	border-radius: 4px;
	opacity: ${({ active }) => active ? "1": "0.5"};
`

type SliderProps = {
	heading: string,
	items: any[],
	Item: (item: any, index: number) => JSX.Element | null,
	itemWidth?: number,
	loading?: boolean,
	error?: boolean
}

export function Slider({ heading, loading, error, items, Item, itemWidth = 280, ...props }: SliderProps) {
  const { widerThanSmall } = useWindowWidth()

  const [ sliderOffset, setOffset ] = useState(0)

  const [ slideJump, setSlideJump ] = useState(1)
  const slideJumpRef = useRef(slideJump)
  slideJumpRef.current = slideJump

  useEffect(() => {
    if (!widerThanSmall) {
      setSlideJump(1)
      return
    }

    const updateJump = () => {
      const w = window.innerWidth
      const jump = Math.floor(w / itemWidth)
      if (jump !== slideJumpRef.current) setSlideJump(jump)
    }
    window.addEventListener("resize", updateJump)
    updateJump()

    return () => window.removeEventListener("resize", updateJump)
  }, [ itemWidth, widerThanSmall ])

  // mobile snap scrolling, update indicators
  const [ sliderArea, setSliderArea ] = useState<HTMLDivElement | null>()

	const [ activeScrollIndex, setActiveScrollIndex ] = useState(0);
	const scrollIndexRef = useRef(activeScrollIndex);
	scrollIndexRef.current = activeScrollIndex;

  useEffect(() => {
    if (!sliderArea) return

		const onScroll = () => {
			const index = Math.round(sliderArea.scrollLeft / window.innerWidth);
			if (index === scrollIndexRef.current) return;
			setActiveScrollIndex(index);
		}
		sliderArea.addEventListener("scroll", onScroll);

		return () => sliderArea.removeEventListener("scroll", onScroll);
  }, [ sliderArea ])

  return (
		<Container
			column
			align="center"
			gap={widerThanSmall ? 12: 0}
			{...props}>
			<BannerHeader text={[ heading, "\u2022" ]}>
				<Flex
					width="100%"
					justify="space-between">
					<Text as="h2">
						{heading}
					</Text>
					{widerThanSmall && (
						<ArrowContainer
							justify="space-between"
							align="center"
							gap={12}>
							<SliderArrow
								arrowDirection="left"
								onClick={() => setOffset(o => {
									if (o === 0) return items.length - slideJumpRef.current
									o -= slideJumpRef.current
									return Math.max(o, 0);
								})}
							/>
							<SliderArrow
								arrowDirection="right"
								onClick={() => setOffset(o => {
									o += slideJumpRef.current
									if (o < items.length) return Math.min(o, items.length - slideJumpRef.current)
									return 0
								})}
							/>
						</ArrowContainer>
					)}
				</Flex>
			</BannerHeader>
			<SliderContainer ref={setSliderArea}>
				{error
					? <Text>An error occurred while loading NFTs</Text>
					: loading
						? <Text>Loading NFTs...</Text>
						: !items.length
							? <Text>No NFTs found</Text>
							: (
								<SliderEl
									align="flex-start"
									style={{
										marginLeft: !widerThanSmall
										? `${-sliderOffset * 100}vw`
										: `${-sliderOffset * itemWidth}px`,
									}}>
									{items.map(Item)}
								</SliderEl>
							)
				}
			</SliderContainer>
			{!!items.length && !widerThanSmall && (
				<CenteredFlex width="100%">
					{Array.from({ length: Math.ceil(items.length / slideJump) }, (_, i) => (
						<SlideIndicator
							key={i}
							active={i === activeScrollIndex}
						/>
					))}
				</CenteredFlex>
			)}
		</Container>
  )
}

const SliderArrowContainer = styled(CenteredFlex)`
	width: 40px;
	height: 40px;
	cursor: pointer;
`

const Arrow = styled(Text)<{ direction: SliderArrowProps[ "arrowDirection" ]}>`
	transform: scale(2.4, 2.4) ${({ direction }) => direction === "left"
		? "rotate(90deg)"
		: "rotate(-90deg)"
	};
	color: ${({ theme }) => theme.backgroundColor.tertiary};
`

type SliderArrowProps = {
	arrowDirection: "left" | "right",
	onClick: () => void
}

export function SliderArrow({ arrowDirection, onClick, ...props }: SliderArrowProps) {
	return (
		<SliderArrowContainer
			{...props}
			onClick={onClick}>
			<Arrow direction={arrowDirection}>{"\u25bc"}</Arrow>
		</SliderArrowContainer>
	)
}