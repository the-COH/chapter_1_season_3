import React, { PropsWithChildren, ReactNode } from "react"

export type FCC<P = {}> = React.FC<PropsWithChildren<P>>

export type ReactChildren = {
	children?: ReactNode | JSX.Element | string
}

export type Vector2 = {
	x: number,
	y: number
}