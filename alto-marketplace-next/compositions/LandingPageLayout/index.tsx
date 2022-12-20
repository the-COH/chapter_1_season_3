import styled from "styled-components"

import { useWindowWidth } from "../../hooks"
import { useRecentMints, useRecentSales, useWhitelistedCollections } from "../../queries/hooks"

import { CenteredFlex, Flex, Text } from "../../styles"
import { Header } from "./Header"
import { Timing } from "./Timing"
import { Quote } from "./Quote"
import { PopularCollections } from "../../components/PopularCollections"
import { Slider } from "../../components/Slider"
import { Triangles } from "../../components/Triangles"
import { AmountWithCurrency } from "../../components/CurrencySymbol"
import { NFTCard } from "../../components/NFTCard"
import { CollectionCard } from "../../components/CollectionCard"

const Container = styled(Flex)`
	width: 100%;
	max-width: 100vw;
	padding: 24px;
	padding-bottom: 48px;
	overflow: hidden;

	@media(min-width: 576px) {
		padding: 24px 48px;
		padding-bottom: 96px;
	}
`
const TriangleContainer = styled(CenteredFlex)`
	position: absolute;
	width: 100vw;
	height: 100vh;
	overflow-x: hidden;
	pointer-events: none;
`

export function LandingPageLayout() {
	const { widerThanSmall } = useWindowWidth()

	const {
		collections,
		loading,
		error
	} = useWhitelistedCollections() // TODO: probably better to pre-fetch this server-side?

	const {
		recentSales,
		loading: recentSalesLoading,
		error: recentSalesError
	} = useRecentSales()

	const {
		recentMints,
		loading: recentMintsLoading,
		error: recentMintsError
	} = useRecentMints()

	return (<>
		<TriangleContainer>
			<Triangles
				thickness={widerThanSmall ? 30: 10}
				color="rgba(237, 233, 215, 0.05)"
				triangles={[
					{
						position: { left: 40, top: 0 },
						rotDuration: 60,
						width: widerThanSmall ? 600: 200
					},
					{
						position: { right: 40, top: 70 },
						rotDuration: 73,
						width: widerThanSmall ? 160: 54
					},
					{
						position: { right: 20, top: 240 },
						rotDuration: -41,
						width: widerThanSmall ? 360: 120
					}
				]}
			/>
		</TriangleContainer>
		<Container
			column
			align="center"
			gap={96}>
			<Header/>
			<Slider
				heading="Featured Collections"
				error={error}
				loading={loading}
				items={collections}
				Item={(collection, i) => (
					<CollectionCard
						key={i}
						collection={collection}
					/>
				)}
				itemWidth={384}
			/>
			<PopularCollections/>
			<Slider
				heading="Recent Sales"
				error={recentSalesError}
				loading={recentSalesLoading}
				items={recentSales.map(({ token }) => token)}
				Item={(item, i) => (
					<NFTCard
						key={i}
						nft={item}
						collection={item.contract}
						footerContent={(
							<CenteredFlex gap={12}>
								<Text>Sale Price:</Text>
								<AmountWithCurrency
									amount={recentSales[ i ].price}
									currency={recentSales[ i ].currency}
								/>
							</CenteredFlex>
						)}
					/>
				)}
			/>
			<Slider
				heading="Recent Mints"
				error={recentMintsError}
				loading={recentMintsLoading}
				items={recentMints.map(({ token }) => token)}
				Item={(item, i) => (
					<NFTCard
						key={i}
						nft={item}
						collection={item.contract}
						footerContent={(
							<Timing timestamp={recentMints[ i ]?.timestamp}/>
						)}
					/>
				)}
			/>
			<Quote/>
		</Container>
	</>)
}