import styled, { useTheme } from "styled-components"

import { useWindowWidth } from "../../hooks"

import { CenteredFlex, Text } from "../../styles"
import { Triangles } from "../../components/Triangles"

const Container = styled(CenteredFlex)`
	max-width: 1000px;
	margin: 24px 0;
	position: relative;
`

export function Quote() {
	const theme = useTheme()
	const { widerThanSmall, widerThanMedium } = useWindowWidth()

	return (
		<Container
			column
			gap={48}>
			<Text
				fontSize={widerThanMedium ? 52: 36}
				fontWeight={700}
				lineHeight={widerThanMedium ? 72: 44}>
				{`"Jazz is all about being free...just like `}
				<Text as="span" color={(theme as any).accentColor.jazzBlue}>{`Alto's free public NFT marketplace`}</Text>
				{` on Canto's EVM-compatible Cosmos app chain fork."`}
			</Text>
			<Text
				fontSize={20}
				fontWeight={700}
				lineHeight={26}
				textAlign="right"
				style={{ width: "100%" }}>
				{`- Jimmy "Rhythm Shrimp" Crimbo`}
				<br></br>
				<Text
					fontWeight="lighter"
					fontStyle="italic">
					{`Local Jazz Legend`}
				</Text>
			</Text>
			<Triangles
				thickness={widerThanSmall ? 30: 10}
				color="rgba(237, 233, 215, 0.05)"
				triangles={[
					{
						position: {
							right: widerThanSmall ? -340: 0,
							top: widerThanSmall ? -120: -60
						},
						rotDuration: 60,
						width: widerThanSmall ? 600: 200
					},
					{
						position: {
							left: widerThanSmall ? -140: 0,
							top: widerThanSmall ? -60: 200
						},
						rotDuration: 73,
						width: widerThanSmall ? 160: 54
					},
					{
						position: widerThanSmall
							? { left: -220, top: 140 }
							: { left: 0, bottom: -20 },
						rotDuration: -41,
						width: widerThanSmall ? 360: 120
					}
				]}
			/>
		</Container>
	)
}