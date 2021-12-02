import { Entity } from "../mod.ts";

export class Point extends Entity {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        super(x,y);
        this.x = x;
        this.y = y;
    }
}
