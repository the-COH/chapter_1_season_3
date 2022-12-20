import { useMemo, useState } from "react"
import styled from "styled-components"

import { CenteredFlex, Flex, Grid, Text } from "../../styles"
import { CreateSoloForm, CreateSoloFormState } from "./CreateSoloForm"
import { SelectionBox } from "./SelectBox"

const Container = styled(Flex)`
	max-width: 572px;

	@media(min-width: 1024px) {
		max-width: 996px;
	}
`

const StepContainer = styled(Flex)`
	color: ${({ theme }) => theme.textColor.secondary};
`
const StepText = styled(Text).attrs(() => ({
	fontWeight: "lighter",
	textDecoration: "underline"
}))`
	cursor: pointer;
`

const MainGrid = styled(Grid)`
	max-width: 1024px;
`

const AltoSVG = styled.svg`
	& > * {
		stroke: ${({ theme }) => theme.accentColor.cream};
	}
	& > circle {
		fill: ${({ theme }) => theme.backgroundColor.primary};
	}
`

type CreateSoloWizardProps = {
	onSubmit: (values: CreateSoloFormState) => void,
	onCancel: () => void
}

enum SoloType {
	SINGLE = "Single",
	MULTIPLE = "Multiple"
}

export function CreateSoloWizard({ onSubmit, onCancel }: CreateSoloWizardProps) {
	const [ soloType, setSoloType ] = useState<SoloType>()

	const { heading, subheading, content } = useMemo(() => {
		switch(soloType) {
			case SoloType.SINGLE:
				return {
					heading: "Create New One-of-one NFT",
					subheading: "Mint one, and only one copy of your NFT on Canto. Required Fields*",
					content: (
						<CreateSoloForm
							multiple={false}
							onSubmit={onSubmit}
						/>
					)
				}
			case SoloType.MULTIPLE:
				return {
					heading: "Create New NFTs",
					subheading: "Mint multiple copies of your NFT on Canto. Required Fields*",
					content: (
						<CreateSoloForm
							multiple={true}
							onSubmit={onSubmit}
						/>
					)
				}
			default: 
				return {
					heading: "Choose Type",
					subheading: `Choose "Single" to mint a one-of-one NFT or "Multiple" to mint and sell multiple copies of the same artwork.`,
					content: (
						<MainGrid
							columns={"1fr 1fr"}
							gap={48}>
							<SelectionBox
								onSelect={() => setSoloType(SoloType.SINGLE)}
								image={(
									<AltoSVG width="112" height="112" viewBox="0 0 50 49" fill="none" xmlns="http://www.w3.org/2000/svg">
										<circle cx="25.2938" cy="24.6429" r="23.8143" stroke="black"/>
										<path d="M25.2812 0.747314L7.44629 40.3792" stroke="black"/>
										<path d="M25.3672 0.833496L43.374 40.293" stroke="black"/>
										<path d="M11.668 30.7295H38.8936" stroke="black"/>
									</AltoSVG>
								)}
								label="Single"
								copy="Mint a one-of-one NFT"
							/>
							<SelectionBox
								onSelect={() => setSoloType(SoloType.MULTIPLE)}
								image={(
									<CenteredFlex>
										<AltoSVG width="112" height="112" viewBox="0 0 50 49" fill="none" style={{ marginRight: "-56px" }}>
											<circle cx="25.2938" cy="24.6429" r="23.8143" stroke="black"/>
											<path d="M25.2812 0.747314L7.44629 40.3792" stroke="black"/>
											<path d="M25.3672 0.833496L43.374 40.293" stroke="black"/>
											<path d="M11.668 30.7295H38.8936" stroke="black"/>
										</AltoSVG>
										<AltoSVG width="112" height="112" viewBox="0 0 50 49" fill="none"  style={{ marginRight: "-56px" }}>
											<circle cx="25.2938" cy="24.6429" r="23.8143" stroke="black"/>
											<path d="M25.2812 0.747314L7.44629 40.3792" stroke="black"/>
											<path d="M25.3672 0.833496L43.374 40.293" stroke="black"/>
											<path d="M11.668 30.7295H38.8936" stroke="black"/>
										</AltoSVG>
										<AltoSVG width="112" height="112" viewBox="0 0 50 49" fill="none">
											<circle cx="25.2938" cy="24.6429" r="23.8143" stroke="black"/>
											<path d="M25.2812 0.747314L7.44629 40.3792" stroke="black"/>
											<path d="M25.3672 0.833496L43.374 40.293" stroke="black"/>
											<path d="M11.668 30.7295H38.8936" stroke="black"/>
										</AltoSVG>
									</CenteredFlex>
								)}
								label="Multiple"
								copy="Mint multiple copies of an NFT"
								disabled
							/>
						</MainGrid>
					)	
				}
		}
	}, [ soloType, onSubmit ])

	return (<>
		<Container
			width="100%"
			column
			gap={48}>
			<Flex
				width="100%"
				column
				gap={12}>
				<StepContainer gap={4}>
					<StepText onClick={onCancel}>Solo</StepText>
					<Text>{`>`}</Text>
					<StepText onClick={() => setSoloType(undefined)}>
						{!soloType ? `Choose Type`: `${soloType} NFT`}
					</StepText>
					{soloType && (<>
						<Text>{`>`}</Text>
						<StepText>Create New NFT</StepText>
					</>)}
				</StepContainer>
				<Text as="h1" style={{ margin: 0 }}>{heading}</Text>
				<Text>{subheading}</Text>
			</Flex>
			{content}
		</Container>
	</>)
}