import styled from "styled-components"

export const Orb = styled.div<{ size?: number }>`
	width: ${({ size = 32 }) => size}px;
	height: ${({ size = 32 }) => size}px;
	border-radius: 50%;
	background: radial-gradient(
		75.29% 75.29% at 64.96% 24.36%,
		rgb(239, 254, 185) 15.62%,
		rgb(224, 246, 152) 39.58%,
		rgb(189, 230, 107) 72.92%,
		rgb(160, 216, 65) 90.62%,
		rgb(158, 215, 66) 100%
	);
`