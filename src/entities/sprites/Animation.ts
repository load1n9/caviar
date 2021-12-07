import { Entity, Atlas } from "../mod.ts";
import { World } from '../../../mod.ts';

export class Animation  extends Entity {

    public atlas: Atlas;
    public frames: Array<string>;
    public currentFrame = 0;

    constructor(_world: World, x: number, y: number, atlas: Atlas, frames: Array<string>) { 
        super(x, y);
        this.atlas = atlas;
        this.frames = frames;
    }
}