import { Entity, Point } from "../mod.ts";
import type { RGBA } from "../../types.ts";
import { hexToRGBA } from '../../utils/mod.ts';

export class Line extends Entity {
    public p1: Point;
    public p2: Point;
    constructor(p1: Point, p2: Point) {
        super(0,0);
        this.p1 = p1;
        this.p2 = p2;
    }
}
