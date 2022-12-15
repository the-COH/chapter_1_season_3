import styled from "styled-components"
import { ConnectButton as RKConnectButton } from "@rainbow-me/rainbowkit";

import { useAuth } from "../hooks";

import { CenteredFlex, Text } from "../styles"
import { PassLink } from "./PassLink";

const Container = styled(CenteredFlex)<{ isConnected: boolean }>`
	height: 40px;
	padding: ${({ isConnected }) => isConnected ? "0px": "8px"};
	border-radius: 999px;
	background-color: ${({ theme }) => theme.accentColor.jazzBlue};
	color: ${({ theme }) => theme.backgroundColor.primary};
	font-size: 12px;
	font-weight: 700;
	cursor: pointer;
	& > * {
		height: 40px;
	}

	@media(min-width: 576px) {
		height: 48px;
		padding: ${({ isConnected }) => isConnected ? "0px": "12px 16px"};
		font-size: 14px;
		& > * {
			height: 48px;
		}
	}
`
const AddressContainer = styled(CenteredFlex)`
	padding: 0 12px;
	@media(min-width: 576px) {
		padding: 0 24px;
	}
`
const DisconnectButton = styled(CenteredFlex)`
	width: 40px;
	height: 40px;
	border-top-right-radius: 20px;
	border-bottom-right-radius: 20px;
	padding-right: 4px;
	border: 2px solid ${({ theme }) => theme.accentColor.jazzBlue};

	color: ${({ theme }) => theme.accentColor.jazzBlue};
	background-color: ${({ theme }) => theme.backgroundColor.primary};
	cursor: pointer;

	@media(min-width: 576px) {
		width: 48px;
		height: 48px;
		border-top-right-radius: 24px;
		border-bottom-right-radius: 24px;
	}
`

export function ConnectButton() {
	const { logout } = useAuth()

	return (
		<CenteredFlex>
			<RKConnectButton.Custom>
				{({ account, chain, openChainModal, openConnectModal, mounted}) => {
					const isConnected = mounted && account && chain
					const isOnChain = chain && chain.id === 7700

					return (
						<Container
							isConnected={!!isConnected}
							onClick={!isConnected
								? openConnectModal
								: !isOnChain
									? openChainModal
									: undefined
							}>
							{isConnected && isOnChain
								? (
									<PassLink href="/profile">
										<AddressContainer as="a">
											<Text whiteSpace="nowrap">
												{account.displayName}
											</Text>
										</AddressContainer>
									</PassLink>
								)
								: (
									<AddressContainer>
										<Text whiteSpace="nowrap">
											{!isConnected ? "Connect Wallet": "Change Network"}
										</Text>
									</AddressContainer>
								)
							}
							{isConnected && (
								<DisconnectButton
									title="Disconnect Wallet"
									onClick={() => logout()}>
									x
								</DisconnectButton>
							)}
						</Container>
					)
				}}
			</RKConnectButton.Custom>
		</CenteredFlex>
	)
}