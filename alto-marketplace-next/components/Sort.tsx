import styled from "styled-components"

import { Button, Flex, Text } from "../styles"

const Container = styled(Flex)<{ visible: boolean }>`
	position: absolute;
	top: 50%;
	left: -1px;
	width: calc(100% + 2px);
	background-color: ${({ theme }) => theme.backgroundColor.primary};
	border: ${({ theme }) => theme.border.thin};
	border-top: none;
	border-bottom-left-radius: 18px;
	border-bottom-right-radius: 18px;
	padding-top: 24px;
	display: ${({ visible }) => visible ? "auto": "none"};
`

const SortOption = styled(Flex)`
	padding: 12px 20px;
	&:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}
	cursor: pointer;
`

type SortContainerProps = {
	visible: boolean,
	options: string[],
	active: string,
	onSelect: (option: string) => void
}

export function SortContainer({
	visible,
	options,
	active,
	onSelect
}: SortContainerProps) {
	return (
		<Container
			column
			visible={visible}>
			{options.map((option, i) => (
				<SortOption
					key={i}
					justify="space-between"
					align="center"
					width="100%"
					onClick={() => onSelect(option)}>
					<Text>{option}</Text>
					{active === option && <Text>x</Text>}
				</SortOption>
			))}
		</Container>
	)
}

type SortButtonProps = {
	label?: string,
	onClick: () => void
}

export function SortButton({ label = "Sort", onClick }: SortButtonProps) {
	return (
		<Button onClick={onClick}>
			<Text fontSize={16}>{label}</Text>
		</Button>
	)
}