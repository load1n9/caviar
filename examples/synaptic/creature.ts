import { Architect } from "https://deno.land/x/synaptic/mod.ts";
import { IWorld } from "./types.ts";
import { Vector } from "./utils.ts";
import { Rectangle, PICO8, TextureSprite } from "../../mod.ts";

export class Creature {
  public network: Architect.Perceptron;
  public mass = 0.3;
  public maxSpeed = 2;
  public maxForce = 0.2;
  public HALF_PI: number = Math.PI * .5;
  public TWO_PI: number = Math.PI * 2;
  public lookRange: number;
  public length: number;
  public base: number;
  public location: Vector;
  public velocity: Vector = new Vector(0, 0);
  public acceleration: Vector = new Vector(0, 0);
  public color = 0xffffff;

  public constructor(public world: IWorld, x: number, y: number) {
    this.network = new Architect.Perceptron(40, 25, 3);
    this.lookRange = this.mass * 200;
    this.length = this.mass * 10;
    this.base = this.length * 0.5;
    this.location = new Vector(x, y);
  }

  public moveTo(networkOutput: any): void {
    const force = new Vector(0, 0);
    const target = new Vector(
      networkOutput[0] * this.world.width,
      networkOutput[1] * this.world.height,
    );
    const angle = (networkOutput[2] * this.TWO_PI) - Math.PI;

    const separation = this.separate(this.world.creatures);
    const alignment = this.align(this.world.creatures).setAngle(angle);
    const cohesion = this.seek(target);

    force.add(separation);
    force.add(alignment);
    force.add(cohesion);

    this.applyForce(force);
  }

  public draw(): void {
    this.update();
    const ctx = this.world.context;
    ctx.entities.forEach((entity) => {
      ctx.killChild(entity);
    });
    const angle = this.velocity.angle;

    const x1 = this.location.x + Math.cos(angle) * this.base;
    const y1 = this.location.y + Math.sin(angle) * this.base;

    const x2 = this.location.x + Math.cos(angle + this.HALF_PI) * this.base;
    const y2 = this.location.y + Math.sin(angle + this.HALF_PI) * this.base;

    const x3 = this.location.x + Math.cos(angle - this.HALF_PI) * this.base;
    const y3 = this.location.y + Math.sin(angle - this.HALF_PI) * this.base;


    ctx.addChild(new TextureSprite(ctx, Math.round(x1), Math.round(y1), {
      data: [
        "..9..9..",
        "..9999..",
        ".AAAAAA.",
        ".A1F1FA.",
        ".AFFFFA.",
        ".FEEEEAA",
        ".EEEEEEA",
        "..E..E..",
      ],
      pixelWidth: 3,
      pixelHeight: 3,
      palette: PICO8,
    }));
    ctx.addChild(new TextureSprite(ctx, Math.round(x2),Math.round(y2), {
      data: [
        "..9..9..",
        "..9999..",
        ".AAAAAA.",
        ".A1F1FA.",
        ".AFFFFA.",
        ".FEEEEAA",
        ".EEEEEEA",
        "..E..E..",
      ],
      pixelWidth: 3,
      pixelHeight: 3,
      palette: PICO8,
    }));
    ctx.addChild(new TextureSprite(ctx, Math.round(x3),Math.round(y3), {
      data: [
        "..9..9..",
        "..9999..",
        ".AAAAAA.",
        ".A1F1FA.",
        ".AFFFFA.",
        ".FEEEEAA",
        ".EEEEEEA",
        "..E..E..",
      ],
      pixelWidth: 3,
      pixelHeight: 3,
      palette: PICO8,
    }));
  }

  public update(): void {
    this.boundaries();

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    if (this.velocity.mag < 1.5) {
      this.velocity.setMag(1.5);
    }
    this.location.add(this.velocity);
    this.acceleration.mul(0);
  }

  public applyForce(force: Vector): void {
    this.acceleration.add(force);
  }

  public boundaries(): void {
    if (this.location.x < 15) {
      this.applyForce(new Vector(this.maxForce * 2, 0));
    }
    if (this.location.x > this.world.width - 15) {
      this.applyForce(new Vector(-this.maxForce * 2, 0));
    }
    if (this.location.y < 15) {
      this.applyForce(new Vector(0, this.maxForce * 2));
    }
    if (this.location.y > this.world.height - 15) {
      this.applyForce(new Vector(0, -this.maxForce * 2));
    }
  }

  public seek(target: Vector): Vector {
    const seek = target.copy.sub(this.location);
    seek.normalize();
    seek.mul(this.maxSpeed);
    seek.sub(this.velocity).limit(0.3);
    return seek;
  }

  public separate(neighboors: Creature[]): Vector {
    const sum = new Vector(0, 0);
    let count = 0;
    for (const i in neighboors) {
      if (neighboors[i] != this) {
        const d = this.location.dist(neighboors[i].location);
        if (d < 24 && d > 0) {
          const diff = this.location.copy.sub(neighboors[i].location);
          diff.normalize();
          diff.div(d);
          sum.add(diff);
          count++;
        }
      }
    }
    if (!count) return sum;

    sum.div(count);
    sum.normalize();
    sum.mul(this.maxSpeed);
    sum.sub(this.velocity);
    sum.limit(this.maxForce);
    return sum.mul(2);
  }

  public align(neighboors: Creature[]) {
    const sum = new Vector(0, 0);
    let count = 0;
    for (const i in neighboors) {
      if (neighboors[i] != this) {
        sum.add(neighboors[i].velocity);
        count++;
      }
    }
    sum.div(count);
    sum.normalize();
    sum.mul(this.maxSpeed);

    sum.sub(this.velocity).limit(this.maxSpeed);

    return sum.limit(.1);
  }

  public cohesion(neighboors: Creature[]) {
    const sum = new Vector(0, 0);
    let count = 0;
    for (const i in neighboors) {
      if (neighboors[i] != this) {
        sum.add(neighboors[i].location);
        count++;
      }
    }
    sum.div(count);
    return sum;
  }
}