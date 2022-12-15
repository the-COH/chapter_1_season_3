import { ReactNode } from "react"
import Link, { LinkProps } from "next/link"

type PassLinkProps = LinkProps & {
	children: ReactNode | JSX.Element
}

export function PassLink({ children, ...props }: PassLinkProps) {
	return (
		<Link
			passHref
			legacyBehavior
			{...props}>
			{children}
		</Link>
	)
}