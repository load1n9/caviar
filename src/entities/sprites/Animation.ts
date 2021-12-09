import { Entity, Atlas } from "../mod.ts";
import { Scene } from '../../../mod.ts';

export class Animation  extends Entity {

    public atlas: Atlas;
    public frames: Array<string>;
    public currentFrame = 0;

    constructor(_scene: Scene, x: number, y: number, atlas: Atlas, frames: Array<string>) { 
        super(x, y);
        this.atlas = atlas;
        this.frames = frames;
    }
}