import { Entity } from '../mod.ts';
import { Scene } from '../../../mod.ts';
import { spriteConfig, Frame } from '../../types.ts';
import { generateFrames } from "../../utils/mod.ts";
export class Sprite extends Entity {
    public width: number;
    public height: number
    public surface: any;
    public texture: any;
    public frames: Array<Frame>;
    public frame: Frame;
    constructor(
        scene: Scene,
        texture: string,
        x: number,
        y: number,
        width: number,
        height: number,
        { rows, cols, }: spriteConfig,
        frame: number = 0,
    ) {
        super(x, y);
        this.width = width;
        this.height = height;
        // this.surface = scene.world.loadSurface(texture);
        // this.texture = scene.world.createTextureFromSurface(this.surface);
        this.frames = generateFrames(this.width, this.height, rows, cols);
        this.frame = this.frames[frame];

    }

    public nextFrame(): void {
        this.frame = this.frames[(this.frames.indexOf(this.frame) + 1) % this.frames.length];
    }
    public previousFrame(): void {
        this.frame = this.frames[(this.frames.indexOf(this.frame) - 1 + this.frames.length) % this.frames.length];
    }
    public setFrame(frame: number): void {
        this.frame = this.frames[frame];
    }

}


