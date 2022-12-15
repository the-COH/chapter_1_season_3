import { ReactNode } from "react"
import { Text, TextProps } from "../styles"

type ExternalLinkProps = TextProps & {
	href: string,
	children?: ReactNode | ReactNode[] | JSX.Element
}

export function ExternalLink({ href, children, ...props }: ExternalLinkProps) {
	return (
		<Text
			as="a"
			href={href}
			target="_blank"
			rel="noreferrer"
			{...props}>
			{children}
		</Text>
	)
}