import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react"

import { ReactChildren } from "../types"

export type JazzModeContext = {
	jazzCursorEnabled: boolean,
	setJazzCursorEnabled: Dispatch<SetStateAction<boolean>>,
	jazzClickEnabled: boolean,
	setJazzClickEnabled: Dispatch<SetStateAction<boolean>>
}

export const JazzModeCtx = createContext<JazzModeContext>({
	jazzCursorEnabled: false,
	setJazzCursorEnabled: () => {},
	jazzClickEnabled: false,
	setJazzClickEnabled: () => {}
})

export function useJazzModeContext(): JazzModeContext {
	return useContext(JazzModeCtx)
}

export function JazzModeProvider({ children }: ReactChildren) {
	const [ jazzCursorEnabled, setJazzCursorEnabled ] = useState(false)
	const [ jazzClickEnabled, setJazzClickEnabled ] = useState(false)

	useEffect(() => {
		setJazzCursorEnabled(localStorage.getItem("jazz_cursor_enabled") == "true")
		setJazzClickEnabled(localStorage.getItem("jazz_click_enabled") == "true")
	}, [])

	return (
		<JazzModeCtx.Provider
			value={{
				jazzCursorEnabled,
				setJazzCursorEnabled: (value: SetStateAction<boolean>) => {
					setJazzCursorEnabled(prevValue => {
						const newValue = typeof value === "boolean"
							? value
							: value(prevValue)
						localStorage.setItem("jazz_cursor_enabled", newValue.toString())
						return newValue
					})
				},
				jazzClickEnabled,
				setJazzClickEnabled: (value: SetStateAction<boolean>) => {
					setJazzClickEnabled(prevValue => {
						const newValue = typeof value === "boolean"
							? value
							: value(prevValue)
						localStorage.setItem("jazz_click_enabled", newValue.toString())
						return newValue
					})
				}
			}}>
			{children}
		</JazzModeCtx.Provider>
	)
}
