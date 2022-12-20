import { CTAButton, Flex, Text } from "../../styles"
import { PassLink } from "../../components/PassLink"

export function CollectionCreationPrompt() {
	return (
		<Flex
			column
			align="center"
			gap={24}>
			<Text
				as="h2"
				fontSize={18}
				style={{ margin: 0 }}>
				No Creations Yet... 🤷‍♂️
			</Text>
			<Text>Upload your first collectible</Text>
			<PassLink href="/mint">
				<CTAButton as="a">Create Token</CTAButton>
			</PassLink>
		</Flex>
	)
}