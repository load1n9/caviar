import { Entity, Scene } from "../../../mod.ts";
import { BasicParticle, Particle } from "./mod.ts";

interface Settings {
  density: number;
  particleSize: number;
  startingX: number;
  startingY: number;
  gravity: number;
  maxLife: number;
}
export class ParticleSystem extends Entity {
  public particles: Array<Particle> = [];
  constructor(
    public _scene: Scene,
    public settings: Settings,
    public _variant: typeof Particle = BasicParticle,
  ) {
    super(0, 0);
  }

  public update(): void {
    for (let i = 0; i < this.settings.density; i++) {
      if (Math.random() > 0.97) {
        this.particles.push(
          new this._variant(this.particles.length, this.settings),
        );
      }
    }
    this.particles.forEach((particle: Particle) => {
      particle.update();
      if (particle.life > particle.settings.maxLife) {
        this.particles.splice(this.particles.indexOf(particle), 1);
      }
    });
  }
}
