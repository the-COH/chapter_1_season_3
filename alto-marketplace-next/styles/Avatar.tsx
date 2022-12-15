import styled, { css } from "styled-components"

export const Avatar = styled.div<{ src: string, size?: number, color?: string, radius?: string, border?: string }>`
	width: ${({ size = 60 }) => size}px;
	height: ${({ size = 60 }) => size}px;
	border-radius: ${({ radius = "50%" }) => radius};
	background: url('${({ src }) => src}');
	background-position: center;
	background-size: cover;
	overflow: hidden;
	background-color: ${({ color = "transparent" }) => color};
	${({ border }) => border && css`border: ${border};`}
	flex-shrink: 0;
`