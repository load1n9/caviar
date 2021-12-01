import { Entity } from "../mod.ts";
import type { RGBA } from "../../types.ts";
import { hexToRGBA } from '../../utils/mod.ts';
export class Rectangle extends Entity {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    public fill: RGBA;
    constructor(x: number, y: number, width: number, height: number, fill: RGBA | string) {
        super(x,y,width,height);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fill = typeof fill === 'string' ? hexToRGBA(fill) : fill;
    }


}
