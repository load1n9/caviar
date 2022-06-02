import { Particle } from "./mod.ts";

export class BasicParticle extends Particle {
  update(): void {
    this.vy += this.settings.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
  }
}
