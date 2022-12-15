import { Vector2 } from "../types"
import { Effect } from "./Effect"

const saxImg = "/assets/sax.png"

class ClickParticle {
	position: Vector2;
	velocity: Vector2;
	rotation: number;
	rotVelocity: number;
	lifespan: number;

	createdAt: number;

	constructor(position: Vector2) {
		this.position = {
			x: position.x,
			y: position.y
		}
		this.velocity = {
			x: 150 * (1 - 2 * Math.random()),
			y: -200 * Math.random()
		}
		this.rotation = 2 * Math.PI * Math.random()
		this.rotVelocity = 10 * (1 - 2 * Math.random())
		this.lifespan = 3000 + 1000 * Math.random()
		
		this.createdAt = Date.now()
	}

	isAlive() {
		return (Date.now() - this.createdAt) < this.lifespan
	}

	getLifeProgress(offset: number) {
		const adjustedOffset = this.lifespan - offset < 500
			? this.lifespan - 500
			: offset
		return Math.max(
			0,
			(Date.now() - this.createdAt - adjustedOffset) / (this.lifespan - adjustedOffset)
		)
	}

	update(delta: number, gravity: number = 200) {
		this.velocity.y += gravity * delta
		this.position.x += this.velocity.x * delta
		this.position.y += this.velocity.y * delta
		this.rotation += this.rotVelocity * delta
	}
}

export class ClickEffect extends Effect {
	particles: ClickParticle[] = [];
	image: HTMLImageElement;

	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		enabled: boolean = true
	) {
		super(canvas, ctx, enabled)

		this.image = new Image()
		this.image.src = saxImg
	}

	trigger(position: Vector2) {
		this.particles.unshift(
			...Array.from({ length: 30 }, () => new ClickParticle(position))
		)
		this.particles = this.particles.slice(0, 150)
	}

	update(delta: number) {
		if (!this.enabled) return
		super.update(delta)

		for (let i = this.particles.length - 1; i > -1; i--) {
			const particle = this.particles[i]
			if (!particle.isAlive()) {
				this.particles.pop()
				continue
			}
			particle.update(delta)
			this.drawImage({
				image: this.image,
				size: {
					x: 36,
					y: 36
				},
				position: particle.position,
				rotation: particle.rotation,
				scale: 1 - particle.getLifeProgress(2500)
			})
		}
	}
}