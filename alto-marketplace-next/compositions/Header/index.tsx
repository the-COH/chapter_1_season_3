import Image from "next/image"
import styled from "styled-components"
import { APP_LOGO } from "../../utils/env-vars"

import { useWindowWidth } from "../../hooks"

import { CenteredFlex, Flex, Text } from "../../styles"
import { ConnectButton } from "../../components/ConnectButton"
import { PassLink } from "../../components/PassLink"
import { YTSoundButton } from "./YTSoundButton"
import { ExternalLink } from "../../components/ExternalLink"

const Container = styled(Flex)`
	position: fixed;
	top: 0px;
	left: 0px;
	right: 0px;
	height: 80px;
	padding: 12px 20px;
	background-color: ${({ theme }) => theme.backgroundColor.primary}cc;
	z-index: 10;
`

export function Header() {
	const { widerThanSmall, widerThanMedium, widerThanLarge } = useWindowWidth()

	return (
		<Container
			as="header"
			justify="space-between"
			align="center">
			<PassLink href="/">
				<CenteredFlex
					as="a"
					gap={12}>
					<Image
						src={APP_LOGO}
						alt="ALTO"
						width={40}
						height={40}
					/>
					<Flex column={!widerThanMedium}>
						<Text>Alto&nbsp;</Text>
						<Text>Market</Text>	
					</Flex>
				</CenteredFlex>
			</PassLink>
			<CenteredFlex gap={widerThanLarge ? 36: 24}>
				{widerThanMedium && (<>
					{/* <PassLink href="/launchpad">
						<Text as="a">Launchpad</Text>
					</PassLink> */}
					<PassLink href="/mint">
						<Text as="a">Create</Text>
					</PassLink>
				</>)}
				{widerThanSmall && (
					<ExternalLink href="https://alto.canny.io/request-nft-collection-listing">
						List New Collection
					</ExternalLink>
				)}
				<YTSoundButton/>
				<ConnectButton/>
			</CenteredFlex>
		</Container>
	)
}