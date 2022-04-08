import type { IVector, IVectorLike } from "./types.ts";
import { FuzzyEqual } from "../mod.ts";
export class Vector implements IVector {
  constructor(
    public x: number = 0,
    public y: number = 0,
  ) { }
  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  copy(src: IVector | IVectorLike | Vector): Vector {
    this.x = src.x || 0;
    this.y = src.y || 0;
    return this;
  }

  set(x: number, y?: number): Vector {
    this.x = x;
    this.y = y || x;
    return this;
  }

  setToPolar(azimuth: number, radius = 1): Vector {
    this.x = Math.cos(azimuth) * radius;
    this.y = Math.sin(azimuth) * radius;
    return this;
  }

  equals(v: IVector | IVectorLike | Vector): boolean {
    return ((this.x === v.x) && (this.y === v.y));
  }

  fuzzyEquals(v: IVector | IVectorLike, epsilon = 0.0001): boolean {
    return (FuzzyEqual(this.x, v.x, epsilon) &&
      FuzzyEqual(this.y, v.y, epsilon));
  }

  angle(): number {
    let angle = Math.atan2(this.y, this.x);
    if (angle < 0) angle += 2 * Math.PI;

    return angle;
  }

  setAngle(angle: number) {
    return this.setToPolar(angle, this.length());
  }

  add(src: IVector | IVectorLike | Vector): Vector {
    this.x += src.x;
    this.y += src.y;
    return this;
  }

  subtract(src: IVector | IVectorLike | Vector): Vector {
    this.x -= src.x;
    this.y -= src.y;

    return this;
  }

  multiply(src: IVector | IVectorLike | Vector): Vector {
    this.x *= src.x;
    this.y *= src.y;

    return this;
  }

  scale(value: number): Vector {
    if (isFinite(value)) {
      this.x *= value;
      this.y *= value;
    } else {
      this.x = 0;
      this.y = 0;
    }

    return this;
  }
  divide(src: IVector | IVectorLike | Vector): Vector {
    this.x /= src.x;
    this.y /= src.y;

    return this;
  }

  negate(): Vector {
    this.x = -this.x;
    this.y = -this.y;

    return this;
  }

  distance(src: IVector | IVectorLike | Vector): number {
    const dx = src.x - this.x;
    const dy = src.y - this.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  distanceSq(src: IVector | IVectorLike | Vector): number {
    const dx = src.x - this.x;
    const dy = src.y - this.y;

    return dx * dx + dy * dy;
  }

  length(): number {
    const x = this.x;
    const y = this.y;
    return Math.sqrt(x * x + y * y);
  }

  setLength(length: number): Vector {
    return this.normalize().scale(length);
  }

  lengthSq(): number {
    const x = this.x;
    const y = this.y;

    return x * x + y * y;
  }

  normalize(): Vector {
    const x = this.x;
    const y = this.y;
    let len = x * x + y * y;

    if (len > 0) {
      len = 1 / Math.sqrt(len);

      this.x = x * len;
      this.y = y * len;
    }

    return this;
  }

  normalizeRightHand(): Vector {
    const x = this.x;

    this.x = this.y * -1;
    this.y = x;

    return this;
  }

  normalizeLeftHand(): Vector {
    const x = this.x;

    this.x = this.y;
    this.y = x * -1;

    return this;
  }

  dot(src: IVector | IVectorLike | Vector): number {
    return this.x * src.x + this.y * src.y;
  }

  cross(src: IVector | IVectorLike | Vector): number {
    return this.x * src.y - this.y * src.x;
  }

  lerp(src: IVector | IVectorLike | Vector, t = 0): Vector {
    const ax = this.x;
    const ay = this.y;

    this.x = ax + t * (src.x - ax);
    this.y = ay + t * (src.y - ay);

    return this;
  }

  reset(): Vector {
    this.x = 0;
    this.y = 0;
    return this;
  }

  limit(max: number): Vector {
    const len = this.length();

    if (len && len > max) {
      this.scale(max / len);
    }

    return this;
  }

  reflect(normal: Vector): Vector {
    normal = normal.clone().normalize();
    return this.subtract(normal.scale(2 * this.dot(normal)));
  }

  mirror(axis: Vector): Vector {
    return this.reflect(axis).negate();
  }

  rotate(delta: number): Vector {
    const cos = Math.cos(delta);
    const sin = Math.sin(delta);
    return this.set(cos * this.x - sin * this.y, sin * this.x + cos * this.y);
  }
}
