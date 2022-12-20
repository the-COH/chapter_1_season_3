import styled from "styled-components"

import { ReactChildren } from "../types"

import { Flex } from "../styles"
import { CursorCanvas } from "./CursorCanvas"

const Container = styled(Flex)`
	margin-top: 80px;
	width: 100vw;
	min-height: calc(100vh - 80px);
`

export function PageWrapper({ children }: ReactChildren) {
	return (
		<Container
			column
			align="center">
			<CursorCanvas/>
			{children}
		</Container>
	)
}