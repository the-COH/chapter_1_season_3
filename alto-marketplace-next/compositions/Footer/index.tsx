import Image from "next/image"
import { useCallback, useReducer } from "react"
import styled, { useTheme } from "styled-components"
import * as Tone from "tone"
import { DISCORD_URL, TWITTER_URL } from "../../utils/env-vars"

import { useWindowWidth } from "../../hooks"

import { Button, CenteredFlex, Flex, Separator, Text } from "../../styles"
import { Piano } from "./Piano"
import { PassLink } from "../../components/PassLink"
import { ExternalLink } from "../../components/ExternalLink"
import { SocialLink, SocialSite } from "../../components/SocialLink"

const Container = styled(CenteredFlex)`
	width: 100%;
	padding-top: 80px;
	font-size: 14px;
`

const ButtonContainer = styled(CenteredFlex)`
	padding-bottom: 80px;
`
const CreamButton = styled(Button)`
	gap: 12px;
	padding: 12px 18px;
	display: flex;
	align-items: center;
	color: ${({ theme }) => theme.backgroundColor.primary} !important;
	background-color: ${({ theme }) => theme.accentColor.cream} !important;
	margin-bottom: 24px;
`

const FooterContainer = styled(Flex)`
	background-color: ${({ theme }) => theme.backgroundColor.tertiary};
	color: ${({ theme }) => theme.backgroundColor.primary};
	padding-top: 24px;
	font-size: 12px;
`
const FooterLogo = styled(CenteredFlex)`
	width: 50px;
	height: 50px;
	margin: 24px;
`
const FooterBody = styled(Flex)`
	padding: 0 24px;
`
const BodyContainer = styled(Flex).attrs(() => ({
	column: true,
	gap: 12
}))`
	max-width: 250px;
	padding-bottom: 24px;
	@media(min-width: 1024px) {
		max-width: 340px;
	}
`
const BodyHeader = styled(Text)`
	font-size: 18px;
	font-weight: 700;
`
const SocialSilhouetteContainer = styled(Flex)`
	font-size: 10px;
	/* margin-left: 300px; */
	& path {
		fill: ${({ theme }) => theme.backgroundColor.primary};
	}

	@media(min-width: 1024px) {
		margin-left: 0px;
	}
`
const FooterBottom = styled(Flex)`
	padding: 24px;
`

export function Footer() {
	const { widerThanMedium, widerThanLarge } = useWindowWidth()
	const theme = useTheme()

	const [ hasApprovedAudio, approveAudio ] = useReducer(() => true, false)

	const onClick = useCallback(async () => {
		await Tone.start()
		approveAudio()
	}, [])

	return (
		<Container
			as="footer"
			column>
			{!hasApprovedAudio
				? (
					<ButtonContainer>
						<CreamButton onClick={onClick}>
							<svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M7.16679 15.1501V4.39882C7.16679 3.97171 7.47224 3.60572 7.89246 3.52932L16.3672 1.98846C16.6384 1.93914 16.8881 2.14751 16.8881 2.42321V13.3826M7.16679 15.1501C7.16679 16.6144 5.97977 17.8013 4.51552 17.8013C3.05127 17.8013 1.86426 16.6144 1.86426 15.1501C1.86426 13.6858 3.05127 12.4988 4.51552 12.4988C5.97977 12.4988 7.16679 13.6858 7.16679 15.1501ZM16.8881 13.3826C16.8881 14.8469 15.7011 16.0338 14.2368 16.0338C12.7725 16.0338 11.5856 14.8469 11.5856 13.3826C11.5856 11.9183 12.7725 10.7313 14.2368 10.7313C15.7011 10.7313 16.8881 11.9183 16.8881 13.3826Z" stroke="#1D1D1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
							<Text>View our Private Keys</Text>
						</CreamButton>
					</ButtonContainer>
				)
				: <Piano/>
			}
			<FooterContainer
				column
				width="100%"
				align={widerThanLarge ? "stretch": "center"}>
				<FooterLogo>
					<svg width="50" height="49" viewBox="0 0 50 49" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="25.2938" cy="24.6429" r="23.8143" stroke="black"/>
						<path d="M25.2812 0.747314L7.44629 40.3792" stroke="black"/>
						<path d="M25.3672 0.833496L43.374 40.293" stroke="black"/>
						<path d="M11.668 30.7295H38.8936" stroke="black"/>
					</svg>
				</FooterLogo>
				<FooterBody
					width="100%"
					justify="space-between"
					column={!widerThanLarge}
					gap={widerThanLarge ? 0: 72}>
					<Flex
						gap={widerThanLarge ? 72: 24}
						column={!widerThanMedium}
						justify={widerThanMedium ? "center": "stretch"}
						align={widerThanMedium ? "flex-start": "center"}>
						<BodyContainer>
							<BodyHeader>Alto Market</BodyHeader>
							<Text>
								<Text
									as="span"
									fontWeight={700}>
									Free public NFT marketplace for collectibles and intellectual property on Canto. Buy, sell, and discover exclusive digital items.
								</Text>
								<br></br><br></br>
								Packaging collectibles and intellectual property as NFTs allows for immutability, permissionless non-custodial trading, and deep liquidity via DeFi. 
								While Alto does not charge fees, creators can choose to set their own royalty and licensing rates for their collections.
							</Text>
						</BodyContainer>
						<Flex gap={72}>
							<BodyContainer>
								<BodyHeader>Market</BodyHeader>
								<PassLink href="/collections">
									<Text as="a">All Collections</Text>
								</PassLink>
								<PassLink href="/profile">
									<Text as="a">My Profile</Text>
								</PassLink>
								<Text textDecoration="line-through">Pockets</Text>
								<Text textDecoration="line-through">Studio</Text>
								<Text textDecoration="line-through">Dixieland</Text>
							</BodyContainer>
							<BodyContainer>
								<BodyHeader>Resources</BodyHeader>
								<ExternalLink href="https://alto.canny.io/request-nft-collection-listing">
									List New Collection
								</ExternalLink>
								<ExternalLink href="https://alto.canny.io/requests">
									Request Features
								</ExternalLink>
								<ExternalLink href="https://alto.canny.io/report-bugs">
									Report Bugs
								</ExternalLink>
								<ExternalLink href="https://alto-market.gitbook.io/alto-market/">
									Docs
								</ExternalLink>
								<ExternalLink href="https://docs.google.com/document/d/1LXBm_tfuROgyqx_iF5rYTgqkF5fCehfpcNrqGQi7vYo/edit?usp=sharing">
									Terms of Service
								</ExternalLink>
								<ExternalLink href="https://app.termly.io/document/privacy-policy/aaef0c48-0296-4076-af99-a2c107087ca0">
									Privacy Policy
								</ExternalLink>
							</BodyContainer>
						</Flex>
					</Flex>
					<SocialSilhouetteContainer
						justify={widerThanLarge ? "flex-end": "center"}
						align="flex-start"
						gap={18}>
						<SocialLink
							type={SocialSite.DISCORD}
							link={DISCORD_URL || ""}
							scale={1.4}
							withLabel
							textTransform="uppercase"
						/>
						<SocialLink
							type={SocialSite.TWITTER}
							link={TWITTER_URL || ""}
							scale={1.4}
							withLabel
							textTransform="uppercase"
						/>
						<Image
							src="/assets/silhouette.png"
							alt="silh"
							width={widerThanMedium ? 300: 200}
							height={widerThanMedium ? 256: 170}
							style={{ marginTop: "12px", marginLeft: "-12px", alignSelf: "flex-end" }}
						/>
					</SocialSilhouetteContainer>
				</FooterBody>
				<Separator color={(theme as any).backgroundColor.primary}/>
				<FooterBottom
					width="100%"
					justify="space-between"
					align="center">
					<Text>© 2022 Alto Market</Text>
					<Flex
						column={!widerThanMedium}
						align="flex-end">
						<Text as="span">{`“Ain't no wrong notes in Jazz, Jimmy.”`}</Text>
						<Text as="span">&nbsp;{`- Cirby Canto`}</Text>
					</Flex>
				</FooterBottom>
			</FooterContainer>
		</Container>
	)
}