import { CursorEffect } from "./CursorEffect"
import { ClickEffect } from "./ClickEffect"

export class EffectManager {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	effects: (CursorEffect | ClickEffect)[];

	animation: number = 0;
	lastUpdate: number = 0;

	constructor(canvas: HTMLCanvasElement, effects: (typeof CursorEffect | typeof ClickEffect)[]) {
		this.canvas = canvas
		const ctx = canvas.getContext("2d")
		if (!ctx) throw new Error("Failed to get canvas context")
		this.ctx = ctx

		this.effects = effects.map(EffectConstructor => new EffectConstructor(canvas, this.ctx, true))
	}

	toggleEffect(index: number, state: boolean) {
		const effect = this.effects[ index ]
		if (!effect) return
		effect.enabled = state
	}

	resize(width: number = window.innerWidth, height: number = window.innerHeight) {
		this.canvas.width = width
		this.canvas.height = height
	}

	update(delta: number) {
		this.clear()
		this.effects.forEach(effect => effect.update(delta))
	}

	loop(timestamp: number = 0) {
		this.lastUpdate = this.lastUpdate || timestamp
		this.update((timestamp - this.lastUpdate) / 1000)
		this.lastUpdate = timestamp
		this.animation = requestAnimationFrame((timestamp) => this.loop(timestamp))
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	end() {
		cancelAnimationFrame(this.animation)
		this.clear()
	}
}