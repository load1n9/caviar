import { Entity, Point} from "../../../mod.ts";
import type { RGBA } from "../../types.ts";
import { hexToRGBA } from '../../utils/mod.ts';

export class Circle extends Entity {
  public fill: RGBA;
  public radius: number;
  public points: Array<Point> = [];
  public prevX = Infinity;
  public prevY = Infinity;
  constructor(x: number, y: number, radius: number, fill: RGBA | string) {
    super(x, y);
    this.fill = typeof fill === 'string' ? hexToRGBA(fill) : fill;
    this.radius = radius;
  }
  public update() {
    if (this.prevX === this.x && this.prevY === this.y) return;
    this.points = [];
    for (let w = 0; w < this.radius * 2; w++) {
      for (let h = 0; h < this.radius * 2; h++) {
        const dx = this.radius - w;
        const dy = this.radius - h;
        if ((dx * dx + dy * dy) <= (this.radius * this.radius)) {
          this.points.push(new Point(this.x + dx, this.y + dy));
        }
      }
    }
    this.prevX = this.x;
    this.prevY = this.y;
  }
}
