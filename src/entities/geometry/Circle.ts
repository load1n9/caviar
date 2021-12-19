import { Entity, Point} from "../../../mod.ts";
import type { RGBA } from "../../types.ts";
import { hexToRGBA } from '../../utils/mod.ts';

export class Circle extends Entity {
  public fill: RGBA;
  public radius: number;
  public points: Array<Point> = [];
  constructor(x: number, y: number, radius: number, fill: RGBA | string) {
    super(x, y);
    this.fill = typeof fill === 'string' ? hexToRGBA(fill) : fill;
    this.radius = radius;

    for (let w = 0; w < radius * 2; w++) {
      for (let h = 0; h < radius * 2; h++) {
        const dx = radius - w;
        const dy = radius - h;
        if ((dx * dx + dy * dy) <= (radius * radius)) {
          this.points.push(new Point(this.x + dx, this.y + dy));
        }
      }
    }
  }
}
