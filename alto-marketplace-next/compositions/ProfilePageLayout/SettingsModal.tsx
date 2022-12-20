import { Dispatch, SetStateAction, useMemo } from "react"
import styled from "styled-components"

import { useJazzModeContext } from "../../providers/JazzModeProvider"

import { Flex, Text } from "../../styles"
import { Modal } from "../../components/Modal"
import { Toggle } from "../../components/Toggle"

const Setting = styled(Flex).attrs(() => ({
	justify: "space-between",
	align: "center"
}))`
	text-transform: uppercase;
`

type SettingModalProps = {
	modalOpen: boolean,
	setModalOpen: Dispatch<SetStateAction<boolean>>
}

export function SettingsModal({
	modalOpen,
	setModalOpen
}: SettingModalProps) {
	const {
		jazzCursorEnabled,
		setJazzCursorEnabled,
		jazzClickEnabled,
		setJazzClickEnabled
	} = useJazzModeContext()

	const funkMeter = useMemo(() => (
		[ jazzCursorEnabled, jazzClickEnabled ].filter(bool => bool).length
	), [ jazzCursorEnabled, jazzClickEnabled ])

	if (!modalOpen) return null

	return (
		<Modal
			title="Settings"
			onClose={() => setModalOpen(false)}
			content={
				<Flex
					column
					gap={24}>
					<Text textAlign="center">
						{funkMeter === 0
							? "Minimal funk detected"
							: funkMeter < 2
								? "You can do better than that"
								: "Now THAT is what I call jazz"
						}
					</Text>
					<Setting>
						<Text>Jazz Cursor</Text>
						<Toggle
							active={jazzCursorEnabled}
							onToggle={() => setJazzCursorEnabled(e => !e)}
						/>
					</Setting>
					<Setting>
						<Text>Jazz Click</Text>
						<Toggle
							active={jazzClickEnabled}
							onToggle={() => setJazzClickEnabled(e => !e)}
						/>
					</Setting>
				</Flex>
			}
		/>
	)
}