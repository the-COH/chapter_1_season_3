import { useState } from "react"
import Image from "next/image"
import styled from "styled-components"

import { useWindowWidth } from "../../hooks"

import { CenteredFlex, Flex, Grid, Text } from "../../styles"
import { SelectionBox } from "./SelectBox"
import { CreateSoloWizard } from "./CreateSoloWizard"
import { MintModal } from "./MintModal"
import { CreateSoloFormState } from "./CreateSoloForm"

const Container = styled(Flex)`
	padding: 24px;
	margin-bottom: 124px;
	max-width: 572px;
	
	@media(min-width: 576px) {
		padding: 48px;
	}
	@media(min-width: 1024px) {
		max-width: 996px;
	}
`

const NewItemGrid = styled(Grid)`
	max-width: 1024px;
`
const SelectionImage = styled(CenteredFlex)`
	width: 240px;
	height: 240px;
	background-color: ${({ theme }) => theme.accentColor.cream};
	border-radius: 999px;
	overflow: hidden;
`

enum CreateOption {
	SOLO = "SOLO",
	DUET = "DUET"
}

export default function MintWizard() {
	const { widerThanMedium } = useWindowWidth()

	const [ modalOpen, setModalOpen ] = useState(false)

	const [ createOption, setCreateOption ] = useState<CreateOption>()

	const [ mintValues, setMintValues ] = useState<CreateSoloFormState>()
	
	return (<>
		{modalOpen && mintValues && (
			<MintModal
				{...mintValues}
				onClose={() => setModalOpen(false)}
				resetMintWizard={() => {
					setCreateOption(undefined)
					setMintValues(undefined)
				}}
			/>
		)}
		<Container
			column
			align="center"
			width="100%"
			gap={48}>
			{!createOption
				? (
					<Flex
						column
						width="100%"
						gap={48}>
						<Text as="h1">Create New Item</Text>
						<NewItemGrid
							columns={widerThanMedium ? "1fr 1fr": "1fr"}
							rows="1fr"
							gap={48}>
							<SelectionBox
								onSelect={() => setCreateOption(CreateOption.SOLO)}
								image={(
									<SelectionImage>
										<Image
											src="/assets/silhouette.png"
											alt="JAZZ"
											width={200}
											height={171}
											style={{ marginTop: "76px" }}
										/>
									</SelectionImage>
								)}
								label="Solo"
								copy="Create a new NFT or NFT Collection and set your creator royalty fee. Every time the item(s) is bought/sold, you will receive a portion of the sale."
							/>
							<SelectionBox
								onSelect={() => setCreateOption(CreateOption.DUET)}
								image={(
									<SelectionImage>
										<Image
											src="/assets/duet-silhouette.png"
											alt="JAZZ2"
											width={195}
											height={218}
											style={{ marginTop: "24px" }}
										/>
									</SelectionImage>
								)}
								label="Duet"
								copy="Coming Soon..."
								disabled
							/>
						</NewItemGrid>
					</Flex>
				)
				: createOption === CreateOption.SOLO
					? (
						<CreateSoloWizard
							onSubmit={(values: CreateSoloFormState) => {
								setMintValues(values)
								setModalOpen(true)
							}}
							onCancel={() => setCreateOption(undefined)}
						/>
					)
					: null
			}
		</Container>
	</>)
}