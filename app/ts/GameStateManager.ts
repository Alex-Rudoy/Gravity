import { Particle } from "./classes/Particle";
import { Vector } from "./classes/Vector";

import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./utils/constants";
import { randomBetween } from "./utils/randomBetween";

export default class GameStateManager {
  particles: Particle[];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  totalTime: number;
  fullSeconds: number;
  centerOfScreen: Vector;

  constructor() {
    this.particles = [];
    this.canvas = document.querySelector("canvas")!;
    this.ctx = this.canvas.getContext("2d")!;
    this.totalTime = 0;
    this.fullSeconds = 0;
    this.centerOfScreen = new Vector(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

    this.start();
  }

  start() {
    for (let i = 0; i < 500; i++) {
      this.particles.push(
        new Particle(
          randomBetween(CANVAS_WIDTH / 4, (CANVAS_WIDTH / 4) * 3),
          randomBetween(CANVAS_HEIGHT / 4, (CANVAS_HEIGHT / 4) * 3),
          randomBetween(-200, 200),
          randomBetween(-200, 200),
          40
        )
      );
    }
  }

  loop(secondsPassed: number) {
    this.totalTime += secondsPassed;
    this.GRAVITYYYYYYY(secondsPassed);
    this.move(secondsPassed);
    this.resolveColliders();
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // remove previous frame
    this.particles.forEach((particle) => {
      particle.draw(this.ctx);
    });
  }

  move(secondsPassed: number) {
    this.particles.forEach((particle) => {
      particle.move(secondsPassed);
    });
  }

  GRAVITYYYYYYY(secondsPassed: number) {
    this.particles.forEach((particle1) => {
      this.particles.forEach((particle2) => {
        if (particle1 === particle2) return;
        const relativePosition = particle2.getRelativePositionTo(particle1);
        const gravityVector = relativePosition
          .divideBy(relativePosition.length ** 2)
          .multiplyBy(particle2.mass)
          .multiplyBy(secondsPassed)
          .multiplyBy(2);
        particle1.accelerate(gravityVector);
      });
      const toCenterVector = this.centerOfScreen
        .subtract(particle1.position)
        .divideBy(1000);
      particle1.accelerate(toCenterVector);
    });
  }

  resolveColliders() {
    // colliding with others
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i; j < this.particles.length; j++) {
        if (this.particles[i].collidesWith(this.particles[j])) {
          this.particles.push(
            Particle.newParticleFromTwo(this.particles[i], this.particles[j])
          );
          this.particles = this.particles.filter(
            (particle) =>
              particle !== this.particles[i] && particle !== this.particles[j]
          );
          j--;
          i--;
        }
      }
    }
  }
}
