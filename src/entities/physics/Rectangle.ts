import { PhysicsScene, Entity } from "../../../mod.ts";
import { Matter } from "../../../deps.ts";
import type { RGBA } from "../../types.ts";
import { hexToRGBA } from '../../utils/mod.ts';


export class PhysicsRectangle extends Entity {
    public width: number;
    public height: number;
    public right: number
    public left: number;
    public up: number;
    public down: number;
    public bottom: number;
    public fill: RGBA;
    public body: any;

    constructor(_scene: PhysicsScene, x: number, y: number, width: number, height: number, fill: string | RGBA) {
        super(x,y);
        this.width = width;
        this.height = height;
        this.right = x + width;
        this.left = x;
        this.up = y;
        this.down = y + height;
        this.bottom = y + height;
        this.fill = typeof fill === 'string' ? hexToRGBA(fill) : fill;
        this.body = Matter.Bodies.rectangle(x, y, width, height);
    }

    public setFill(c: RGBA | string): void {
        this.fill = typeof c === 'string' ? hexToRGBA(c) : c;
    }

    public setAlpha(a: number): void {
        this.fill[3] = a;
    }
}