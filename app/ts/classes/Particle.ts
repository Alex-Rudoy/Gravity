import { Vector } from "./Vector";

import { randomBetween } from "../utils/randomBetween";

type RGB = {
  r: number;
  g: number;
  b: number;
};

export class Particle {
  position: Vector;
  velocity: Vector;
  mass: number;
  size: number;
  rgb: RGB;
  color: string;

  constructor(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    mass: number,
    rgb?: RGB
  ) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(velocityX, velocityY);
    this.mass = mass;
    this.size = Math.sqrt(mass / Math.PI);
    this.rgb = {
      r: Math.round(rgb?.r || randomBetween(100, 200)),
      g: Math.round(rgb?.g || randomBetween(100, 200)),
      b: Math.round(rgb?.b || randomBetween(100, 200)),
    };
    this.color = `#${(
      this.rgb.r * 256 * 256 +
      this.rgb.g * 256 +
      this.rgb.b
    ).toString(16)}`;
    console.log(rgb, this.rgb, this.color);
  }

  static newParticleFromTwo(particle1: Particle, particle2: Particle) {
    const mass = particle1.mass + particle2.mass;
    const weightedPosition1 = particle1.position.multiplyBy(particle1.mass);
    const weightedPosition2 = particle2.position.multiplyBy(particle2.mass);
    const resultingPosition = weightedPosition1
      .add(weightedPosition2)
      .divideBy(mass);
    const weightedVelocity1 = particle1.velocity.multiplyBy(particle1.mass);
    const weightedVelocity2 = particle2.velocity.multiplyBy(particle2.mass);
    const resultingVelocity = weightedVelocity1
      .add(weightedVelocity2)
      .divideBy(mass);
    const r =
      (particle1.rgb.r * particle1.mass + particle2.rgb.r * particle2.mass) /
      mass;
    const g =
      (particle1.rgb.g * particle1.mass + particle2.rgb.g * particle2.mass) /
      mass;
    const b =
      (particle1.rgb.b * particle1.mass + particle2.rgb.b * particle2.mass) /
      mass;
    console.log(particle1, particle2, { r, g, b });
    return new Particle(
      resultingPosition.x,
      resultingPosition.y,
      resultingVelocity.x,
      resultingVelocity.y,
      mass,
      { r, g, b }
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2, true);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  forceMove(v: Vector) {
    this.position = this.position.add(v);
  }

  move(secondsPassed: number) {
    this.position = this.position.add(this.velocity.multiplyBy(secondsPassed));
  }

  accelerate(acceleration: Vector) {
    this.velocity = this.velocity.add(acceleration);
  }

  collidesWith(particle: Particle) {
    if (particle === this) return false;
    return (
      this.getRelativePositionTo(particle).length < this.size + particle.size
    );
  }

  getRelativePositionTo(particle: Particle | null): Vector {
    if (!particle) return new Vector(0, 0);
    return this.position.subtract(particle.position);
  }
}
