import { ReactNode } from "react"
import styled from "styled-components"

import { CenteredFlex, Flex, Text } from "../styles"

const Container = styled(CenteredFlex)`
	position: fixed;
	top: 0px;
	left: 0px;
	right: 0px;
	bottom: 0px;
	z-index: 9999;
`

const Overlay = styled(Container)`
	background-color: rgba(0,0,0,0.6);
	z-index: 9998;
`

const ModalContainer = styled(Flex)`
	width: 400px;
	max-width: calc(100vw - 40px);
	padding: 32px 0;
	background-color: ${({ theme }) => theme.backgroundColor.primary};
	border-radius: ${({ theme }) => theme.borderRadius.large};
	box-shadow: ${({ theme }) => theme.boxShadow.dark};
`

const ModalHeader = styled(Flex)`
	width: 100%;
	padding: 0 32px;
	& > *:last-of-type {
		cursor: pointer;
	}
`

const ModalBody = styled(Flex)`
	width: 100%;
	padding: 0 32px;
`

type ModalProps = {
	onClose: () => void,
	title?: string,
	content: ReactNode | ReactNode[] | JSX.Element | string
}

export function Modal({ onClose, title, content }: ModalProps) {
	return (<>
		<Overlay onClick={onClose}/>
		<Container>
			<ModalContainer
				column
				gap={32}>
				{title && (
					<ModalHeader
						justify="space-between"
						align="center">
						<Text fontSize={24}>{title}</Text>
						<Text onClick={onClose}>x</Text>
					</ModalHeader>
				)}
				<ModalBody
					column
					gap={12}>
					{content}
				</ModalBody>
			</ModalContainer>
		</Container>
	</>)
}