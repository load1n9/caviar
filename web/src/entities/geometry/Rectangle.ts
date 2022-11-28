import { Entity } from "../Entity.ts";
import type { RGBA } from "../../types.ts";
import { hexToRGBA } from "../../utils/HexToRGBA.ts";

export class Rectangle extends Entity {
  right: number;
  left: number;
  up: number;
  down: number;
  bottom: number;
  fill: RGBA;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    fill: RGBA | string,
  ) {
    super(x, y);
    this.width = width;
    this.height = height;
    this.right = x + width;
    this.left = x;
    this.up = y;
    this.down = y + height;
    this.bottom = y + height;
    this.fill = typeof fill === "string"
      ? this.colorNorm(hexToRGBA(fill))
      : this.colorNorm(fill);
  }

  setFill(c: RGBA | string): void {
    this.fill = typeof c === "string" ? hexToRGBA(c) : c;
  }
  colorNorm(rgba: RGBA): RGBA {
    return rgba.map((c) => c / 255) as RGBA;
  }
  setAlpha(a: number): void {
    this.fill[3] = a;
  }
}
