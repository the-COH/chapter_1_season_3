import styled from "styled-components"

import { useWhitelistedCollections } from "../../queries/hooks"

import { Flex } from "../../styles"
import { Seo } from "../../components/Seo"
import { Slider } from "../../components/Slider"
import { PopularCollections } from "../../components/PopularCollections"
import { CollectionCard } from "../../components/CollectionCard"

const Container = styled(Flex)`
	padding: 48px 24px;
	
	@media(min-width: 576px) {
		padding: 96px 48px;
	}
`

export default function CollectionPage() {
	const {
		collections,
		loading,
		error
	} = useWhitelistedCollections() // TODO: probably better to pre-fetch this server-side?

	return (<>
		<Seo/>
		<Container
			width="100%"
			column
			gap={48}>
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
		</Container>
	</>)
}