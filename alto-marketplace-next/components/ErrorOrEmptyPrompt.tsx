import styled from "styled-components"

import { ReactChildren } from "../types"

import { CenteredFlex, FlexProps } from "../styles"

const Container = styled(CenteredFlex)`
	width: 100vw;
	min-height: 200px;
`

type PromptProps = FlexProps & ReactChildren

export function ErrorOrEmptyPrompt({ children, ...props }: PromptProps) {
	return (
		<Container
			column
			gap={16}
			{...props}>
			{children}
		</Container>
	)
}