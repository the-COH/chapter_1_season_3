import styled, { css } from "styled-components"

import { BASE_URL, BLOCK_EXPLORER_BASE_URL } from "../utils/env-vars"

import { Flex, FlexProps, TextProps } from "../styles"
import { AddressText } from "./AddressText"
import { PassLink } from "./PassLink"

const Container = styled(Flex)<{ variant: "button" | undefined }>`
	${({ variant, theme }) => variant === "button"
		? css`
			height: 40px;
			padding: 0 16px;
			border: ${theme.border.thin};
			border-radius: 20px;
			&:hover {
				background-color: rgba(255, 255, 255, 0.1);
			}
		`
		: css`
			&:hover {
				text-decoration: underline;
			}
		`
	}
`

const ArrowIcon = styled.img<{ invert?: boolean }>`
	width: 12px;
	height: 12px;
	margin-left: 8px;
	${({ invert }) => !invert && css`filter: invert();`}
`

type AddressLinkProps = FlexProps & TextProps & {
	address: string,
	variant?: "button" | undefined,
	type?: "address" | "tx",
	invertArrow?: boolean,
	explorer?: boolean
}

export function AddressLink({
	address,
	variant,
	type = "address",
	invertArrow = false,
	explorer,
	...props
}: AddressLinkProps) {
	if (explorer || type === "tx") return (
		<Container
			as="a"
			href={`${BLOCK_EXPLORER_BASE_URL}${type}/${address}`}
			target="_blank"
			rel="noreferrer"
			justify="space-between"
			align="center"
			variant={variant}
			{...props}>
			<AddressText
				address={address}
				fontWeight="bold"
				whiteSpace="nowrap"
				{...props}
			/>
			<ArrowIcon
				src={BASE_URL + "/icons/arrow-top-right.svg"}
				invert={invertArrow}
			/>
		</Container>
	)

	return (
		<PassLink href={`/profile/${address}`}>
			<Container
				as="a"
				justify="space-between"
				align="center"
				variant={variant}
				{...props}>
				<AddressText
					address={address}
					fontWeight="bold"
					whiteSpace="nowrap"
					{...props}
				/>
				<ArrowIcon
					src={BASE_URL + "/icons/arrow-top-right.svg"}
					invert={invertArrow}
				/>
			</Container>
		</PassLink>
	)
}