import styled, { css } from "styled-components"

export const Button = styled.button<{ fitContent?: boolean }>`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 12px 24px;
	border-radius: 100px;
	background-color: #373737;
	&:hover {
		opacity: 0.75;
	}
	cursor: pointer;
	${({ fitContent = false }) => fitContent && css`width: fit-content;`}
`

export const TransparentButton = styled(Button)`
	background-color: transparent;
	border: ${({ theme }) => theme.border.thin};
	padding: 8px 16px;
	&:hover {
		opacity: 1;
	}
`

export const CTAButton = styled(Button)`
	background-color: ${({ theme }) => theme.backgroundColor.tertiary};
	color: ${({ theme }) => theme.backgroundColor.primary};
	&:disabled {
		background-color: #373737;
	}
`