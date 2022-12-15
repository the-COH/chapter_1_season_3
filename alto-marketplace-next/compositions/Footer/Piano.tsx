import { useEffect, useState } from "react"
import * as Tone from "tone"
import styled, { css } from "styled-components"

import { CenteredFlex, Flex } from "../../styles"

const Container = styled(Flex)`
	width: 100%;
	padding: 2% 5%;
	background-color: #101010;
`

const Key = styled(CenteredFlex)<{ color: "white" | "black" }>`
	${({ color }) => color === "white"
		? css`
			width: calc(6.667% - 2px);
			aspect-ratio: 0.2;
			background-color: #a09f8f;
		`
		: css`
			width: 3.8%;
			aspect-ratio: 0.2;
			margin: 0 calc(-1.9% - 1px);
			background-color: #505050;
			z-index: 1;
		`
	}
	
	position: relative;
	border-bottom-left-radius: 2px;
	border-bottom-right-radius: 2px;
	&::after {
		content: '';
		width: 100%;
		height: 100%;
		position: absolute;
		border-bottom-left-radius: 2px;
		border-bottom-right-radius: 2px;
		background-color: ${({ color, theme }) => color === "white"
			? theme.textColor.primary
			: theme.backgroundColor.primary
		};
		transition: transform 0.3s ease;
		pointer-events: none;
		transform: scaleY(0.95) translateY(-2.6%);
	}
	&:hover, &:active {
		&::after {
			transform: scaleY(1) translateY(0);
		}
	}

	@media(min-width: 576px) {
		border-bottom-left-radius: ${({ theme }) => theme.borderRadius.small};
		border-bottom-right-radius: ${({ theme }) => theme.borderRadius.small};
		&::after {
			border-bottom-left-radius: ${({ theme }) => theme.borderRadius.small};
			border-bottom-right-radius: ${({ theme }) => theme.borderRadius.small};
		}
	}
`

const keys: { color: "white" | "black", note: string }[] = [
	{ color: "white", note: "C4" }, { color: "black", note: "Db4" }, { color: "white", note: "D4" }, { color: "black", note: "Eb4" }, { color: "white", note: "E4" },
	{ color: "white", note: "F4" }, { color: "black", note: "Gb4" }, { color: "white", note: "G4" }, { color: "black", note: "Ab4" }, { color: "white", note: "A4" }, { color: "black", note: "Bb4" }, { color: "white", note: "B4" },
	{ color: "white", note: "C5" }, { color: "black", note: "Db5" }, { color: "white", note: "D5" }, { color: "black", note: "Eb5" }, { color: "white", note: "E5" },
	{ color: "white", note: "F5" }, { color: "black", note: "Gb5" }, { color: "white", note: "G5" }, { color: "black", note: "Ab5" }, { color: "white", note: "A5" }, { color: "black", note: "Bb5" }, { color: "white", note: "B5" },  { color: "white", note: "C6" }
]

export function Piano() {
	const [ synth, setSynth ] = useState<Tone.Sampler>()

	useEffect(() => {
		const piano = new Tone.Sampler({
			urls: {
				C4: "C4.mp3",
				"D#4": "Ds4.mp3",
				"F#4": "Fs4.mp3",
				A4: "A4.mp3",
				C5: "C5.mp3",
				"D#5": "Ds5.mp3",
				"F#5": "Fs5.mp3",
				A5: "A5.mp3",
			},
			release: 1,
			baseUrl: "https://tonejs.github.io/audio/salamander/"
		}).toDestination()
		Tone.loaded().then(() => setSynth(piano))
	}, [])

	return (
		<Container
			justify="center"
			align="flex-start"
			gap={2}>
				{keys.map(({ color, note }, i) => (
					<Key
						key={i}
						color={color}
						onMouseOver={() => synth?.triggerAttackRelease(note, "8n")}
						onClick={() => synth?.triggerAttackRelease(note, "8n")}
					/>
				))}
		</Container>
	)
}