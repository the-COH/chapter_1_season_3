import Image from "next/image"
import styled, { useTheme } from "styled-components"
import { useWindowWidth } from "../../hooks"

import { CenteredFlex, CTAButton, Flex, Text } from "../../styles"
import { PassLink } from "../../components/PassLink"

const Container = styled(CenteredFlex)`
	width: 100%;
	margin: 48px 0;
	position: relative;

	@media(min-width: 1024px) {
		margin: 96px 0;
	}
`
const HeadingCTA = styled(Flex)`
	max-width: 500px;
`
const SplashImageContainer = styled(CenteredFlex)`
	width: 830px;
	/* height: 560px; */
	aspect-ratio: 1.482;
	position: relative;
	max-width: calc(100vw - 48px);
	max-height: calc(67.5vw - 32px);
	& > *:first-child {
		z-index: -1;
	}
`

const ExploreButton = styled(CTAButton)`
	background-color: ${({ theme }) => theme.accentColor.cream} !important;
`

export function Header() {
	const theme = useTheme()
	const { widerThanLarge } = useWindowWidth()

	return (
		<Container
			direction={!widerThanLarge ? "column-reverse": "row"}
			gap={!widerThanLarge ? 48: 24}>
			<HeadingCTA
				column
				align={!widerThanLarge ? "center": "stretch"}
				gap={48}>
				<Flex
					column
					gap={24}>
					<Text
						fontSize={36}
						textAlign={!widerThanLarge ? "center": "left"}>
						<Text
							as="span"
							fontWeight="bolder">
							{`Canto's NFT Marketplace with `}
							<Text
								as="span"
								color={(theme as any).accentColor.jazzBlue}>
								zero trading fees.
							</Text>
						</Text>
						<Text>
							Creators set their own royalties.
						</Text>
					</Text>
					<Text
						fontWeight="lighter"
						textAlign={!widerThanLarge ? "center": "left"}
						fontStyle="italic">
						{`Zoom-zoom boom, skebop WOW that's not bad.`}
					</Text>
				</Flex>
				<Flex
					align="center"
					gap={24}>
					<PassLink href="/collections">
						<ExploreButton as="a">Explore</ExploreButton>
					</PassLink>
					<PassLink href="/mint">
						<CTAButton as="a">Create</CTAButton>
					</PassLink>
				</Flex>
			</HeadingCTA>
			<SplashImageContainer>
				<Image
					src="/assets/alto-splash.png"
					alt="JAZZ"
					fill
					priority
				/>
			</SplashImageContainer>
		</Container>
	)
}