import styled from "styled-components"

const Container = styled.div`
	width: 100%;
	padding: 8px 12px;
	border-radius: 999px;
	overflow-x: scroll;
	text-align: start;
	background-color: ${({ theme }) => theme.accentColor.cream};
	color: black;
`

export function ErrorDetail({ error }: { error: any }) {
	return (
		<Container>
			<code><pre>ERROR: {error}</pre></code>
		</Container>
	)
}