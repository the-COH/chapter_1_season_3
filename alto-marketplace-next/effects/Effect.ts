import { Vector2 } from "../types";

type CTXSettings = {
	globalAlpha?: number,
	lineCap?: "round",
	lineJoin?: "round",
	lineWidth?: number,
	strokeStyle?: string,
	fillStyle?: string,
	filter?: string
}

export class Effect {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;

	ctxSettings: CTXSettings = {};
	shouldClear: boolean = false;

	enabled: boolean;

	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		enabled: boolean = true
	) {
		this.canvas = canvas
		this.ctx = ctx

		this.enabled = enabled
	}

	update(delta: number) {
		if (!this.enabled) return
		if (this.shouldClear) this.clear()
	}

	drawImage({
		image,
		position,
		rotation = 0,
		size,
		scale = 1,
		opacity = 1
	}: {
		image: CanvasImageSource,
		position: Vector2,
		rotation?: number,
		size: Vector2,
		scale?: number,
		opacity?: number
	}) {
		this.ctx.save()
		Object.entries(this.ctxSettings).forEach(([ key, value ]) => {
			(this.ctx as any)[ key ] = value
		})
		this.ctx.globalAlpha = opacity
		this.ctx.translate(position.x, position.y)
		this.ctx.rotate(rotation)
		this.ctx.drawImage(
			image,
			-scale * size.x / 2,
			-scale * size.y / 2,
			scale * size.x,
			scale * size.y
		)
		this.ctx.restore()
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}
}