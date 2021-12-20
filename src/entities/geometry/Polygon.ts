import { Entity, Line, Point } from "../mod.ts";
import type { RGBA } from "../../types.ts";
import { hexToRGBA } from "../../utils/mod.ts";

export class Polygon extends Entity {
  public fill: RGBA;
  public points: Array<Point>;
  public lines: Array<Line> = [];
  constructor(x: number, y: number, points: Array<Point>, fill: RGBA | string) {
    super(x, y);
    this.fill = typeof fill === "string" ? hexToRGBA(fill) : fill;
    this.points = points;
    this.createOutline();
  }

  public createOutline() {
    for (const point of this.points) {
      const i = this.points.indexOf(point);
      this.lines.push(
        i < this.points.length - 1
          ? new Line(point, this.points[i - 1])
          : new Line(point, this.points[0]),
      );
    }
  }
}
