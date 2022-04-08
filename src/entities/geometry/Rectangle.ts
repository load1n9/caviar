import { Entity } from "../mod.ts";
import type { RGBA } from "../../types.ts";
import { hexToRGBA } from '../../utils/mod.ts';
export class Rectangle extends Entity {
    width: number;
    height: number;
    right: number
    left: number;
    up: number;
    down: number;
    bottom: number;
    fill: RGBA;

    constructor(x: number, y: number, width: number, height: number, fill: RGBA | string) {
        super(x,y);
        this.width = width;
        this.height = height;
        this.right = x + width;
        this.left = x;
        this.up = y;
        this.down = y + height;
        this.bottom = y + height;
        this.fill = typeof fill === 'string' ? hexToRGBA(fill) : fill;
    }

    setFill(c: RGBA | string): void {
        this.fill = typeof c === 'string' ? hexToRGBA(c) : c;
    }

    setAlpha(a: number): void {
        this.fill[3] = a;
    }

}
