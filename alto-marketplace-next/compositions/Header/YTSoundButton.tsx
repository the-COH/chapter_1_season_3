import { useState } from "react"
import Youtube from "react-youtube"
import styled from "styled-components"

import { CenteredFlex } from "../../styles"

const Container = styled(CenteredFlex)`
	position: relative;
	width: 40px;
	height: 40px;
	border-radius: 999px;
	border: ${({ theme }) => theme.border.thin};
	overflow: hidden;
	
	& > div {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	& iframe {
		position: absolute;
		transform: translateY(85px);
		opacity: 0;
		pointer-events: none;
	}

	@media(min-width: 576px) {
		width: 48px;
		height: 48px;
	}
	
	cursor: pointer;
`

export function YTSoundButton() {
	const [ player, setPlayer ] = useState<any>()
	const [ isPlaying, setIsPlaying ] = useState(false)

	return (
		<Container onClick={() => {
			if (!player) return

			if (isPlaying) player.pauseVideo()
			else player.playVideo()
		}}>
			<svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M17.6165 7.26123L15.9534 8.92433L17.6165 7.26123ZM15.9534 8.92433L14.2903 10.5874L15.9534 8.92433ZM15.9534 8.92433L14.2903 7.26123L15.9534 8.92433ZM15.9534 8.92433L17.6165 10.5874L15.9534 8.92433Z" fill="#EDE9D7" visibility={isPlaying ? "hidden": "visible"}/>
				<path d="M17.6165 7.26123L15.9534 8.92433M15.9534 8.92433L14.2903 10.5874M15.9534 8.92433L14.2903 7.26123M15.9534 8.92433L17.6165 10.5874" stroke="#EDE9D7" strokeLinecap="round" strokeLinejoin="round" visibility={isPlaying ? "hidden": "visible"}/>
				<path d="M6.39067 5.59815H1.81715C1.3579 5.59815 0.985596 5.97045 0.985596 6.4297V11.419C0.985596 11.8783 1.3579 12.2506 1.81715 12.2506H6.39067L11.7958 16.4083V1.4404L6.39067 5.59815Z" fill="#EDE9D7" stroke="#EDE9D7" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
			<Youtube
				videoId="0hO2IIBLacs"
				opts={{
					width: "560",
					height: "315",
					title: "Smooth Jazz",
					playerVars: {
						autoplay: 1
					}
				}}
				onReady={event => {
					event.target.setLoop(true)
					setPlayer(event.target)
				}}
				onPlay={() => setIsPlaying(true)}
				onPause={() => setIsPlaying(false)}
				onError={() => setIsPlaying(false)}
			/>
		</Container>
	)
}