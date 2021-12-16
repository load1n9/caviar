import type { IVector, IVectorLike } from "./types.ts";
import { FuzzyEqual } from "../mod.ts";
export class Vector implements IVector {
  constructor(
    public x: number = 0,
    public y: number = 0,
  ) {}
  public clone(): Vector {
    return new Vector(this.x, this.y);
  }

  public copy(src: IVector | IVectorLike | Vector): Vector {
    this.x = src.x || 0;
    this.y = src.y || 0;
    return this;
  }

  public set(x: number, y?: number): Vector {
    this.x = x;
    this.y = y || x;
    return this;
  }

  public setToPolar(azimuth: number, radius = 1): Vector {
    this.x = Math.cos(azimuth) * radius;
    this.y = Math.sin(azimuth) * radius;
    return this;
  }

  public equals(v: IVector | IVectorLike | Vector): boolean {
    return ((this.x === v.x) && (this.y === v.y));
  }

  public fuzzyEquals(v: IVector | IVectorLike, epsilon = 0.0001): boolean {
    return (FuzzyEqual(this.x, v.x, epsilon) &&
      FuzzyEqual(this.y, v.y, epsilon));
  }

  public angle(): number {
    let angle = Math.atan2(this.y, this.x);
    if (angle < 0) angle += 2 * Math.PI;

    return angle;
  }

  public setAngle(angle: number) {
    return this.setToPolar(angle, this.length());
  }

  public add(src: IVector | IVectorLike | Vector): Vector {
    this.x += src.x;
    this.y += src.y;
    return this;
  }

  public subtract(src: IVector | IVectorLike | Vector): Vector {
    this.x -= src.x;
    this.y -= src.y;

    return this;
  }

  public multiply(src: IVector | IVectorLike | Vector): Vector {
    this.x *= src.x;
    this.y *= src.y;

    return this;
  }

  public scale(value: number): Vector {
    if (isFinite(value)) {
      this.x *= value;
      this.y *= value;
    } else {
      this.x = 0;
      this.y = 0;
    }

    return this;
  }
  public divide(src: IVector | IVectorLike | Vector): Vector {
    this.x /= src.x;
    this.y /= src.y;

    return this;
  }

  public negate(): Vector {
    this.x = -this.x;
    this.y = -this.y;

    return this;
  }

  public distance(src: IVector | IVectorLike | Vector): number {
    const dx = src.x - this.x;
    const dy = src.y - this.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  public distanceSq(src: IVector | IVectorLike | Vector): number {
    const dx = src.x - this.x;
    const dy = src.y - this.y;

    return dx * dx + dy * dy;
  }

  public length(): number {
    const x = this.x;
    const y = this.y;
    return Math.sqrt(x * x + y * y);
  }

  public setLength(length: number): Vector {
    return this.normalize().scale(length);
  }

  public lengthSq(): number {
    const x = this.x;
    const y = this.y;

    return x * x + y * y;
  }

  public normalize(): Vector {
    let x = this.x;
    let y = this.y;
    let len = x * x + y * y;

    if (len > 0) {
      len = 1 / Math.sqrt(len);

      this.x = x * len;
      this.y = y * len;
    }

    return this;
  }

  public normalizeRightHand(): Vector {
    const x = this.x;

    this.x = this.y * -1;
    this.y = x;

    return this;
  }

  public normalizeLeftHand(): Vector {
    const x = this.x;

    this.x = this.y;
    this.y = x * -1;

    return this;
  }

  public dot(src: IVector | IVectorLike | Vector): number {
    return this.x * src.x + this.y * src.y;
  }

  public cross(src: IVector | IVectorLike | Vector): number {
    return this.x * src.y - this.y * src.x;
  }

  public lerp(src: IVector | IVectorLike | Vector, t = 0): Vector {
    const ax = this.x;
    const ay = this.y;

    this.x = ax + t * (src.x - ax);
    this.y = ay + t * (src.y - ay);

    return this;
  }

  public reset(): Vector {
    this.x = 0;
    this.y = 0;
    return this;
  }

  public limit(max: number): Vector {
    const len = this.length();

    if (len && len > max) {
      this.scale(max / len);
    }

    return this;
  }

  public reflect(normal: Vector): Vector {
    normal = normal.clone().normalize();
    return this.subtract(normal.scale(2 * this.dot(normal)));
  }

  public mirror(axis: Vector): Vector {
    return this.reflect(axis).negate();
  }

  public rotate(delta: number): Vector {
    const cos = Math.cos(delta);
    const sin = Math.sin(delta);
    return this.set(cos * this.x - sin * this.y, sin * this.x + cos * this.y);
  }
}
