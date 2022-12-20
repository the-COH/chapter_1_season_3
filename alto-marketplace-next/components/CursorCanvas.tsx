import { useEffect, useState } from "react";
import styled from "styled-components";

import { useJazzModeContext } from "../providers/JazzModeProvider";

import { ClickEffect, CursorEffect, EffectManager } from "../effects";

import { CenteredFlex } from "../styles";

const Container = styled(CenteredFlex)`
	position: fixed;
	top: 0px;
	left: 0px;
	right: 0px;
	bottom: 0px;
	pointer-events: none;
	z-index: 10000;
`

export function CursorCanvas() {
	const { jazzCursorEnabled, jazzClickEnabled } = useJazzModeContext()

	const [ canvas, setCanvas ] = useState<HTMLCanvasElement | null>()
	const [ effectManager, setEffectManager ] = useState<EffectManager>()

	useEffect(() => {
		if (!canvas) return

		const onResize = () => {
			canvas.width = window.innerWidth
			canvas.height = window.innerHeight
		}
		onResize()
		window.addEventListener("resize", onResize)

		setEffectManager(new EffectManager(canvas, [
			CursorEffect,
			ClickEffect
		]))

		return () => {
			window.addEventListener("resize", onResize)
			setEffectManager(undefined)
		}
	}, [ canvas ])

	useEffect(() => {
		if (!effectManager) return
		
		effectManager.loop()

		return () => {
			effectManager.end()
		}
	}, [ effectManager ])

	useEffect(() => {
		if (!effectManager) return

		effectManager.toggleEffect(0, jazzCursorEnabled)

		if (!jazzCursorEnabled) return

		const effect = effectManager.effects[0] as CursorEffect

		const onMouseMove = ({ clientX, clientY }: MouseEvent) => {
			effect.addParticle(clientX, clientY)
		}
		window.addEventListener("mousemove", onMouseMove)
		// const onTouchMove = ({ touches }: TouchEvent) => {
		// 	effect.addParticle(touches[0].clientX, touches[0].clientY)
		// }
		// window.addEventListener("touchmove", onTouchMove)

		return () => {
			window.removeEventListener("mousemove", onMouseMove)
			// window.removeEventListener("touchmove", onTouchMove)
		}
	}, [ effectManager, jazzCursorEnabled ])

	useEffect(() => {
		if (!effectManager) return

		effectManager.toggleEffect(1, jazzClickEnabled)

		if (!jazzClickEnabled) return

		const effect = effectManager.effects[1] as ClickEffect

		const onClick = (event: MouseEvent | TouchEvent) => {
			const pos = event.hasOwnProperty("touches")
				? {
					x: (event as TouchEvent).touches[0].clientX,
					y: (event as TouchEvent).touches[0].clientY
				}
				: {
					x: (event as MouseEvent).clientX,
					y: (event as MouseEvent).clientY
				}
			effect.trigger(pos)
		}
		window.addEventListener("click", onClick)

		return () => {
			window.removeEventListener("click", onClick)
		}
	}, [ effectManager, jazzClickEnabled ])

	return (
		<Container>
			<canvas ref={setCanvas}></canvas>
		</Container>
	)
}