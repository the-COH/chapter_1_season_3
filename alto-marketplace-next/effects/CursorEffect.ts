import { Vector2 } from "../types"
import { Effect } from "./Effect"

const notes = [
	"/assets/quarter.png",
	"/assets/eighth.png",
	"/assets/double-eighth.png",
	"/assets/treble.png"
]

class CursorParticle {
	x: number;
	y: number;
	createdAt: number;
	slope: Vector2 = {
		x: -1,
		y: 0
	};
	note: null | { image: CanvasImageSource, offset: number } = null;

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
		this.createdAt = Date.now()
	}

	isAlive(lifespan: number = 2500) {
		return (Date.now() - this.createdAt) < lifespan
	}

	randomizeNote(images: CanvasImageSource[], distance: number) {
		if (!images.length) return

		if (Math.random() < Math.max(0.1, Math.min(distance / 40, 0.8))) {
			this.note = {
				image: images[ Math.floor(images.length * Math.random()) ],
				offset: 1 + Math.floor(3 * Math.random())
			}
		}
	}

	calcSlope(nextParticle: CursorParticle) {
		const x = nextParticle.x - this.x
		const y = nextParticle.y - this.y
		const mag = Math.sqrt(x * x + y * y)
		this.slope = {
			x: x / mag,
			y: y / mag
		}
		return this.slope
	}

	update(nextParticle: CursorParticle) {
		this.x += 0.15 * (nextParticle.x - this.x)
		this.y += 0.15 * (nextParticle.y - this.y)
	}
}

export class CursorEffect extends Effect {
	particles: CursorParticle[] = [];
	
	lastAddition: number = -Infinity;
	noteImages: CanvasImageSource[] = [];

	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		enabled: boolean = true
	) {
		super(canvas, ctx, enabled)

		this.ctxSettings = {
			lineCap: "round",
			lineJoin: "round",
			lineWidth: 1,
			filter: `invert(96%) sepia(11%) saturate(223%) hue-rotate(12deg) brightness(96%) contrast(90%)`
		}

		this.noteImages = notes.map(src => {
			const img = new Image()
			img.src = src
			return img
		})
	}

	addParticle(x: number, y: number) {
		if (Date.now() - this.lastAddition < 25) return

		const newParticle = new CursorParticle(x, y)
		if (this.particles.length) {
			const deltaX = newParticle.x - this.particles[0].x
			const deltaY = newParticle.y - this.particles[0].y
			// this.particles[0].calcSlope(newParticle)
			this.particles[0].randomizeNote(this.noteImages, deltaX + deltaY)
			newParticle.slope = {
				x: deltaX > 0 ? 1: -1,
				y: 0
			}
		}
		this.particles.unshift(newParticle)
		this.lastAddition = Date.now()
	}

	update(delta: number) {
		if (!this.enabled) return
		super.update(delta)
		if (!this.particles.length) return

		const drawPoints: CursorParticle[] = []
		for (let i = this.particles.length - 1; i > -1; i--) {
			const particle = this.particles[i]
			if (!particle.isAlive()) {
				this.particles.pop()
				continue
			}
			if (i !== 0) {
				const nextParticle = this.particles[ i - 1 ]
				particle.update(nextParticle)
			}
			drawPoints.push(particle)
		}

		if (!drawPoints.length) return

		this.ctx.save()
		Object.entries(this.ctxSettings).forEach(([ key, value ]) => {
			(this.ctx as any)[ key ] = value
		})
		for (let i = 0; i < 5; i++) {
			const yOffset = 12 * (i - 2)
			this.ctx.beginPath()
			this.ctx.moveTo(drawPoints[0].x, drawPoints[0].y + yOffset)
			for (let j = 1; j < drawPoints.length; j++) {
				const { x, y, note } = drawPoints[j]
				const distanceFromStart = drawPoints.length - 1 - j
				const scale = distanceFromStart < 15
					? (0.5 + 0.5 * Math.cos(Math.PI * (1 - (distanceFromStart / 15))))
					: 1
				const taperedYOffset = yOffset * scale
				this.ctx.lineTo(x, y + taperedYOffset)
				if (note && note.offset === i) this.drawImage({
					image: note.image,
					size: {
						x: 36,
						y: 36
					},
					position: {
						x,
						y: y + taperedYOffset
					},
					scale
				})
			}
			this.ctx.stroke()
		}
		this.ctx.restore()
	}
}