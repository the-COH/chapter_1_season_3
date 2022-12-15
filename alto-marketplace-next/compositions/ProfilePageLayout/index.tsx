import { useMemo, useState } from "react"
import styled from "styled-components"
import { isSameAddress } from "../../utils"
import { ERC721Collection, Filter, FilterOption, QuerySortOptions } from "../../types"

import { useAuth } from "../../hooks"

import { useTokensByOwner } from "../../queries/hooks"

import { Flex, Text, TransparentButton } from "../../styles"
import { ProfileCard } from "./ProfileCard"
import { CollectionCreationPrompt } from "./CollectionCreationPrompt"
import { SettingsModal } from "./SettingsModal"
import { ConnectButton } from "../../components/ConnectButton"
import { ErrorOrEmptyPrompt } from "../../components/ErrorOrEmptyPrompt"
import { CollectionWithFilteringAndSorting } from "../../components/CollectionWithFilteringAndSorting"

const Container = styled(Flex)`
	width: 100%;
`

const HeaderContainer = styled(Flex)`
	padding: 0px 12px;

	@media(min-width: 768px) {
		padding: 48px;
	}
`

const SettingsButton = styled(TransparentButton)`
	padding-left: 8px;
	font-size: 16px;
	gap: 12px;
	& g {
		fill: ${({ theme }) => theme.accentColor.cream};
	}
`

type ProfilePageLayoutProps = {
	ownerAddress?: string
}

export function ProfilePageLayout({ ownerAddress }: ProfilePageLayoutProps) {
	const { address: connectedAddress = "" } = useAuth()

	ownerAddress = ownerAddress || connectedAddress

	const [ sortByTokens, setSortByTokens ] = useState<QuerySortOptions | undefined>(undefined)

	const { tokens, loading, error } = useTokensByOwner({
		ownerAddress,
		sortByTokens
	})
	
	const contractFilter = useMemo(() => {
		if (!tokens.length) return undefined

		return [
			new Filter({
				label: "Collection",
				type: "boolean",
				options: tokens.reduce((arr, { contract }) => {
					const { name, id } = (contract as ERC721Collection)
					if (!arr.find(({ label }) => label === name)) arr.push({
						label: name,
						value: false,
						filter: (token, value) => !value ? true: isSameAddress(id, token.contract?.id)
					})
					return arr
				}, [] as FilterOption[])
			})
		]
	}, [ tokens ])

	const isOwnerConnected = connectedAddress && isSameAddress(connectedAddress, ownerAddress)

	const [ modalOpen, setModalOpen ] = useState(false)

	if (!connectedAddress && !ownerAddress) return (
		<ErrorOrEmptyPrompt>
			<Text>Connect your wallet to view your profile</Text>
			<ConnectButton/>
		</ErrorOrEmptyPrompt>
	)

	return (<>
		<SettingsModal
			modalOpen={modalOpen}
			setModalOpen={setModalOpen}
		/>
		<Container
			column
			align="center">
			<HeaderContainer
				width="100%"
				column
				align="center"
				gap={12}>
				<ProfileCard address={ownerAddress}>
					{isOwnerConnected && (
						<SettingsButton onClick={() => setModalOpen(true)}>
							<svg width="24" height="24" viewBox="0 0 800.000000 800.000000">
								<g transform="translate(0.000000,800.000000) scale(0.100000,-0.100000)"
								stroke="none">
									<path d="M3140 7884 c-46 -20 -74 -47 -94 -92 -10 -22 -47 -253 -91 -562 -51
									-353 -79 -526 -88 -529 -6 -2 -82 -39 -167 -82 -141 -71 -352 -200 -440 -269
									l-35 -28 -485 194 c-267 107 -502 199 -522 205 -51 13 -118 -5 -162 -45 -41
									-36 -830 -1397 -847 -1459 -8 -29 -6 -51 5 -92 20 -68 18 -66 500 -440 l387
									-300 -6 -45 c-26 -214 -26 -464 0 -680 l6 -45 -387 -300 c-448 -348 -472 -368
									-490 -412 -19 -44 -18 -127 2 -166 38 -74 798 -1384 813 -1401 29 -33 88 -56
									143 -56 45 1 128 31 547 199 l494 198 56 -42 c135 -102 342 -224 504 -296 50
									-23 93 -43 95 -44 1 -1 36 -238 77 -526 44 -308 81 -539 91 -561 20 -46 48
									-72 96 -93 33 -13 140 -15 860 -15 777 0 825 1 863 19 54 24 90 69 104 128 6
									26 43 273 82 548 39 275 71 500 72 501 1 1 40 18 86 38 148 65 356 187 510
									298 l61 45 482 -194 c266 -106 500 -198 521 -204 50 -13 133 10 169 48 38 39
									824 1403 838 1451 12 47 2 106 -26 151 -11 16 -208 177 -439 358 -361 283
									-420 332 -418 353 1 14 7 100 14 193 10 133 10 201 0 335 -7 92 -13 178 -14
									192 -2 21 57 70 414 350 229 179 427 339 439 357 34 49 43 107 27 162 -8 25
									-194 356 -414 735 -307 531 -408 697 -436 720 -31 25 -49 31 -100 34 -62 4
									-70 1 -559 -195 l-497 -200 -88 63 c-158 114 -427 264 -565 316 -4 2 -39 228
									-77 503 -39 275 -76 522 -82 548 -14 59 -50 104 -104 128 -38 18 -86 19 -865
									18 -715 0 -830 -2 -860 -15z m1140 -2549 c251 -56 480 -178 661 -352 195 -188
									319 -403 387 -671 25 -100 27 -121 26 -317 0 -202 -2 -214 -31 -325 -71 -264
									-190 -468 -381 -652 -185 -178 -415 -300 -672 -355 -120 -26 -420 -25 -540 1
									-273 59 -496 180 -690 375 -58 58 -129 140 -157 182 -103 150 -180 331 -220
									511 -25 117 -25 419 0 536 124 563 553 978 1117 1078 102 18 399 12 500 -11z"/>
								</g>
							</svg>
							<Text>Settings</Text>
						</SettingsButton>
					)}
				</ProfileCard>
			</HeaderContainer>
			{isOwnerConnected && !error && !loading && !tokens.length
				? <CollectionCreationPrompt/>
				: (
					<CollectionWithFilteringAndSorting
						tokens={tokens}
						loading={loading}
						error={error}
						collectionFilters={contractFilter}
						showCount={true}
						setSortByTokens={setSortByTokens}
					/>
				)
			}
		</Container>
	</>)
}